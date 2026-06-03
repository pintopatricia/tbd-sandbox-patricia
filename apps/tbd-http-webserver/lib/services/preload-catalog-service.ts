import {
  CatalogueResponseTypes,
  EnvironmentJSON,
  NormalizersResult,
  ProductsOption,
  ThrottlesState,
  buildViewResult,
} from "@ppb/tbd-store";
import { LayoutPreferencesInput, ViewQueryVariables } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import { FabricParams } from "../@types/FabricParams";
import { HeaderService } from "../@types/HeaderService";
import { Log } from "../@types/Log";
import { TbdCatalogue } from "../@types/tbd-catalogue";
import extractedQueries from "../config/extracted_queries.json";
import { ThrottleOverrides } from "../context";
import { isNotNull } from "../helpers/type-guards";
import { getCriticalChunksAssets } from "../preload-critical-chunks";

type PreloadCatalogState = {
  data: NormalizersResult;
  router?: {
    currentUrn: string | null;
    currentUrl: string | null;
    currentView: string | null;
    category?: string | null;
  };
};

export type PreloadedData = {
  viewRequestPayload: PreloadCatalogState;
  criticalChunksCss: string[];
  criticalChunksJs: string[];
  criticalImages: string[];
};

type QueryType = "AppContext" | "AppVersion";

const ENABLE_PRELOAD_CATALOGUE_EXPERIMENT = {
  id: "exp-preload-catalog",
  variant: "preload-catalog-on",
};

const PRODUCTS_OPTION_TO_USER_PRODUCTS: Record<ProductsOption, CatalogueResponseTypes.UserProducts> = {
  [ProductsOption.exchange]: CatalogueResponseTypes.UserProducts.Exchange,
  [ProductsOption.sportsbook]: CatalogueResponseTypes.UserProducts.Sportsbook,
  [ProductsOption.games]: CatalogueResponseTypes.UserProducts.Games,
};

/**
 * Act as a proxy so we send all correct cookies on BFF requests. This is
 * extremely important since we do our requests directly to the BFF IP.
 *
 * @param $headers Headers Service
 * @param locale User locale
 * @returns The complete cookie string to use on BFF request
 */
function buildCookieHeader($headers: HeaderService, locale: string): string {
  const parts = [];

  const cookies = $headers.getHeader("Cookie");

  if (cookies) {
    parts.push(cookies);
  }

  // Force the locale that we calculated previously
  parts.push(`locale=${locale}`);

  return parts.join(";");
}

/**
 * Find the document id for the view query
 *
 * @param queries The extracted queries
 * @returns The view query or null
 */
function resolveQueryDocumentId(queries: Record<string, string>, prefix: string): string | null {
  const ids = Object.keys(queries);
  const viewQuery = ids.find((id) => id.startsWith(prefix));

  if (!viewQuery) {
    return null;
  }

  return viewQuery;
}

function buildUserPreferencesVariable(
  appContextPreferences: CatalogueResponseTypes.AppContextQuery["AppContext"]["preferences"],
  userProducts?: ProductsOption[],
): Omit<LayoutPreferencesInput, "marketTab" | "moduleLayout"> {
  const {
    favoriteSports: { selectedFavoriteSports },
  } = appContextPreferences;

  return {
    userProducts: userProducts?.map((product) => PRODUCTS_OPTION_TO_USER_PRODUCTS[product]) ?? null,
    favoriteSports: selectedFavoriteSports.map((sport) => sport.urn),
  };
}

const getViewStructure = async (
  $tbdCatalogue: TbdCatalogue,
  router: RouterState,
  appContext: CatalogueResponseTypes.AppContextQuery["AppContext"],
  localeCode: string,
  $headers: HeaderService,
  $params: FabricParams,
  environment: EnvironmentJSON,
  appKey: string,
  throttleOverrides: ThrottleOverrides,
  $log: Log,
  userProducts?: ProductsOption[],
): Promise<{ data: CatalogueResponseTypes.ViewQuery } | undefined> => {
  const { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_VIEW } = environment.CATALOG;
  const documentId = resolveQueryDocumentId(extractedQueries, "View");

  if (!documentId) {
    return undefined;
  }

  const preferences = buildUserPreferencesVariable(appContext.preferences, userProducts);
  const productExclusions = appContext.userdetails.productExclusions.filter((productExclusion) =>
    isNotNull(productExclusion),
  );
  const experiments: ViewQueryVariables["experiments"] = appContext.activeExperiments
    .filter(isNotNull)
    .map((experiment) => ({
      id: experiment.name,
      variant: experiment.variant,
    }));

  const throttlesOn = Array.from(throttleOverrides.on);
  const throttlesOff = Array.from(throttleOverrides.off);

  const variables = {
    urn: router.currentUrn,
    numberOfFilledCardsInCardGroup: FILLED_CARDS_PER_CARD_GROUP,
    numberOfFilledCardsInView: FILLED_CARDS_PER_VIEW,
    withBottomBar: true,
    withPageInfo: true,
    withLeftSidebar: true,
    withRegulatoryData: true,
    preferences,
    productExclusions,
    experiments,
    ...(throttlesOn.length > 0 ? { throttlesOn } : {}),
    ...(throttlesOff.length > 0 ? { throttlesOff } : {}),
  };

  // in case of timeout, serve client without preload data
  try {
    const catalogue = await $tbdCatalogue.post<CatalogueResponseTypes.ViewQuery>("/", "catalog", {
      body: { documentId, variables },
      query: { _ak: appKey, ...(router.currentUrl ? { currentUrl: router.currentUrl } : {}) },
      headers: {
        host: $params.requestHost,
        "Content-Type": "application/json",
        Cookie: buildCookieHeader($headers, localeCode),
      },
    });

    if (catalogue.isSuccess()) {
      return catalogue.data();
    }

    return undefined;
  } catch (e) {
    if (e instanceof Error) {
      $log.error("Error while requesting catalog", e.stack);
    } else {
      $log.error("Error while requesting catalog", e);
    }
    return undefined;
  }
};

function isPreloadCatalogActive(
  throttles: ThrottlesState,
  activeExperiments: CatalogueResponseTypes.AppContextQuery["AppContext"]["activeExperiments"],
): boolean {
  const isThrottleActive = throttles.PRELOAD_CATALOG?.isActive;

  if (isThrottleActive) {
    return true;
  }

  const isExperimentActive = activeExperiments
    .filter(isNotNull)
    .some(
      (experiment) =>
        experiment.name === ENABLE_PRELOAD_CATALOGUE_EXPERIMENT.id &&
        experiment.variant === ENABLE_PRELOAD_CATALOGUE_EXPERIMENT.variant,
    );

  return isExperimentActive;
}

export async function getPreloadedCatalogData(
  $tbdCatalogue: TbdCatalogue,
  router: RouterState,
  appContext: CatalogueResponseTypes.AppContextQuery["AppContext"],
  localeCode: string,
  throttles: ThrottlesState,
  $headers: HeaderService,
  $params: FabricParams,
  environment: EnvironmentJSON,
  appKey: string,
  throttleOverrides: ThrottleOverrides,
  $log: Log,
  userProducts?: ProductsOption[],
): Promise<PreloadedData | undefined> {
  if (!isPreloadCatalogActive(throttles, appContext.activeExperiments)) {
    return undefined;
  }

  const resultView = await getViewStructure(
    $tbdCatalogue,
    router,
    appContext,
    localeCode,
    $headers,
    $params,
    environment,
    appKey,
    throttleOverrides,
    $log,
    userProducts,
  );

  if (!resultView?.data.View || !("__typename" in resultView.data.View)) {
    $log.error("Unable to retrieve preloaded catalog");
    return undefined;
  }

  const viewRequestPayload = buildViewResult(resultView.data);
  const { criticalChunksCss, criticalChunksJs, criticalImages } = getCriticalChunksAssets(viewRequestPayload.data);
  return {
    viewRequestPayload,
    criticalChunksCss,
    criticalChunksJs,
    criticalImages,
  };
}

async function fetchCatalogue<
  ResponseType extends CatalogueResponseTypes.AppContextQuery | CatalogueResponseTypes.AppVersionQuery,
>(
  queryType: QueryType,
  $tbdCatalogue: TbdCatalogue,
  localeCode: string,
  $headers: HeaderService,
  $params: FabricParams,
  appKey: string,
  throttleOverrides: ThrottleOverrides,
): Promise<{ data: ResponseType } | undefined> {
  const documentId = resolveQueryDocumentId(extractedQueries, queryType);

  if (!documentId) {
    return undefined;
  }

  const throttlesOn = Array.from(throttleOverrides.on);
  const throttlesOff = Array.from(throttleOverrides.off);

  const variables = {
    ...(throttlesOn.length > 0 ? { throttlesOn } : {}),
    ...(throttlesOff.length > 0 ? { throttlesOff } : {}),
  };

  const response = await $tbdCatalogue.post<ResponseType>("/", "catalog", {
    body: { documentId, variables },
    query: { _ak: appKey },
    headers: {
      host: $params.requestHost,
      "Content-Type": "application/json",
      Cookie: buildCookieHeader($headers, localeCode),
    },
  });

  if (response.isSuccess()) {
    return response.data();
  }

  return undefined;
}

export const fetchAppContext = (
  $tbdCatalogue: TbdCatalogue,
  localeCode: string,
  $headers: HeaderService,
  $params: FabricParams,
  appKey: string,
  throttleOverrides: ThrottleOverrides,
): Promise<{ data: CatalogueResponseTypes.AppContextQuery } | undefined> =>
  fetchCatalogue<CatalogueResponseTypes.AppContextQuery>(
    "AppContext",
    $tbdCatalogue,
    localeCode,
    $headers,
    $params,
    appKey,
    throttleOverrides,
  );

export const fetchAppVersion = (
  $tbdCatalogue: TbdCatalogue,
  localeCode: string,
  $headers: HeaderService,
  $params: FabricParams,
  appKey: string,
  throttleOverrides: ThrottleOverrides,
): Promise<{ data: CatalogueResponseTypes.AppVersionQuery } | undefined> =>
  fetchCatalogue<CatalogueResponseTypes.AppVersionQuery>(
    "AppVersion",
    $tbdCatalogue,
    localeCode,
    $headers,
    $params,
    appKey,
    throttleOverrides,
  );
