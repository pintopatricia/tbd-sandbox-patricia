import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, defaultDataIdFromObject } from "@apollo/client";
import { PersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { generatePersistedQueryIdsFromManifest } from "@apollo/persisted-query-lists";
import { ApplicationState, createContextForBFFSelector } from "@ppb/tbd-store";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { LocalState } from "@apollo/client/local-state";
import { createViewRedirectLink } from "./view-redirect-link";
import { createCurrentLocationLink } from "./current-location-link";

export type InputDirectives = {
  experiments: {
    id: string;
    variant: string;
  }[];
  preferences: {
    [key: string]: any;
  };
  productExclusions: string[];
  throttlesOn: string[];
  throttlesOff: string[];
};

const getContextForBFF = createContextForBFFSelector();

const persistedQueriesLink = new PersistedQueryLink(
  generatePersistedQueryIdsFromManifest({
    loadManifest: () => import("../pql-catalogue-manifest.json"),
  }),
);

let client: ApolloClient;

const viewRedirectLink = createViewRedirectLink();

/**
 * Middleware that injects all BFF directives into all Apollo requests
 * @param state Redux state
 * @returns Apollo Link
 */
function createDirectivesLink(directives: InputDirectives) {
  return new ApolloLink((operation, forward) => {
    operation.extensions.directives = directives;

    return forward(operation);
  });
}

type ClientOptions = {
  state: ApplicationState;
  catalogueEndpoint: string;
  appKey: string;
  batching: boolean;
};

/**
 * Function to build an HTTP link using the HTTP client configuration
 * @returns HttpLink
 */
export const buildHttpLinks = (options: ClientOptions, baseUri: string) => {
  const { state, batching } = options;
  const { userPreferences, productExclusions, experiments, throttleOverrides } = getContextForBFF(state.entities);

  const directives: InputDirectives = {
    preferences: userPreferences,
    productExclusions,
    experiments,
    throttlesOn: throttleOverrides.throttlesOn || [],
    throttlesOff: throttleOverrides.throttlesOff || [],
  };

  // If batching is disabled use directives as a link
  if (!batching) {
    return [
      createDirectivesLink(directives),
      new HttpLink({
        uri: baseUri,
        includeExtensions: true,
        credentials: "include",
      }),
    ];
  }

  // if batching is enabled we need to inject directives into the http body
  return [
    new BatchHttpLink({
      uri: baseUri,
      includeExtensions: true,
      credentials: "include",
      fetch: (uri, fetchOptions) => {
        if (fetchOptions?.body) {
          return fetch(uri, {
            ...fetchOptions,
            body: `{ "operations": ${fetchOptions.body}, "directives": ${JSON.stringify(directives)} }`,
          });
        }

        return fetch(uri, fetchOptions);
      },
    }),
  ];
};

const buildClientLink = (options: ClientOptions, isDevelopment: boolean): ApolloLink => {
  const baseUri = `${options.catalogueEndpoint}?_ak=${options.appKey}`;
  const httpLinks = buildHttpLinks(options, baseUri);
  const currentLocationLink = createCurrentLocationLink(baseUri);

  return isDevelopment
    ? ApolloLink.from([viewRedirectLink, currentLocationLink, ...httpLinks])
    : ApolloLink.from([viewRedirectLink, currentLocationLink, persistedQueriesLink, ...httpLinks]);
};

/**
 * Builds the apollo client. Will enable persisted queries for production environments
 * and will use BFF as the default endpoint
 *
 * @param state Redux state
 * @returns Apollo Client
 */
export const buildApolloClient = (options: ClientOptions) => {
  const isDevelopment = process.env.NODE_ENV === "development" || !!options?.state.boot.devTools;

  if (isDevelopment) {
    loadDevMessages();
    loadErrorMessages();
  }

  if (client) {
    return client;
  }

  client = new ApolloClient({
    cache: new InMemoryCache({
      dataIdFromObject: (object) => defaultDataIdFromObject({ ...object, _id: object.urn }),
    }),
    link: buildClientLink(options, isDevelopment),
    localState: new LocalState(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
      },
      query: { errorPolicy: "all" },
    },
    devtools: {
      enabled: isDevelopment,
    },
  });

  return client;
};

/**
 * Wipes the Apollo cache except for AppContext and everything it transitively
 *
 * Why this exists instead of clearStore() / resetStore():
 *  - resetStore() wipes the cache AND auto-refetch every active query in
 *    parallel — a refetch storm that produces visible loading flicker on
 *    every AppContext consumer.
 *
 *  - clearStore() wipes the cache without refetching, but then any consumer
 *    reading AppContext fields cache-misses and fires its own request,
 *    racing the AppContext warmup.
 *
 *  - This helper keeps AppContext intact so consumers (loggedIn, brandSettings,
 *    preferences, odds display, etc.) continue to cache-hit and don't blink.
 *
 *  - All AppContext updates are done on App Context Middleware,
 *    which calls this helper after writing the new AppContext to the cache, other
 *    entities get deleted.
 */
export function resetApolloCacheWithAppContext() {
  const cache = getApolloClient().cache;
  const data = cache.extract() as Record<string, any>;
  const appContextField = data.ROOT_QUERY?.AppContext;

  // If AppContext is not in the cache, we can just clear everything without worrying about refetches
  if (!appContextField) {
    cache.reset();
    return;
  }

  /*
    Walk every __ref reachable from AppContext and record the cache ids we must keep alongside it.
    Required because the AppContext entity stores its sub-entities as references
    (e.g. preferences.sportsbookOddsDisplay → { __ref: "SportsbookOddsDisplayPreference:..." })
    If we restored only the top-level entity those refs would dangle, reads would resolve to null,
    and consumers would refetch — defeating the point of this helper.
  */
  const appContextSubEntities = new Set<string>();

  const recursiveWalkThrough = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(recursiveWalkThrough);
      return;
    }

    const ref = (value as { __ref?: unknown }).__ref;

    if (typeof ref === "string") {
      // Guard against cycles and missing targets (refs whose entity is already gone from cache).
      if (appContextSubEntities.has(ref) || !data[ref]) {
        return;
      }

      appContextSubEntities.add(ref);
      recursiveWalkThrough(data[ref]);

      return;
    }

    Object.values(value).forEach(recursiveWalkThrough);
  };
  recursiveWalkThrough(appContextField);

  // Build the minimal new cache state.
  const snapshot: { [key: string]: any } = {
    ROOT_QUERY: {
      __typename: "Query",
      AppContext: appContextField,
    },
  };

  for (const id of appContextSubEntities) {
    snapshot[id] = data[id];
  }

  // restore() replaces the entire normalized store atomically, so watchers
  // receive a single broadcast, and no intermediate state is ever observed.
  cache.restore(snapshot);
}

export const getApolloClient = () => {
  if (!client) {
    throw new Error("Apollo client not initialized");
  }

  return client;
};
