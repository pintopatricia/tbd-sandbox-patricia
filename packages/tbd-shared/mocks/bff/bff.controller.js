// eslint-disable-next-line @typescript-eslint/no-require-imports
const readMockTemplate = require("../read-mock-template");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { validateBFFMock } = require("../utils/validate-mock");

const BFF_PATH_REGEX = ".*api/tbd/bff-gql.*";
const FILLED_CARDS_PER_LAZY_LOAD = 4;

const getLatest = (mockObject) => ({
  pathRegex: ".*api/tbd/bff-gql/latest/",
  response: {
    data: {
      AppVersion: {
        ...mockObject,
        storeUrl: "storeUrl",
        downloadUrl: "downloadUrl",
        versionCode: 1,
        minVersionCode: 0,
        minOSVersion: 8,
        blackList: [
          {
            versioncode: 0,
          },
        ],
      },
    },
  },
  method: "POST",
  statusCode: 200,
});

const getAppContext = (mockObject, { statusCode = 200, queryName = "AppContext" } = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-app-context-mock.hbs`, mockObject);

  return {
    priority: 100,
    pathRegex: BFF_PATH_REGEX,
    body: `.*${queryName}.*`,
    response: templateResponse,
    method: "POST",
    statusCode,
  };
};

const getEventLayout = (mockObject, { cursorFilter = "" } = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-event-view-mock.hbs`, mockObject);

  validateBFFMock("EventViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*${cursorFilter}.*)|(.*"${mockObject.urn}".*${cursorFilter}.*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getBrowseLayout = (mockObject, { cursorFilter = "" } = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-browse-view-mock.hbs`, mockObject);

  validateBFFMock("BrowseViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*${cursorFilter}.*)|(.*"${mockObject.urn}".*${cursorFilter}.*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getSportsLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-sports-view-mock.hbs`, mockObject);
  validateBFFMock("SportViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getRaceLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-race-view-mock.hbs`, mockObject);

  // escape `|` race urn divider
  const urn = mockObject.urn.replace("|", "\\|");

  validateBFFMock("RaceViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${urn}".*)|(.*"${urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getMarketLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-market-view-mock.hbs`, mockObject);

  validateBFFMock("MarketViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getSearchResults = (mockObject) => {
  const { query } = mockObject;
  const response = readMockTemplate(`${__dirname}/data/bff-search-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*SearchView.*"${query}".*)|(.*"${query}".*SearchView.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getCardResults = (mockObject, options = {}) => {
  const urns = mockObject.cards
    .slice(0, FILLED_CARDS_PER_LAZY_LOAD)
    .map((card) =>
      // Escape My Bets Special chars
      card.urn.replaceAll("|", "\\|").replaceAll("?", "\\?").replaceAll("[", "\\[").replaceAll("]", "\\]"),
    )
    .join(".*");

  const response = readMockTemplate(`${__dirname}/data/bff-cards-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*Card.*${urns}.*)|(.*${urns}.*Card.*)`,
    response,
    method: "POST",
    statusCode: options.statusCode || 200,
  };
};

const getFilteredCardResults = (mockObject) => {
  const urns = mockObject.cards.map((card) => card.urn).join(".*");
  const response = readMockTemplate(`${__dirname}/data/bff-cards-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*FilteredCoupon.*"${urns}".*)|(.*"${urns}".*FilteredCoupon.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getFilteredSelectableItemsCardResults = (mockObject) => {
  const urns = mockObject.cards.map((card) => card.urn).join(".*");
  const response = readMockTemplate(`${__dirname}/data/bff-cards-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*FilteredSelectableItemsQuery.*"${urns}".*)|(.*"${urns}".*FilteredSelectableItemsQuery.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getExtraBodyFilters = (extraFilters) => {
  if (!extraFilters) {
    return "";
  }

  return Object.entries(extraFilters)
    .map(([key, value]) => `"${key}":${value}`)
    .join(".*");
};

const getMainMarkets = (mockObject, options = {}) => {
  const urns = mockObject.cards.map((card) => card.urn).join(".*");
  const response = readMockTemplate(`${__dirname}/data/bff-cards-mock.hbs`, mockObject);
  const extraBodyFilters = getExtraBodyFilters(options.extraFilters);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*MainMarkets.*"${urns}".*${extraBodyFilters}.*)|(.*"${urns}".*MainMarkets.*${extraBodyFilters}.*)`,
    response: options.response || response,
    method: "POST",
    statusCode: 200,
  };
};

const getBettingCardDisplayRunners = (mockObject, options = {}) => {
  const response = readMockTemplate(`${__dirname}/data/bff-display-runners-mock.hbs`, mockObject);
  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*BettingCardRunnersDisplay.*)|(.*BettingCardRunnersDisplay.*)`,
    response,
    method: "POST",
    statusCode: options.statusCode || 200,
  };
};

const getMarketRulesLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-market-rules-view-mock.hbs`, mockObject);

  validateBFFMock("MarketRulesViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getCompetitionsLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-competition-view-mock.hbs`, mockObject);

  validateBFFMock("CompetitionViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getGamingLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-gaming-view-mock.hbs`, mockObject);

  validateBFFMock("GamingViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getPlayerViewLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-player-view-mock.hbs`, mockObject);

  // escape `|` race urn divider
  const urn = mockObject.urn.replace("|", "\\|");

  validateBFFMock("PlayerViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${urn}".*)|(.*"${urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getGameLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-game-view-mock.hbs`, mockObject);

  validateBFFMock("GameViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getGamingCategoryLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-gaming-category-view-mock.hbs`, mockObject);

  validateBFFMock("GamingCategoryViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getMyAccountLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-my-account-view-mock.hbs`, mockObject);

  validateBFFMock("MyAccountViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getRunnerInformationLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-runner-view-mock.hbs`, mockObject);

  validateBFFMock("RunnerViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getMyBetsLayout = (mockObject, { cursorFilter = "" } = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-my-bets-view-mock.hbs`, mockObject, {
    // new My Bets URN must be unescaped due to mockServer regex matching
    noEscape: true,
  });

  // Special char need to be escaped
  const urn = mockObject.urn.replace("|", "\\|").replace("?", "\\?").replace("[", "\\[").replace("]", "\\]");

  validateBFFMock("MyBetsViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${urn}".*${cursorFilter}.*)|(.*"${urn}".*${cursorFilter}.*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getSettingsPageLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-settings-view-mock.hbs`, mockObject);

  validateBFFMock("SettingsViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getGenericLayout = (mockObject, { withBottomBar = true } = {}) => {
  // We never contemplated a scenario where we could want a generic page without bottom bar,
  // we always retrieved a default one, this 'withBottomBar' is a hack to avoid changing all existing regression
  // tests, making it default to true to contemplate the previous behaviour. Only tests that don't require it must define it

  const templateResponse = readMockTemplate(`${__dirname}/data/bff-generic-view-mock.hbs`, {
    ...mockObject,
    withBottomBar,
  });

  validateBFFMock("GenericViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

// To avoid DeepLink journey trough safari on iOS
const getHomeLayoutWithViewLink = (viewLinks, { withBottomBar = true } = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-decoy-generic-view-mock.hbs`, {
    ...viewLinks,
    withBottomBar,
  });
  validateBFFMock("GenericViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*ppb:tbd:view:generic:home.*)|(.*ppb:tbd:view:generic:home.*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getWmsMessage = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-wms-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*GetWebMessages.*)|(.*GetWebMessages.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const readWmsMessage = () => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-read-wms-mock.hbs`);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*ReadWebMessage.*)|(.*ReadWebMessage.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getImsPromotionLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-ims-promotion-view-mock.hbs`, mockObject);

  validateBFFMock("ImsPromotionViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getMaintenanceLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-maintenance-view-mock.hbs`, mockObject);

  validateBFFMock("MaintenanceViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*)|(.*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getUpdatedPreference = (mockObject, mutationType = "SetSingleChoicePreferenceMutation") => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-updated-preference-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*mutation.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*${mutationType}.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const setFavouriteMarket = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-set-favourite-market-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: '(.*query":"mutation setFavouriteMarketMutation.*)',
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getObbQuotes = (mockObject = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-obb-quotes-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*documentId":"ObbQuotes.*)|(.*query":"query ObbQuotes.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getObbSquadBetQuotes = (mockObject = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-obb-squad-bet-quotes-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*documentId":"ObbSquadbetQuotes.*)|(.*query":"query ObbSquadbetQuotes.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getObbEventParticipants = (mockObject = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-obb-get-event-participants-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*documentId":"ObbGetEventParticipants.*)|(.*query":"query ObbGetEventParticipants.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getObbImply = (mockObject = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-obb-imply-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*documentId":"ImplyObbBets.*)|(.*query":"query ImplyObbBets.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getObbPlaceBets = (mockObject = {}) => {
  const response = readMockTemplate(`${__dirname}/data/bff-obb-place-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*documentId":"PlaceObbBet.*)|(.*query":"mutation PlaceObbBet.*)`,
    response,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getAcceptImsPromotion = (mockObject) => {
  const response = readMockTemplate(`${__dirname}/data/bff-accept-promotion-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*AcceptPromotion.*)|(.*AcceptPromotion.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getCancelImsPromotion = (mockObject) => {
  const response = readMockTemplate(`${__dirname}/data/bff-cancel-promotion-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*cancelPromotion.*)|(.*cancelPromotion.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};
const getNotFoundLayout = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-not-found-view-mock.hbs`, mockObject);

  validateBFFMock("NotFoundViewFragment", templateResponse);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*View.*"${mockObject.urn}".*)|(.*"${mockObject.urn}".*View.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getMarkets = (mockObject) => {
  const urns = mockObject.markets.map((market) => market.urn).join(".*");
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-markets-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*Markets.*"${urns}".*)|(.*"${urns}".*Markets.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getRaceRunners = (mockObject) => {
  const urns = mockObject.RaceRunners.map((raceRunner) => raceRunner.urn).join(".*");
  const templateResponse = readMockTemplate(`${__dirname}/data/bff-race-runners-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*RaceRunners.*"${urns}".*)|(.*"${urns}".*RaceRunners.*)`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getCardsResponse = (cards = []) => {
  return JSON.stringify(
    {
      data: {
        Cards: cards,
      },
    },
    undefined,
    2,
  );
};

const getQueryCardInterceptRule = (queryName, cards = []) => {
  const response = getCardsResponse(cards);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*query ${queryName}.*)|(.*operationName.*AllCompetitionsFilter.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getQueryCardsResponse = (queryName, cards = []) => {
  return getQueryCardInterceptRule(queryName, cards);
};

const getQueryCardResponse = (queryName, card = {}) => {
  return getQueryCardInterceptRule(queryName, [card]);
};

const getQueryCardResponseByOperation = (operationName, cardResponse = {}) => {
  const response = getCardsResponse([cardResponse]);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*operationName.*${operationName}.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getRunnersResponse = (runners = []) => {
  return JSON.stringify(
    {
      data: {
        Runners: runners,
      },
    },
    undefined,
    2,
  );
};

const getSportsbookChatbotHistory = (mockObject = {}) => {
  const response = readMockTemplate(`${__dirname}/data/bff-sportsbook-chatbot-history-mock.hbs`, mockObject);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*SportsbookChatbotHistory.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getQuerySportsbookBetButtonResponse = (mockObject = {}) => {
  const response = getRunnersResponse([mockObject]);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*SportsbookBetButton.*${mockObject.runnerURN}.*)`,
    response,
    method: "POST",
    statusCode: 200,
  };
};

const getHTTPError = () => ({
  pathRegex: `${BFF_PATH_REGEX}`,
  body: ".*",
  response: "",
  method: ".*",
  statusCode: 500,
});

const getHTTPRateLimitError = () => {
  const response = JSON.stringify(
    {
      error: {
        name: "HttpResponseError",
        message: "Too many requests in a short time period",
        status: 429,
      },
    },
    undefined,
    2,
  );

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: ".*",
    response,
    method: ".*",
    statusCode: 429,
  };
};
const getGamingSearchCardResults = (mockObject, options = {}) => {
  const response = readMockTemplate(`${__dirname}/data/bff-gaming-search-results-mock.hbs`, mockObject);

  validateBFFMock("GamingSearchCardConnection", response);

  return {
    pathRegex: `${BFF_PATH_REGEX}`,
    body: `(.*GamingSearch.*${mockObject}.*)|(.*${mockObject}.*GamingSearch.*)`,
    response,
    method: "POST",
    statusCode: options.statusCode || 200,
  };
};

module.exports = {
  getLatest,
  getAppContext,
  getBrowseLayout,
  getCardResults,
  getCompetitionsLayout,
  getEventLayout,
  setFavouriteMarket,
  getGameLayout,
  getGamingCategoryLayout,
  getGamingLayout,
  getGenericLayout,
  getHomeLayoutWithViewLink,
  getMarketLayout,
  getMarketRulesLayout,
  getMyAccountLayout,
  getMyBetsLayout,
  getRaceLayout,
  getRunnerInformationLayout,
  getSearchResults,
  getSettingsPageLayout,
  getSportsLayout,
  getBettingCardDisplayRunners,
  getFilteredCardResults,
  getFilteredSelectableItemsCardResults,
  getImsPromotionLayout,
  getMaintenanceLayout,
  getMainMarkets,
  getAcceptImsPromotion,
  getCancelImsPromotion,
  getUpdatedPreference,
  getWmsMessage,
  getNotFoundLayout,
  getMarkets,
  getHTTPError,
  getHTTPRateLimitError,
  getRaceRunners,
  readWmsMessage,
  getQueryCardResponse,
  getQueryCardResponseByOperation,
  getQuerySportsbookBetButtonResponse,
  getSportsbookChatbotHistory,
  getGamingSearchCardResults,
  getObbImply,
  getObbPlaceBets,
  getObbQuotes,
  getObbSquadBetQuotes,
  getObbEventParticipants,
  getPlayerViewLayout,
  getQueryCardsResponse,
};
