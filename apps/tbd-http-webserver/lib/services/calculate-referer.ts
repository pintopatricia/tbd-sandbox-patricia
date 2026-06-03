/* eslint-disable no-case-declarations */
import { getSearchEngineFromRefererURL, SEARCH_ENGINES } from "@ppb/affiliates-tracking/utils/search-engines";
import { getUrlParams, RouteTypes } from "@ppb/tbd-routes";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import env from "../config/environment.json";

type RouteTypesUnion =
  | typeof RouteTypes.Sport
  | typeof RouteTypes.Competition
  | typeof RouteTypes.Event
  | typeof RouteTypes.Race
  | typeof RouteTypes.Homepage
  | typeof RouteTypes.InPlay
  | typeof RouteTypes.Gaming
  | typeof RouteTypes.MarketWithoutEvent
  | typeof RouteTypes.OutrightMarket
  | typeof RouteTypes.Antepost;

const OUTRIGHT_MARKET_ROUTES: RouteTypesUnion[] = [
  RouteTypes.MarketWithoutEvent,
  RouteTypes.OutrightMarket,
  RouteTypes.Antepost,
];

const HOMEPAGE_URN = codecs.genericView.home.encode().uid;
const INPLAY_URN = codecs.genericView.inplay.encode().uid;

// Mapping from sport name to sport id
// Extracted from SCAN at 09/09/2022
const SportTypeMapping = {
  football: 1,
  tennis: 2,
  golf: 3,
  cricket: 4,
  boxing: 6,
  "horse-racing": 7,
  politics: 2378961,
  lotteries: 29125756,
  lotterier: 29125756,
  lotterien: 29125756,
  lorteos: 29125756,
  lottó: 29125756,
  lotterie: 29125756,
  loterias: 29125756,
  loterii: 29125756,
  lотереи: 29125756,
  soccer: 1,
  fodbold: 1,
  boksning: 6,
  hesteløb: 7,
  politik: 2378961,
  fußball: 1,
  kricket: 4,
  boxen: 6,
  pferderennen: 7,
  politikwetten: 2378961,
  fútbol: 1,
  tenis: 2,
  criquet: 4,
  boxe: 6,
  "carreras-de-caballos": 7,
  política: 2378961,
  futebol: 1,
  tênis: 2,
  golfe: 3,
  críquete: 4,
  "corrida-de-cavalos": 7,
  "футбол-": 1,
  "теннис-": 2,
  "гольф-": 3,
  крикет: 4,
  бокс: 6,
  скачки: 7,
  политика: 2378961,
  fotball: 1,
  boksing: 6,
  hesteveddeløp: 7,
  politikk: 2378961,
  jalkapallo: 1,
  kriketti: 4,
  nyrkkeily: 6,
  kilparatsastus: 7,
  politiikka: 2378961,
  futball: 1,
  tenisz: 2,
  krikett: 4,
  ökölvívás: 6,
  lóverseny: 7,
  politika: 2378961,
  dart: 3503,
  darts: 3503,
  dardos: 3503,
  дартс: 3503,
};

const GamesTypeMapping = {
  casino: 1,
};

const { PARTNER_IDS_PER_SEARCH_ENGINE } = env;

type SportName = keyof typeof SportTypeMapping;

/**
 * Return the appropriate RFR for marketing tracking
 * Based on the current URL, search engine, and route type
 *
 * Supports both flat strings and objects
 *
 * @param {string} currentURL - The current url
 * @param {SEARCH_ENGINES.Google | SEARCH_ENGINES.Bing} searchEngine The detected search engine
 * @param {RouteTypesUnion} routeType The route type of the current page
 *
 * @returns {string|null} the rfr value
 */
const getReferer = (
  currentUrl: string,
  searchEngine: SEARCH_ENGINES.Google | SEARCH_ENGINES.Bing,
  routeType: RouteTypesUnion,
): string | null => {
  const config = PARTNER_IDS_PER_SEARCH_ENGINE[searchEngine];
  if (typeof config === "string") return config;

  if (RouteTypes.Homepage === routeType) {
    return config[routeType];
  }

  if (RouteTypes.InPlay === routeType) {
    return config.inplay.other;
  }

  const routeConfig = config[routeType as keyof typeof config];

  if (!routeConfig) return null;

  if (typeof routeConfig === "string") return routeConfig;

  const urlParams = getUrlParams(currentUrl, routeType);

  if (!urlParams) {
    return null;
  }

  const { sport, gaming } = urlParams.params;

  const eventTypeId = gaming
    ? (GamesTypeMapping[gaming as keyof typeof GamesTypeMapping] as unknown as keyof typeof routeConfig)
    : (SportTypeMapping[sport as SportName] as unknown as keyof typeof routeConfig);

  const rfr = routeConfig[eventTypeId] || routeConfig.other;
  return rfr ?? null;
};

/**
 * Determines the route type for outright market view based on the current URL
 *
 * @param {string} currentUrl - The current URL
 * @returns {RouteTypesUnion | undefined} The matching route type or undefined if not found
 */
const getMarketViewRouteType = (currentUrl: string): RouteTypesUnion | undefined =>
  OUTRIGHT_MARKET_ROUTES.find((routeType) => !!getUrlParams(currentUrl, routeType));

/**
 * Determines the route type based on the current view and URN
 *
 * @param {string} currentView - The view type
 * @param {string} currentUrn - The current URN
 *
 * @returns {RouteTypesUnion | null} The matching route type or null if not found
 */
const getRouteType = (currentView: string, currentUrn: string, currentUrl: string): RouteTypesUnion | null => {
  if (currentView === EntityType.MarketView) {
    const marketViewRouteType = getMarketViewRouteType(currentUrl);

    return marketViewRouteType || null;
  }

  if (currentView === EntityType.CompetitionView) {
    return RouteTypes.Competition;
  }

  if (currentView === EntityType.GamingView) {
    return RouteTypes.Gaming;
  }

  if (currentView === EntityType.EventView) {
    return RouteTypes.Event;
  }

  if (currentView === EntityType.SportView) {
    return RouteTypes.Sport;
  }

  if (currentView === EntityType.RaceView) {
    return RouteTypes.Race;
  }

  if (currentUrn === INPLAY_URN) {
    return RouteTypes.InPlay;
  }

  if (currentUrn === HOMEPAGE_URN) {
    return RouteTypes.Homepage;
  }

  return null;
};

/**
 * Retrieve the RFR value base in the following tables:
 * BF https://flutteruki.atlassian.net/wiki/spaces/PSAPPB/pages/257754061/SEO+Tracking
 * SBG https://flutteruki.atlassian.net/wiki/spaces/PSAPPB/pages/1071285192/SBG+RFR+Codes
 *
 * @param {string} refererURL url to retrieve search engine
 * @param {RouterState} router the router state, containing current view, url and urn
 * @returns {string|null} the rfr value base on search engine, page type and sport name in case the route matches.
 */

export default function calculateRefererPartnerId(refererURL: string, router: RouterState): string | null {
  const searchEngine = refererURL ? getSearchEngineFromRefererURL(refererURL) : null;

  const { currentUrn, currentUrl, currentView } = router;

  if (!searchEngine) {
    return null;
  }

  // Check for nullability for the routing properties
  // Note: `currentUrl` can be empty string for the home page.
  if (currentUrn === null || currentUrl === null || currentView === null) {
    return null;
  }

  switch (searchEngine) {
    case SEARCH_ENGINES.Yandex:
      return PARTNER_IDS_PER_SEARCH_ENGINE[SEARCH_ENGINES.Yandex];
    case SEARCH_ENGINES.Google:
    case SEARCH_ENGINES.Bing:
      const routeType = getRouteType(currentView, currentUrn, currentUrl);

      if (!routeType) {
        return null;
      }

      return getReferer(currentUrl, searchEngine, routeType);
    case SEARCH_ENGINES.Other:
      return PARTNER_IDS_PER_SEARCH_ENGINE[SEARCH_ENGINES.Other];
    default:
      return null;
  }
}
