import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import {
  PageData,
  PageIdentifier,
  SmdResponse,
} from "@flutter-global/uki-channels-http-clients/src/clients/SeoMetadataService/SeoMetadata";
import URN from "../../state/layout/URN";
import { RouterState } from "../../state/router/RouterState.types";
import { RaceHierarchy, UserDetails } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";

import { getMetadata } from "../../services/seo-metadata-service";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { isRaceHierarchy } from "../../helpers/markets";
import { NormalizersResult } from "../../services/catalogue/normalizer/normalizer-engine";
import { convertToSMDCompliantDateTime } from "../../helpers/dates";
import { isBetfairProduct } from "../../helpers/app-brand";
import { getStore } from "../../create-store";
import { SEO__VIEW_LOADED } from "../../actions/seo";

type PartialPageIdentifier = {
  pageType: string;
} & Partial<PageIdentifier>;

type SeoInput = {
  metaElements: string[];
  pageIdentifier: PartialPageIdentifier;
  pageData: PageData & { coupon?: CurrentCoupon };
};

type GenericWithUrn = {
  urn: string;
};

type CurrentCoupon = {
  couponName: string;
};

const META_ELEMENTS = {
  META_TITLE: "META_TITLE",
  META_DESCRIPTION: "META_DESCRIPTION",
};

const findByUrn = <T extends GenericWithUrn>(urn: string, generics: T[] = []): T | undefined =>
  generics.find((generic) => generic.urn === urn);

const splitLocaleCode = (localeCode: string): { language: string; regionCode?: string } => {
  const [language, regionCode] = localeCode.split("_");

  return { language, regionCode };
};

function extractCouponType(couponURN: string) {
  const regex = /\/(.*?)\//;
  const elementsFound = couponURN.match(regex);

  if (elementsFound && elementsFound[1]) {
    return elementsFound[1];
  }

  return null;
}

function extractCouponIdFromCouponURN(couponURN: string) {
  const regex = /([a-zA-Z0-9]+\/s\/[0-9]+)\?=d=([a-zA-Z0-9]+)/;
  const elementsFound = couponURN.match(regex);

  if (elementsFound && elementsFound[1] && elementsFound[2]) {
    return `${elementsFound[1]}?d=${elementsFound[2]}`;
  }

  return null;
}

function extractEventTypeIdFromCouponId(couponId: string) {
  const regex = /\/s\/(\d+)\?d=/;
  const elementsFound = couponId.match(regex);

  if (elementsFound && elementsFound[1]) {
    return Number(elementsFound[1]);
  }

  return null;
}

/**
 * Builds the seo input for the competition page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (contains data from the page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 */
const buildCompetitionSeoInput = (data: NormalizersResult, currentViewURN: URN): SeoInput | null => {
  const competitionView = findByUrn(currentViewURN, data.CompetitionView);
  if (!competitionView) {
    return null;
  }

  const competition = findByUrn(competitionView.competition, data.Competition);
  if (!competition) {
    return null;
  }

  const sport = findByUrn(competition.sport, data.Sport);
  if (!sport) {
    return null;
  }

  const pageIdentifier: PartialPageIdentifier = {
    pageType: "COMPETITION",
    competitionId: competition.competitionId,
    eventTypeId: sport.sportId,
  };

  const pageData: PageData = {
    competition: {
      competitionName: competition.name,
    },
    eventType: {
      eventTypeName: sport.name,
    },
  };

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Builds the seo input for the market page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (contains data from the page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 */
const buildMarketSeoInput = (data: NormalizersResult, currentViewURN: URN): SeoInput | null => {
  let antepost;
  let eventName;
  let competitionName = "";
  let pageType = "OUTRIGHT_MARKET";

  const marketView = findByUrn(currentViewURN, data.MarketView);
  if (!marketView) {
    return null;
  }

  const market =
    findByUrn(marketView.mainMarket, data.SportsbookMarket) || findByUrn(marketView.mainMarket, data.ExchangeMarket);
  if (!market) {
    return null;
  }

  const sport = findByUrn(market.sport, data.Sport);
  if (!sport) {
    return null;
  }

  if (isRaceHierarchy(market.hierarchy)) {
    const hierarchy = market.hierarchy as RaceHierarchy;
    const meeting = findByUrn(hierarchy.meeting, data.Meeting);

    if (!meeting) {
      return null;
    }

    eventName = meeting.entityName;
  } else {
    const event = findByUrn(market.hierarchy.sportevent, data.SportsEvent);
    if (!event) {
      return null;
    }

    if (!event.competition) {
      pageType = "ANTEPOST";
      antepost = {
        antepostMeetingName: event.name,
        antepostCompetitionName: market.name,
      };
    } else {
      const competition = findByUrn(event.competition, data.Competition);
      if (!competition) {
        return null;
      }

      competitionName = competition.name;
      eventName = event.name;
    }
  }

  const pageIdentifier: PartialPageIdentifier = {
    pageType,
    marketId: market.marketId,
    eventTypeId: sport.sportId,
  };

  const pageData: PageData = {
    ...((eventName || competitionName) && { market: { marketName: market.name } }),
    ...(eventName && { event: { eventName } }),
    ...(competitionName && { competition: { competitionName } }),
    ...(antepost && { antepost }),
  };

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Builds the seo input for the sport page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (contains data from the page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 */
const buildSportSeoInput = (data: NormalizersResult, currentViewURN: string): SeoInput | null => {
  const sportView = findByUrn(currentViewURN, data.SportView);
  if (!sportView) {
    return null;
  }

  const sport = findByUrn(sportView.sport, data.Sport);
  if (!sport) {
    return null;
  }

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  const pageIdentifier: PartialPageIdentifier = {
    pageType: "EVENT_TYPE",
    eventTypeId: sport.sportId,
  };

  const pageData: PageData = {
    eventType: {
      eventTypeName: sport.name,
    },
  };

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Builds the seo input for the event page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (contains data from the page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 */
const buildEventSeoInput = (data: NormalizersResult, currentViewURN: URN): SeoInput | null => {
  const eventView = findByUrn(currentViewURN, data.EventView);
  if (!eventView) {
    return null;
  }

  const event = findByUrn(eventView.sportevent, data.SportsEvent);
  if (!event?.competition) {
    return null;
  }

  const competition = findByUrn(event.competition, data.Competition);
  if (!competition) {
    return null;
  }

  const sport = findByUrn(competition.sport, data.Sport);
  if (!sport) {
    return null;
  }

  const pageIdentifier: PartialPageIdentifier = {
    pageType: "EVENT",
    competitionId: competition.competitionId,
    eventId: event.eventId,
    eventTypeId: sport.sportId,
  };

  const pageData: PageData = {
    competition: {
      competitionName: competition.name,
    },
    event: {
      eventName: event.name,
      eventStartDate: event.openDate,
    },
    eventType: {
      eventTypeName: sport.name,
    },
  };

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Builds the seo input for the racing page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (contains data from the page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 * @param timezone the user's timezone
 */
const buildRacingSeoInput = (data: NormalizersResult, currentViewURN: URN, timezone: string): SeoInput | null => {
  const raceView = findByUrn(currentViewURN, data.RaceView);
  if (!raceView) {
    return null;
  }

  const raceURN = codecs.parse(raceView.urn);
  if (!raceURN) {
    return null;
  }

  const raceViewData = codecs.raceView.extract(raceURN);
  if (!raceViewData) {
    return null;
  }

  const race = findByUrn(raceViewData.race.uid, data.Race);
  if (!race) {
    return null;
  }

  const meeting = findByUrn(race.meeting, data.Meeting);
  if (!meeting) {
    return null;
  }

  const pageIdentifier: PartialPageIdentifier = {
    pageType: "RACE",
    eventTypeId: Number(raceViewData.sport.referenceId),
  };

  const pageData: PageData = {
    race: {
      raceName: race.name,
      venueName: meeting.venue,
      raceTime: convertToSMDCompliantDateTime(race.startTime, timezone),
    },
  };

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Builds the seo input for the Home page and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (empty object in case of Home page)
 * @param currentViewURN the current view URN
 */
const buildGenericSeoInput = (currentViewURN: URN): SeoInput | null => {
  const urn = codecs.parse(currentViewURN);
  const home = "home";
  const inplay = "inplay";
  const referenceId = urn?.referenceId;
  const isHome = referenceId === home;

  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];

  if (isHome || referenceId === inplay) {
    const pageIdentifier: PartialPageIdentifier = {
      pageType: isHome ? "HOMEPAGE" : "IN_PLAY",
    };

    return { metaElements, pageIdentifier, pageData: {} };
  }

  return null;
};

/**
 * Builds the seo input for the Coupon pages and returns an object with three properties:
 * - metaElements (contains the identifiers of meta elements that will be requested)
 * - pageIdentifier (contains data that allows the SEO api to identify the page)
 * - pageData (empty object in case of Home page)
 * @param data the payload normalizers results
 * @param currentViewURN the current view URN
 */
const buildCouponSeoInput = (data: NormalizersResult, currentViewURN: URN): SeoInput | null => {
  const metaElements = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION];
  const pageData = data?.GenericSwitcherCard
    ? {
        coupon: {
          couponName: data.GenericSwitcherCard[0].selectedViewLink.label,
        },
      }
    : {};

  const couponGenericView = findByUrn(currentViewURN, data.GenericView);
  if (!couponGenericView) {
    return null;
  }

  const couponURN = couponGenericView.urn;
  if (!couponURN) {
    return null;
  }

  const couponType = extractCouponType(couponURN);
  if (couponType == null) {
    return null;
  }

  const couponId = extractCouponIdFromCouponURN(couponURN);
  if (!couponId) {
    return null;
  }

  const eventTypeId = extractEventTypeIdFromCouponId(couponId);
  if (!eventTypeId) {
    return null;
  }

  const pageIdentifier: PartialPageIdentifier = {
    pageType: "COUPON",
    couponId,
    eventTypeId,
  };

  return { metaElements, pageIdentifier, pageData };
};

/**
 * Returns the seo metadata title and description for a GameView which are set in prismic gaming documents
 */
const getGameViewSeoMetadata = (data: NormalizersResult, currentViewURN: URN): Promise<SmdResponse | null> => {
  const gameView = findByUrn(currentViewURN, data.GameView);

  if (!gameView) return Promise.resolve(null);

  const gameInfoCard = findByUrn(gameView?.items[0].urn, data.GameInfoCard);

  if (!gameInfoCard) return Promise.resolve(null);

  const game = findByUrn(gameInfoCard?.game, data.Game);

  return Promise.resolve({
    metaTitle: game?.seoMetaData?.metaTitle ?? "",
    metaDescription: game?.seoMetaData?.metaDescription ?? "",
  });
};

/**
 * Returns the seo metadata title and description for a GamingCategoryView which are set in prismic gaming documents
 */
const getGamingCategoryViewSeoMetadata = (
  data: NormalizersResult,
  currentViewURN: URN,
): Promise<SmdResponse | null> => {
  const gamingCategoryView = findByUrn(currentViewURN, data.GamingCategoryView);

  if (!gamingCategoryView) return Promise.resolve(null);

  return Promise.resolve({
    metaTitle: gamingCategoryView?.seoMetaData?.metaTitle ?? "",
    metaDescription: gamingCategoryView?.seoMetaData?.metaDescription ?? "",
  });
};

/**
 * Returns the seo metadata title and description for a GamingView which are set in prismic gaming documents
 */
const getGamingViewSeoMetadata = (data: NormalizersResult, currentViewURN: URN): Promise<SmdResponse | null> => {
  const gamingView = findByUrn(currentViewURN, data.GamingView);

  if (!gamingView) return Promise.resolve(null);

  return Promise.resolve({
    metaTitle: gamingView?.seoMetaData?.metaTitle ?? "",
    metaDescription: gamingView?.seoMetaData?.metaDescription ?? "",
  });
};

function buildSeoInput(router: RouterState, data: NormalizersResult, timezone: string): SeoInput | null {
  const { currentView, currentUrn: currentViewURN } = router;

  if (!currentViewURN) {
    return null;
  }

  switch (currentView) {
    case EntityType.CompetitionView:
      return buildCompetitionSeoInput(data, currentViewURN);
    case EntityType.RaceView:
      return buildRacingSeoInput(data, currentViewURN, timezone);
    case EntityType.MarketView:
      return buildMarketSeoInput(data, currentViewURN);
    case EntityType.SportView:
      return buildSportSeoInput(data, currentViewURN);
    case EntityType.EventView:
      return buildEventSeoInput(data, currentViewURN);
    case EntityType.CouponView:
      return buildCouponSeoInput(data, currentViewURN);
    case EntityType.GenericView:
      return buildGenericSeoInput(currentViewURN);
    default:
      return null;
  }
}

type SmdContext = {
  localeCode: string;
  currencyCode: string;
  loggedIn: boolean;
  productId: string | null;
};

function callSmdMetadata(
  partialPageIdentifier: PartialPageIdentifier,
  pageData: PageData,
  context: SmdContext,
  metaElements: string[] = [META_ELEMENTS.META_TITLE, META_ELEMENTS.META_DESCRIPTION],
): Promise<SmdResponse | null> {
  const { localeCode, currencyCode, loggedIn, productId } = context;
  const { language, regionCode } = splitLocaleCode(localeCode);
  const { hostname, pathname, search } = window.location;
  const baseHref = document.getElementsByTagName("base")[0]?.getAttribute("href") || "";
  const relativePath = pathname.replace(encodeURI(baseHref), "");

  const pageIdentifier = {
    ...partialPageIdentifier,
    host: hostname,
    product: isBetfairProduct(productId) ? "REBUILD" : "SPORTSBOOK",
    deviceType: "MOBILE",
    language,
    regionCode,
    currencyCode,
    path: `/${relativePath}${search}`,
  };

  return getMetadata(metaElements, pageIdentifier, pageData, { isLoggedIn: loggedIn });
}

function resolveSeoMetadata(state: ApplicationState, data: NormalizersResult): Promise<SmdResponse | null> {
  const { router } = state;
  const { localeCode, currencyCode, loggedIn, timezone } = <UserDetails>getUserDetails(state);
  const seoInput = buildSeoInput(router, data, timezone);
  const { currentView, currentUrn: currentViewURN } = router;

  if (currentViewURN) {
    switch (currentView) {
      case EntityType.GameView:
        return getGameViewSeoMetadata(data, currentViewURN);
      case EntityType.GamingCategoryView:
        return getGamingCategoryViewSeoMetadata(data, currentViewURN);
      case EntityType.GamingView:
        return getGamingViewSeoMetadata(data, currentViewURN);
      default:
    }
  }

  if (!seoInput) {
    return Promise.resolve(null);
  }

  return callSmdMetadata(
    seoInput.pageIdentifier,
    seoInput.pageData,
    { localeCode, currencyCode, loggedIn, productId: state.entities.productId },
    seoInput.metaElements,
  );
}

async function resolveAndDispatchSeo(seoInput: SeoInput): Promise<void> {
  const store = getStore();
  const state = store.getState();
  const { localeCode, currencyCode, loggedIn } = <UserDetails>getUserDetails(state);
  const { productId } = state.entities;

  try {
    const response = await callSmdMetadata(
      seoInput.pageIdentifier,
      seoInput.pageData,
      { localeCode, currencyCode, loggedIn, productId },
      seoInput.metaElements,
    );

    if (!response) {
      return;
    }

    store.dispatch({
      type: SEO__VIEW_LOADED,
      payload: {
        metaTitle: response.metaTitle,
        metaDescription: response.metaDescription,
      },
    });
  } catch (error) {
    console.warn(error);
  }
}

export { resolveSeoMetadata, callSmdMetadata, resolveAndDispatchSeo };
export type { SmdContext, PartialPageIdentifier, SeoInput };
