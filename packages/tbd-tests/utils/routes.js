const { buildUrl, RouteTypes } = require("@ppb/tbd-routes");
const { codecs, playerViewCodec } = require("@ppb/tbd-urn-codecs");

// All params available at tbd-routes
const urlParams = {
  meeting: "meetingName",
  sport: "sportName",
  competition: "competitionName",
  event: "eventName",
  market: "marketName",
  gaming: "gamingName",
  tag: "tagName",
  game: "gameName",
  navigation: "navigationName",
  order: "orderName",
  vertical: "verticalName",
  title: "titleName",
  category: "categoryName",
  promotion: "promotion",
};

// This file is now shared between web and native.
// For native tests we don't have a BASE_URL so a fallback to "" was done
const baseUrl = process.env.BASE_URL
  ? process.env.BRAND === "bf" && !process.env.BASE_URL.includes("/betting")
    ? `${process.env.BASE_URL.replace(/\/$/, "")}/betting/`
    : process.env.BASE_URL.split("?")[0]
  : "";

// This file is now shared between web and native.
// For native tests we don't have a BASE_URL so a fallback to "" was done
const extraParms = process.env.BASE_URL?.split("?")[1] || "";

const evaluateThrottlesOverride = (throttleOptions = {}) => {
  const throttlesOn = throttleOptions.turnOn ? `throttlesOn=${throttleOptions.turnOn.join(",")}` : "";
  const throttlesOff = throttleOptions.turnOff ? `throttlesOff=${throttleOptions.turnOff.join(",")}` : "";

  return [throttlesOn, throttlesOff].filter(Boolean).join("&");
};

const getHomeViewUrl = (throttleOptions = {}, customExtraParams) => {
  const throttleOverride = evaluateThrottlesOverride(throttleOptions);

  if (extraParms || customExtraParams) {
    const allParams = [extraParms, customExtraParams, throttleOverride].filter(Boolean).join("&");
    return `${baseUrl}?${allParams}`;
  }

  return [baseUrl, throttleOverride].filter(Boolean).join("?");
};

const getEventViewUrl = (eventId, productPath = true) =>
  [
    `${productPath ? baseUrl : ""}${buildUrl({
      ...urlParams,
      type: RouteTypes.Event,
      urn: codecs.eventView.encode(eventId),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getRaceViewUrl = (raceId, sportId = "7") =>
  [
    `${baseUrl}${buildUrl({
      ...urlParams,
      type: RouteTypes.Race,
      urn: codecs.raceView.encode(sportId, raceId),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getRacingViewUrl = (productPath = true) =>
  [
    `${productPath ? baseUrl : ""}${buildUrl({
      ...urlParams,
      type: RouteTypes.Sport,
      urn: codecs.sportView.encode(7),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getSportViewUrl = (sportId) =>
  [
    `${baseUrl}${buildUrl({
      ...urlParams,
      type: RouteTypes.Sport,
      urn: codecs.sportView.encode(sportId),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getBrowseViewUrl = () =>
  [
    `${baseUrl}${buildUrl({
      ...urlParams,
      type: RouteTypes.Browse,
      urn: codecs.browseView.encode(),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getMyBetsViewUrl = (id, { marketIds, matchedStatus } = {}) =>
  [
    `${baseUrl}${buildUrl({
      ...urlParams,
      type: RouteTypes.MyBets,
      urn: codecs.myBetsView.encode(id, { marketIds, matchedStatus }),
    })}`,
    extraParms,
  ]
    .filter(Boolean)
    .join("?");

const getMyBetsURN = (id, { marketIds, matchedStatus } = {}) =>
  codecs.myBetsView.encode(id, { marketIds, matchedStatus }).uid;

const getMyAccountViewUrl = () =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.MyAccount,
    urn: codecs.myAccountView.encode(),
  })}`;

const getAllMarketsViewUrl = (eventId, productPath = true) =>
  `${productPath ? baseUrl : ""}${buildUrl({
    ...urlParams,
    type: RouteTypes.AllMarkets,
    urn: codecs.allMarketsView.encode(eventId),
  })}`;

const getAllCompetitionsViewUrl = (sportId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.AllCompetitions,
    urn: codecs.allCompetitionsView.encode(sportId),
  })}`;

const getCompetitionViewUrl = (competitionId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.Competition,
    urn: codecs.competitionView.encode(competitionId),
  })}`;

const getGenericViewUrl = (id) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.GenericView,
    urn: codecs.genericView.encode(id),
  })}`;

const getMarketViewUrl = (marketId, productPath = true) =>
  `${productPath ? baseUrl : ""}${buildUrl({
    ...urlParams,
    type: RouteTypes.Market,
    urn: codecs.marketView.encode(marketId),
  })}`;

const getMarketWithoutEventViewUrl = (marketId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.MarketWithoutEvent,
    urn: codecs.marketView.encode(marketId),
  })}`;

const getGamingViewUrl = (gamingId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.Gaming,
    urn: codecs.gamingView.encode(gamingId),
  })}`;

const getImsPromotionViewUrl = (promotionViewId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.ImsPromotion,
    urn: codecs.imsPromotionView.encode(promotionViewId),
  })}`;

const getGamingCategoryViewUrl = (categoryId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.GamingCategory,
    urn: codecs.gamingCategoryView.encode(categoryId),
  })}`;

const getGameViewUrl = (gameId) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.Game,
    urn: codecs.gameView.encode(gameId),
  })}`;

// TODO playerViewCodec should be added  to the generic codecs export
const getPlayerViewUrl = (playerId, playerSlug) =>
  `${baseUrl}${buildUrl({
    ...urlParams,
    type: RouteTypes.Player,
    player: playerSlug,
    urn: playerViewCodec.encode({
      referenceId: playerId,
    }),
  })}`;

module.exports = {
  getHomeViewUrl,
  getEventViewUrl,
  getRaceViewUrl,
  getRacingViewUrl,
  getSportViewUrl,
  getBrowseViewUrl,
  getMyBetsViewUrl,
  getMyBetsURN,
  getMyAccountViewUrl,
  getAllMarketsViewUrl,
  getAllCompetitionsViewUrl,
  getCompetitionViewUrl,
  getGenericViewUrl,
  getMarketViewUrl,
  getMarketWithoutEventViewUrl,
  getGamingViewUrl,
  getImsPromotionViewUrl,
  getGamingCategoryViewUrl,
  getGameViewUrl,
  getPlayerViewUrl,
};
