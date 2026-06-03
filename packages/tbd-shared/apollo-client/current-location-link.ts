import { ApolloLink } from "@apollo/client";
import { getStore } from "@ppb/tbd-store/create-store";

/**
 * Appends `currentUrl` and `currentViewUrn` from Redux to every Apollo
 * request as URL query params. Read by the BFF's url-service and
 * metadata-response-headers plugin.
 */
export function createCurrentLocationLink(baseUri: string): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const { currentUrl, currentUrn } = getStore().getState().router;

    if (!currentUrl && !currentUrn) {
      return forward(operation);
    }

    const url = new URL(baseUri);

    if (currentUrl) {
      url.searchParams.set("currentUrl", currentUrl);
    }

    if (currentUrn) {
      url.searchParams.set("currentViewUrn", currentUrn);
    }

    operation.setContext({ uri: url.toString() });

    return forward(operation);
  });
}
