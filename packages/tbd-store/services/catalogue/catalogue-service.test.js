import CatalogueClient from "../../clients/catalogue/catalogue-client";
import {
  FilteredGroupSort,
  DefaultProduct,
  ExchangeDefaultProduct,
  LastViewedProduct,
  RaceCountriesFilterOptions,
  Supplier,
  UserProducts,
} from "../../clients/catalogue/catalogue-response-types";
import {
  mapDefaultProductOptionToDefaultProduct,
  mapLastViewedProductOptionToLastViewedProduct,
  mapStringToExchangeDefaultProduct,
  mapStringToUserProducts,
  updateUserProductsList,
} from "../../helpers/preferences";
import { ProductExclusion } from "../../state";
import { SelectableItemsFilterOptions } from "../../state/constants";

import {
  buildCardsLayout,
  buildFullCardLayout,
  buildRunnersDisplayUpdatesPayload,
  buildFilteredCouponLayout,
  buildMainMarketsUpdatesPayload,
  buildFilteredSelectableItemsLayout,
} from "./cards-mapper";
import CatalogueService from "./catalogue-service";
import { buildFavouriteMarkets } from "./favourite-markets-mapper";
import { buildMarketsEntities } from "./markets-mapper";
import { buildRaceRunnersPastPerformancesPayload } from "./race-runners-mapper";
import { buildSearchResult } from "./search-mapper";
import { buildViewResult } from "./view-mapper";
import { convertUserPreferences } from "./user-preferences-converter";
import { buildVirtualMarketsEntities } from "./virtual-markets-mapper";

// Get the spies we mocked for CatalogueClient
const getLayoutSpy = CatalogueClient().getLayout;
const getSearchResultsSpy = CatalogueClient().getSearchResults;
const getGamingSearchResultsSpy = CatalogueClient().getGamingSearchResults;
const getCardsSpy = CatalogueClient().getCards;
const getFullCardSpy = CatalogueClient().getFullCard;
const getSortableCardsDisplayRunnersUpdatesSpy = CatalogueClient().getSortableCardsDisplayRunnersUpdates;
const getMainMarketsUpdatesSpy = CatalogueClient().getMainMarketsUpdates;
const getFilteredCouponSpy = CatalogueClient().getFilteredCoupon;
const getFilteredSelectableItemsCardGroupSpy = CatalogueClient().getFilteredSelectableItemsCardGroup;
const getMarketsSpy = CatalogueClient().getMarkets;
const getVirtualMarketsSpy = CatalogueClient().getVirtualMarkets;
const getRaceRunnersSpy = CatalogueClient().getRaceRunners;
const acceptImsPromotionSpy = CatalogueClient().acceptImsPromotion;
const cancelImsPromotionSpy = CatalogueClient().cancelImsPromotion;
const setSingleChoicePreferenceSpy = CatalogueClient().setSingleChoicePreference;
const getWebMessagesSpy = CatalogueClient().getWebMessages;
const getObbQuotesSpy = CatalogueClient().getObbQuotes;
const placeObbBetSpy = CatalogueClient().placeObbBet;
const getObbEventParticipantsSpy = CatalogueClient().getObbEventParticipants;
const getObbSquadbetQuotesSpy = CatalogueClient().getObbSquadbetQuotes;
const readWebMessageSpy = CatalogueClient().readWebMessage;
const setExchangeDefaultProductPreferenceSpy = CatalogueClient().setExchangeDefaultProductPreference;
const setUserProductsPreferenceSpy = CatalogueClient().setUserProductsPreference;
const setDefaultProductPreferenceSpy = CatalogueClient().setDefaultProductPreference;
const setConfirmCashoutPreferenceSpy = CatalogueClient().setConfirmCashoutPreference;
const setLastViewedProductPreferenceSpy = CatalogueClient().setLastViewedProductPreference;
const setFavouriteMarketSpy = CatalogueClient().setFavouriteMarket;

const preferencesMock = {
  userProducts: ["EXCHANGE", "GAMES"],
  favoriteSports: ["ppb:eventType:sport_id_1"],
};

const EXPERIMENTS = [
  { id: "experiment-id-1", variant: "something-something-darkside" },
  { id: "experiment-id-2", variant: "something-something-lightside" },
];

jest.mock("./user-preferences-converter", () => ({
  convertUserPreferences: jest.fn().mockReturnValue({}),
}));

jest.mock("../../clients/catalogue/catalogue-client", () => {
  const getLayout = jest.fn(() => "layoutResponse");
  const getSearchResults = jest.fn(() => "searchResponse");
  const getGamingSearchResults = jest.fn(() => "gamingSearchResponse");
  const getCards = jest.fn(() => "cardsResponse");
  const getFullCard = jest.fn(() => "fullCardResponse");
  const getSortableCardsDisplayRunnersUpdates = jest.fn(() => "RunnersDisplayUpdatesResult");
  const getMainMarketsUpdates = jest.fn(() => "MainMarketsUpdatesResult");
  const getFilteredCoupon = jest.fn(() => "filteredCouponResponse");
  const getFilteredSelectableItemsCardGroup = jest.fn(() => "filteredSelectableItemsCardGroupResponse");
  const getMarkets = jest.fn(() => ({ Markets: "marketsResponse" }));
  const getVirtualMarkets = jest.fn(() => ({ VirtualMarkets: "virtualMarketsResponse" }));
  const getRaceRunners = jest.fn(() => ({ RaceRunners: "raceRunnersResponse" }));
  const acceptImsPromotion = jest.fn(() => "acceptImsPromotion");
  const cancelImsPromotion = jest.fn(() => "cancelImsPromotion");
  const setSingleChoicePreference = jest.fn(() => "setSingleChoicePreference");
  const getWebMessages = jest.fn(() => "webMessages");
  const getObbQuotes = jest.fn(() => "obbQuotes");
  const placeObbBet = jest.fn(() => "placeObbBet");
  const getObbEventParticipants = jest.fn(() => "obbEventParticipants");
  const getObbSquadbetQuotes = jest.fn(() => "getObbSquadbetQuotes");
  const readWebMessage = jest.fn(() => "readWebMessage");
  const setExchangeDefaultProductPreference = jest.fn(() => "setExchangeDefaultProductPreference");
  const setUserProductsPreference = jest.fn(() => "setUserProductsPreference");
  const setDefaultProductPreference = jest.fn(() => "setDefaultProductPreference");
  const setConfirmCashoutPreference = jest.fn(() => "setConfirmCashoutPreference");
  const setLastViewedProductPreference = jest.fn(() => "setLastViewedProductPreference");
  const setFavouriteMarket = jest.fn(() => "setFavouriteMarket");

  return jest.fn().mockReturnValue({
    getLayout,
    getSearchResults,
    getGamingSearchResults,
    getCards,
    getFullCard,
    getSortableCardsDisplayRunnersUpdates,
    getMainMarketsUpdates,
    getFilteredCoupon,
    getFilteredSelectableItemsCardGroup,
    getMarkets,
    getVirtualMarkets,
    getRaceRunners,
    acceptImsPromotion,
    cancelImsPromotion,
    setSingleChoicePreference,
    getWebMessages,
    placeObbBet,
    getObbQuotes,
    getObbEventParticipants,
    getObbSquadbetQuotes,
    readWebMessage,
    setExchangeDefaultProductPreference,
    setUserProductsPreference,
    setDefaultProductPreference,
    setConfirmCashoutPreference,
    setLastViewedProductPreference,
    setFavouriteMarket,
  });
});

jest.mock("../client-factory", () => ({
  createClientFactory: jest.fn(() => CatalogueClient),
}));

jest.mock("./preference-mapper", () => ({
  buildDefaultProductResult: jest.fn(() => "buildDefaultProductResult"),
  buildExchangeDefaultProductResult: jest.fn(() => "buildExchangeDefaultProductResult"),
  buildLastViewedProductResult: jest.fn(() => "buildLastViewedProductResult"),
  buildSingleChoiceResult: jest.fn(() => "buildSingleChoiceResult"),
  buildUserProductsResult: jest.fn(() => "buildUserProductsResult"),
  buildConfirmCashoutResult: jest.fn(() => "buildConfirmCashoutResult"),
}));
jest.mock("./favourite-markets-mapper", () => ({ buildFavouriteMarkets: jest.fn(() => "buildFavouriteMarkets") }));

jest.mock("./virtual-markets-mapper", () => ({ buildVirtualMarketsEntities: jest.fn(() => "virtualMarketEntities") }));
jest.mock("./markets-mapper", () => ({ buildMarketsEntities: jest.fn(() => "marketEntities") }));
jest.mock("./race-runners-mapper", () => ({
  buildRaceRunnersPastPerformancesPayload: jest.fn(() => "buildRaceRunnersPastPerformancesPayload"),
}));
jest.mock("./view-mapper", () => ({ buildViewResult: jest.fn(() => "viewMappedResponse") }));
jest.mock("./search-mapper", () => ({ buildSearchResult: jest.fn(() => "searchMappedResponse") }));
jest.mock("./cards-mapper", () => ({
  buildCardsLayout: jest.fn(() => "cardsMappedResponse"),
  buildFullCardLayout: jest.fn(() => "fullCardMappedResponse"),
  buildRunnersDisplayUpdatesPayload: jest.fn(() => "buildRunnersDisplayUpdatesResponse"),
  buildMainMarketsUpdatesPayload: jest.fn(() => "buildMainMarketsUpdatesPayload"),
  buildFilteredCouponLayout: jest.fn(() => "filteredCouponMappedResponse"),
  buildFilteredSelectableItemsLayout: jest.fn(() => "filteredSelectableItemsResponse"),
}));
jest.mock("./obb-leg-mapper", () => ({
  buildObbSquadBetLegResult: jest.fn(() => "buildObbSquadBetLegResultResponse"),
}));
jest.mock("../../helpers/preferences", () => ({
  mapDefaultProductOptionToDefaultProduct: jest.fn(),
  mapLastViewedProductOptionToLastViewedProduct: jest.fn(),
  mapProductOptionsListToUserProductsList: jest.fn(),
  mapStringToExchangeDefaultProduct: jest.fn(),
  mapStringToUserProducts: jest.fn(),
  updateUserProductsList: jest.fn(),
}));

jest.mock("../../clients/catalogue/virtual_markets_query.graphql", () => "graphqlVirtualMarketsQuery");
jest.mock("../../clients/catalogue/markets_query.graphql", () => "graphqlMarketsQuery");
jest.mock("../../clients/catalogue/race_runners_query.graphql", () => "graphqlRaceRunnersQuery");
jest.mock("../../clients/catalogue/search_query.graphql", () => "graphqlQuerySearch");
jest.mock("../../clients/catalogue/gaming_search_query.graphql", () => "graphqlQueryGamingSearch");
jest.mock("../../clients/catalogue/view_query.graphql", () => "graphqlViewQuery");
jest.mock("../../clients/catalogue/card_query.graphql", () => "graphqlCardsQuery");
jest.mock("../../clients/catalogue/full_card_query.graphql", () => "graphqlFullCardsQuery");
jest.mock("../../clients/catalogue/betting_card_runners_display_query.graphql", () => "bettingCardRunnersDisplayQuery");
jest.mock("../../clients/catalogue/main_markets_query.graphql", () => "mainMarketsQuery");
jest.mock("../../clients/catalogue/filtered_coupon_query.graphql", () => "filteredCouponQuery");
jest.mock("../../clients/catalogue/filtered_selectable_items_query.graphql", () => "filteredSelectableItemsQuery");
jest.mock("../../clients/catalogue/accept_promotion_mutation.graphql", () => "graphqlMutationAccept");
jest.mock("../../clients/catalogue/cancel_promotion_mutation.graphql", () => "graphqlMutationCancel");
jest.mock(
  "../../clients/catalogue/single_choice_preference_mutation.graphql",
  () => "graphqlMutationSingleChoicePreference",
);
jest.mock("../../clients/catalogue/favourite_markets_mutation.graphql", () => "setFavouriteMarketMutation");
jest.mock("../../clients/catalogue/get_web_messages_query.graphql", () => "getWebMessagesQuery");
jest.mock("../../clients/catalogue/read_web_message_mutation.graphql", () => "readWebMessageMutation");
jest.mock("../../clients/catalogue/place_obb_bet.graphql", () => "placeObbBetMutation");
jest.mock("../../clients/catalogue/obb_quotes_query.graphql", () => "getObbQuotesQuery");
jest.mock("../../clients/catalogue/obb_get_event_participants_query.graphql", () => "getObbEventParticipantsQuery");
jest.mock("../../clients/catalogue/obb_squadbet_quotes_query.graphql", () => "getObbSquadbetQuotesQuery");

jest.mock(
  "../../clients/catalogue/exchange_default_product_preference_mutation.graphql",
  () => "exchangeDefaultProductPreferenceMutation",
);
jest.mock(
  "../../clients/catalogue/default_product_preference_mutation.graphql",
  () => "defaultProductPreferenceMutation",
);
jest.mock(
  "../../clients/catalogue/confirm_cashout_preference_mutation.graphql",
  () => "confirmCashoutPreferenceMutation",
);
jest.mock(
  "../../clients/catalogue/last_viewed_product_preference_mutation.graphql",
  () => "lastViewedProductPreferenceMutation",
);
jest.mock("../../clients/catalogue/user_products_preference_mutation.graphql", () => "userProductsPreferenceMutation");

const THROTTLE_OVERRIDES = {
  throttlesOn: ["foo", "bar"],
  throttlesOff: ["baz"],
};

const ROUTER_MOCK = {
  currentView: "",
};

describe("CatalogueService", () => {
  afterEach(jest.clearAllMocks);

  describe("API", () => {
    it("should expose all methods", () => {
      expect(CatalogueService.getLayout).toBeDefined();
      expect(CatalogueService.getSearchResults).toBeDefined();
      expect(CatalogueService.getGamingSearchResults()).toBeDefined();
      expect(CatalogueService.getFullCard).toBeDefined();
      expect(CatalogueService.getSortableCardsDisplayRunnersUpdates).toBeDefined();
      expect(CatalogueService.getMainMarketsUpdates).toBeDefined();
      expect(CatalogueService.getFilteredCoupon).toBeDefined();
      expect(CatalogueService.acceptImsPromotion).toBeDefined();
      expect(CatalogueService.cancelImsPromotion).toBeDefined();
      expect(CatalogueService.setSingleChoicePreference).toBeDefined();
      expect(CatalogueService.setExchangeDefaultProductPreference).toBeDefined();
      expect(CatalogueService.setUserProductsPreference).toBeDefined();
      expect(CatalogueService.setDefaultProductPreference).toBeDefined();
      expect(CatalogueService.setConfirmCashoutPreference).toBeDefined();
      expect(CatalogueService.setLastViewedProductPreference).toBeDefined();
      expect(CatalogueService.getMarkets).toBeDefined();
      expect(CatalogueService.getVirtualMarkets).toBeDefined();
      expect(CatalogueService.getWebMessages).toBeDefined();
      expect(CatalogueService.readWebMessage).toBeDefined();
      expect(CatalogueService.getFilteredSelectableItems).toBeDefined();
      expect(CatalogueService.placeObbBet).toBeDefined();
      expect(CatalogueService.getObbQuotes).toBeDefined();
      expect(CatalogueService.getObbEventParticipants).toBeDefined();
      expect(CatalogueService.getObbSquadbetQuotes).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("getLayout", () => {
      it("should call getLayout method with the urn", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and regulatory sections", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and bottom bar", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3, undefined);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and page info", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3, true, undefined, undefined);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and cursor", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3, undefined, undefined, undefined, "cursor");

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          "cursor",
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and regulatory data", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3, undefined, true);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          true,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with currentUrl", () => {
        CatalogueService.getLayout(
          "fakeUrn",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          "https://www.betfair.com/betting/football/sport:1",
          undefined,
        );

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          undefined,
          "https://www.betfair.com/betting/football/sport:1",
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and product exclusions", () => {
        CatalogueService.getLayout("fakeUrn", 4, 3, undefined, undefined, undefined, undefined, undefined, undefined, [
          ProductExclusion.Games,
        ]);

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {},
          ["GAMES"],
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn and transformed user preferences", () => {
        convertUserPreferences.mockReturnValue({
          favoriteSports: ["ppb:eventType:sport_id_1"],
          userProducts: ["EXCHANGE", "GAMES"],
        });

        CatalogueService.getLayout(
          "fakeUrn",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          preferencesMock,
        );

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call getLayout method with the urn, experiments, throttleOverrides and decorationsOnly", () => {
        CatalogueService.getLayout(
          "fakeUrn",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          true,
        );

        expect(getLayoutSpy).toHaveBeenCalledWith(
          "fakeUrn",
          "graphqlViewQuery",
          4,
          3,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          undefined,
          undefined,
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          true,
        );
      });

      it("should call buildViewResult with the client response", async () => {
        await CatalogueService.getLayout(null, 4, 3);

        expect(buildViewResult).toHaveBeenCalledWith("layoutResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getLayout();

        expect(result).toBe("viewMappedResponse");
      });
    });

    describe("getSearchResults", () => {
      it("should call CatalogueClient getLayout method with the urn", async () => {
        await CatalogueService.getSearchResults("porto");

        expect(getSearchResultsSpy).toHaveBeenCalledWith(
          "porto",
          "graphqlQuerySearch",
          preferencesMock,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getLayout method with passed preferences", async () => {
        await CatalogueService.getSearchResults("porto", preferencesMock);

        expect(convertUserPreferences).toHaveBeenCalledWith({
          userProducts: [UserProducts.Exchange, UserProducts.Games],
          favoriteSports: ["ppb:eventType:sport_id_1"],
        });

        expect(getSearchResultsSpy).toHaveBeenCalledWith(
          "porto",
          "graphqlQuerySearch",
          preferencesMock,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getLayout method with passed productExclusions", async () => {
        await CatalogueService.getSearchResults("porto", preferencesMock, [ProductExclusion.Games]);

        expect(getSearchResultsSpy).toHaveBeenCalledWith(
          "porto",
          "graphqlQuerySearch",
          preferencesMock,
          ["GAMES"],
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getLayout method with passed experiments and throttleOverrides", async () => {
        await CatalogueService.getSearchResults(
          "porto",
          preferencesMock,
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
        );

        expect(getSearchResultsSpy).toHaveBeenCalledWith(
          "porto",
          "graphqlQuerySearch",
          preferencesMock,
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
        );
      });

      it("should call buildSearchResult", async () => {
        await CatalogueService.getSearchResults("porto");

        expect(buildSearchResult).toHaveBeenCalledWith("searchResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getSearchResults("porto");

        expect(result).toBe("searchMappedResponse");
      });
    });

    describe("getGamingSearchResults", () => {
      it("should call CatalogueClient getGamingSearchResults with query and first", async () => {
        await CatalogueService.getGamingSearchResults("jackpot", 15);

        expect(getGamingSearchResultsSpy).toHaveBeenCalledWith("jackpot", "graphqlQueryGamingSearch", 15, undefined);
      });

      it("should call CatalogueClient getGamingSearchResults with query, first, and after cursor", async () => {
        await CatalogueService.getGamingSearchResults("jackpot", 15, "cursor123");

        expect(getGamingSearchResultsSpy).toHaveBeenCalledWith("jackpot", "graphqlQueryGamingSearch", 15, "cursor123");
      });
    });

    describe("getCards", () => {
      it("should call CatalogueClient getCards method with the partial Urns and numberOfFilledCardsInCardGroup", async () => {
        await CatalogueService.getCards(["1", "2", "3"], 4);

        expect(getCardsSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "graphqlCardsQuery",
          4,
          preferencesMock,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns numberOfFilledCardsInCardGroup and prefs", async () => {
        await CatalogueService.getCards(["1", "2", "3"], 4, preferencesMock);

        expect(getCardsSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "graphqlCardsQuery",
          4,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns numberOfFilledCardsInCardGroup and product exclusions", async () => {
        await CatalogueService.getCards(["1", "2", "3"], 4, preferencesMock, [ProductExclusion.Games]);

        expect(getCardsSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "graphqlCardsQuery",
          4,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          ["GAMES"],
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns numberOfFilledCardsInCardGroup, product exclusions, experiments and throttleOverrides", async () => {
        await CatalogueService.getCards(
          ["1", "2", "3"],
          4,
          preferencesMock,
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );

        expect(getCardsSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "graphqlCardsQuery",
          4,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns numberOfFilledCardsInCardGroup, first and cursor", async () => {
        await CatalogueService.getCards(
          ["1", "2", "3"],
          4,
          preferencesMock,
          [ProductExclusion.Games],
          undefined,
          undefined,
          undefined,
          3,
          "cursor",
        );

        expect(getCardsSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "graphqlCardsQuery",
          4,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          ["GAMES"],
          undefined,
          undefined,
          undefined,
          3,
          "cursor",
        );
      });

      it("should call buildCardsLayout", async () => {
        await CatalogueService.getCards(["1", "2", "3"]);

        expect(buildCardsLayout).toHaveBeenCalledWith("cardsResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getCards(["1", "2", "3"]);

        expect(result).toBe("cardsMappedResponse");
      });
    });

    describe("getFullCard", () => {
      it("should call CatalogueClient getFullCard method with the partial Urns", async () => {
        await CatalogueService.getFullCard("1");

        expect(getFullCardSpy).toHaveBeenCalledWith(
          "1",
          "graphqlFullCardsQuery",
          undefined,
          preferencesMock,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getFullCard method with the partial Urns and prefs", async () => {
        await CatalogueService.getFullCard("1", preferencesMock);

        expect(getFullCardSpy).toHaveBeenCalledWith(
          "1",
          "graphqlFullCardsQuery",
          undefined,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getFullCard method with the partial Urns and product exclusions", async () => {
        await CatalogueService.getFullCard("1", preferencesMock, [ProductExclusion.Games]);

        expect(getFullCardSpy).toHaveBeenCalledWith(
          "1",
          "graphqlFullCardsQuery",
          undefined,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          ["GAMES"],
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getFullCard method with the partial Urns, product exclusions, experiments and throttleOverrides", async () => {
        await CatalogueService.getFullCard(
          "1",
          preferencesMock,
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );

        expect(getFullCardSpy).toHaveBeenCalledWith(
          "1",
          "graphqlFullCardsQuery",
          undefined,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildFullCardLayout", async () => {
        await CatalogueService.getFullCard("1");

        expect(buildFullCardLayout).toHaveBeenCalledWith("fullCardResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getFullCard("1");

        expect(result).toBe("fullCardMappedResponse");
      });
    });

    describe("getSortableCardsDisplayRunnersUpdates", () => {
      it("should call CatalogueClient getCards method with the partial Urns and bettingCardRunnersDisplayQuery", async () => {
        await CatalogueService.getSortableCardsDisplayRunnersUpdates(["1", "2", "3"], true, false);

        expect(getSortableCardsDisplayRunnersUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "bettingCardRunnersDisplayQuery",
          true,
          false,
          preferencesMock,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns and product exclusions", async () => {
        await CatalogueService.getSortableCardsDisplayRunnersUpdates(["1", "2", "3"], true, false, preferencesMock, [
          ProductExclusion.Games,
        ]);

        expect(getSortableCardsDisplayRunnersUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "bettingCardRunnersDisplayQuery",
          true,
          false,
          preferencesMock,
          ["GAMES"],
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns, product exclusions, experiments and throttleOverrides", async () => {
        await CatalogueService.getSortableCardsDisplayRunnersUpdates(
          ["1", "2", "3"],
          true,
          false,
          preferencesMock,
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );

        expect(getSortableCardsDisplayRunnersUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          "bettingCardRunnersDisplayQuery",
          true,
          false,
          preferencesMock,
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildRunnersDisplayUpdatesPayload", async () => {
        await CatalogueService.getSortableCardsDisplayRunnersUpdates(["1", "2", "3"], true, false);

        expect(buildRunnersDisplayUpdatesPayload).toHaveBeenCalledWith("RunnersDisplayUpdatesResult");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getSortableCardsDisplayRunnersUpdates(["1", "2", "3"], true, false);

        expect(result).toBe("buildRunnersDisplayUpdatesResponse");
      });
    });

    describe("getMainMarketsUpdates", () => {
      it("should call CatalogueClient getCards method with the partial Urns and mainMarketsQuery", async () => {
        await CatalogueService.getMainMarketsUpdates(["1", "2", "3"], true);

        expect(getMainMarketsUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          true,
          "mainMarketsQuery",
          preferencesMock,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns and product exclusions", async () => {
        await CatalogueService.getMainMarketsUpdates(["1", "2", "3"], true, preferencesMock, [ProductExclusion.Games]);

        expect(getMainMarketsUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          true,
          "mainMarketsQuery",
          preferencesMock,
          ["GAMES"],
          undefined,
          undefined,
          undefined,
        );
      });

      it("should call CatalogueClient getCards method with the partial Urns, product exclusions, experiments and throttleOverrides", async () => {
        await CatalogueService.getMainMarketsUpdates(
          ["1", "2", "3"],
          true,
          preferencesMock,
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );

        expect(getMainMarketsUpdatesSpy).toHaveBeenCalledWith(
          ["1", "2", "3"],
          true,
          "mainMarketsQuery",
          preferencesMock,
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildMainMarketsUpdatesPayload", async () => {
        await CatalogueService.getMainMarketsUpdates(["1", "2", "3"]);

        expect(buildMainMarketsUpdatesPayload).toHaveBeenCalledWith("MainMarketsUpdatesResult");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getMainMarketsUpdates(["1", "2", "3"]);

        expect(result).toBe("buildMainMarketsUpdatesPayload");
      });
    });

    describe("getFilteredCoupon", () => {
      it("should call CatalogueClient getFilteredCoupon method with the correct params", async () => {
        convertUserPreferences.mockReturnValue({
          favoriteSports: ["ppb:eventType:sport_id_1"],
          userProducts: ["EXCHANGE", "GAMES"],
        });

        await CatalogueService.getFilteredCoupon(
          "1",
          {
            dateRange: "dateFilter",
            competitions: ["1", "2"],
            marketType: "marketFilter",
            countries: "countriesFilter",
            months: "monthsFilter",
          },
          FilteredGroupSort.Rank,
          4,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );

        expect(getFilteredCouponSpy).toHaveBeenCalledWith(
          "1",
          "filteredCouponQuery",
          { competitions: ["1", "2"], dateRange: "dateFilter", marketType: "marketFilter" },
          { countries: "countriesFilter", months: "monthsFilter" },
          { countries: "countriesFilter" },
          "RANK",
          4,
          {
            favoriteSports: ["ppb:eventType:sport_id_1"],
            userProducts: ["EXCHANGE", "GAMES"],
          },
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildFilteredCouponLayout", async () => {
        await CatalogueService.getFilteredCoupon("1");

        expect(buildFilteredCouponLayout).toHaveBeenCalledWith("filteredCouponResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getFilteredCoupon("1");

        expect(result).toBe("filteredCouponMappedResponse");
      });

      describe("when sort filter is not defined", () => {
        it("should call CatalogueClient getFilteredCoupon method with sort param as undefined", async () => {
          convertUserPreferences.mockReturnValue({
            favoriteSports: ["ppb:eventType:sport_id_1"],
            userProducts: ["EXCHANGE", "GAMES"],
          });

          await CatalogueService.getFilteredCoupon(
            "1",
            {
              dateRange: "dateFilter",
              competitions: ["1", "2"],
              marketType: "marketFilter",
              countries: "countriesFilter",
              months: "monthsFilter",
            },
            undefined,
            4,
            {
              userProducts: [UserProducts.Exchange, UserProducts.Games],
              favoriteSports: ["ppb:eventType:sport_id_1"],
            },
            [ProductExclusion.Games],
            EXPERIMENTS,
            undefined,
            undefined,
          );

          expect(getFilteredCouponSpy).toHaveBeenCalledWith(
            "1",
            "filteredCouponQuery",
            { competitions: ["1", "2"], dateRange: "dateFilter", marketType: "marketFilter" },
            { countries: "countriesFilter", months: "monthsFilter" },
            { countries: "countriesFilter" },
            undefined,
            4,
            {
              favoriteSports: ["ppb:eventType:sport_id_1"],
              userProducts: ["EXCHANGE", "GAMES"],
            },
            ["GAMES"],
            EXPERIMENTS,
            undefined,
            undefined,
          );
        });
      });
    });

    describe("acceptImsPromotion", () => {
      it("should call CatalogueClient acceptImsPromotion with correct arguments", async () => {
        acceptImsPromotionSpy.mockReturnValueOnce({ acceptPromotion: { responseCode: 0 } });

        await CatalogueService.acceptImsPromotion("ppb:imsPromotion:daily-5-free-bonus", 0, THROTTLE_OVERRIDES);
        expect(acceptImsPromotionSpy).toHaveBeenCalledWith(
          "ppb:imsPromotion:daily-5-free-bonus",
          "graphqlMutationAccept",
          0,
          THROTTLE_OVERRIDES,
        );
      });
    });

    describe("cancelImsPromotion", () => {
      it("should call CatalogueClient cancelImsPromotion with correct arguments", async () => {
        await CatalogueService.cancelImsPromotion("ppb:imsPromotion:daily-5-free-bonus", 0, THROTTLE_OVERRIDES);
        expect(cancelImsPromotionSpy).toHaveBeenCalledWith(
          "ppb:imsPromotion:daily-5-free-bonus",
          "graphqlMutationCancel",
          0,
          THROTTLE_OVERRIDES,
        );
      });
    });

    describe("setSingleChoicePreference", () => {
      it("should call CatalogueClient setSingleChoicePreference with correct arguments", async () => {
        await CatalogueService.setSingleChoicePreference(
          "ppb:tbd:setting:singleChoice:sportsbookOddsDisplay",
          "DECIMAL",
          THROTTLE_OVERRIDES,
        );
        expect(setSingleChoicePreferenceSpy).toHaveBeenCalledWith(
          "ppb:tbd:setting:singleChoice:sportsbookOddsDisplay",
          "graphqlMutationSingleChoicePreference",
          "DECIMAL",
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.setSingleChoicePreference(
          "ppb:tbd:setting:singleChoice:sportsbookOddsDisplay",
          "DECIMAL",
          undefined,
        );

        expect(result).toBe("buildSingleChoiceResult");
      });
    });

    describe("getMarkets", () => {
      it("should call CatalogueClient getMarkets with correct arguments", async () => {
        await CatalogueService.getMarkets(["urn:1", "urn:2"], undefined, THROTTLE_OVERRIDES, ROUTER_MOCK);

        expect(getMarketsSpy).toHaveBeenCalledWith(
          ["urn:1", "urn:2"],
          "graphqlMarketsQuery",
          {
            favoriteSports: ["ppb:eventType:sport_id_1"],
            userProducts: ["EXCHANGE", "GAMES"],
          },
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildMarketsEntities", async () => {
        buildMarketsEntities.mockReturnValueOnce("marketEntitiesBuilt");

        const result = await CatalogueService.getMarkets(["urn:1", "urn:2"]);

        expect(buildMarketsEntities).toHaveBeenCalledWith("marketsResponse");
        expect(buildMarketsEntities).toHaveBeenCalledTimes(1);
        expect(result).toBe("marketEntitiesBuilt");
      });
    });

    describe("getVirtualMarkets", () => {
      it("should call CatalogueClient getVirtualMarkets with correct arguments", async () => {
        await CatalogueService.getVirtualMarkets(["urn:1", "urn:2"], THROTTLE_OVERRIDES, ROUTER_MOCK);

        expect(getVirtualMarketsSpy).toHaveBeenCalledWith(
          ["urn:1", "urn:2"],
          "graphqlVirtualMarketsQuery",
          THROTTLE_OVERRIDES,
          ROUTER_MOCK,
        );
      });

      it("should call buildVirtualMarketsEntities", async () => {
        buildVirtualMarketsEntities.mockReturnValueOnce("marketEntitiesBuilt");

        const result = await CatalogueService.getVirtualMarkets(["urn:1", "urn:2"], undefined);

        expect(buildVirtualMarketsEntities).toHaveBeenCalledWith("virtualMarketsResponse");
        expect(buildVirtualMarketsEntities).toHaveBeenCalledTimes(1);
        expect(result).toBe("marketEntitiesBuilt");
      });
    });

    describe("getRaceRunnersPastPerformances", () => {
      it("should call CatalogueClient getRaceRunners with correct arguments", async () => {
        await CatalogueService.getRaceRunnersPastPerformances(["urn:1", "urn:2"], THROTTLE_OVERRIDES);

        expect(getRaceRunnersSpy).toHaveBeenCalledWith(
          ["urn:1", "urn:2"],
          "graphqlRaceRunnersQuery",
          THROTTLE_OVERRIDES,
        );
      });

      it("should call buildRaceRunnersPastPerformancesPayload", async () => {
        buildRaceRunnersPastPerformancesPayload.mockReturnValueOnce("buildRaceRunnersPastPerformancesPayload");

        const result = await CatalogueService.getRaceRunnersPastPerformances(["urn:1", "urn:2"]);

        expect(buildRaceRunnersPastPerformancesPayload).toHaveBeenCalledWith("raceRunnersResponse");
        expect(buildRaceRunnersPastPerformancesPayload).toHaveBeenCalledTimes(1);
        expect(result).toBe("buildRaceRunnersPastPerformancesPayload");
      });
    });

    describe("getWebMessages", () => {
      it("should call CatalogueClient getWebMessages with correct arguments", async () => {
        await CatalogueService.getWebMessages(THROTTLE_OVERRIDES);

        expect(getWebMessagesSpy).toHaveBeenCalledWith("getWebMessagesQuery", THROTTLE_OVERRIDES);
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.getWebMessages(undefined);

        expect(result).toBe("webMessages");
      });
    });

    describe("getObbQuotes", () => {
      it("should call CatalogueClient getObbQuotes with correct arguments", async () => {
        const ObbRequestInputMock = {
          eventId: {
            id: "eventId",
            supplier: Supplier.Sportex,
          },
          toQuote: [
            {
              id: "legId",
              expressionTemplateId: "expressionTemplateId",
              baseExpressionTemplateDefinitions: [{ expressionTemplateId: "expressionTemplateId" }],
              expressionParams: {
                outcomeId: "outcomeId",
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                timePeriodId: "timePeriodId",
              },
            },
            {
              id: "legId2",
              expressionTemplateId: "expressionTemplateId2",
              baseExpressionTemplateDefinitions: [{ expressionTemplateId: "expressionTemplateId2" }],
              expressionParams: {
                outcomeId: "outcomeId2",
                participantIdA: "participantIdA2",
                participantIdB: "participantIdB2",
                timePeriodId: "timePeriodId2",
              },
            },
          ],
        };
        await CatalogueService.getObbQuotes(ObbRequestInputMock, THROTTLE_OVERRIDES);
        expect(getObbQuotesSpy).toHaveBeenCalledWith("getObbQuotesQuery", ObbRequestInputMock, THROTTLE_OVERRIDES);
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.getObbQuotes(undefined);
        expect(result).toBe("obbQuotes");
      });
    });

    describe("placeObbBet", () => {
      it("should call CatalogueClient getObbQuotes with correct arguments", async () => {
        const ObbRequestInputMock = {
          legs: [
            {
              legURN: "urn:example:leg1",
              stakePerLine: 10,
              expectedPrice: {
                numerator: 2,
                denominator: 1,
              },
              legDescription: "Example Leg 1",
              templateName: "Template1",
            },
            {
              legURN: "urn:example:leg2",
              stakePerLine: 20,
              expectedPrice: {
                numerator: 3,
                denominator: 2,
              },
              legDescription: "Example Leg 2",
              templateName: "Template2",
            },
          ],
          dryRun: true,
          customerRef: "customer123",
        };
        await CatalogueService.placeObbBet(ObbRequestInputMock, THROTTLE_OVERRIDES);

        expect(placeObbBetSpy).toHaveBeenCalledWith("placeObbBetMutation", ObbRequestInputMock, THROTTLE_OVERRIDES);
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.placeObbBet(undefined);

        expect(result).toBe("placeObbBet");
      });
    });

    describe("getObbEventParticipants", () => {
      it("should call CatalogueClient getObbEventParticipants with correct arguments", async () => {
        const eventParticipantsRequestInputMock = {
          event: "eventUrn",
          period: "MATCH",
          incidentType: "GOALS",
        };
        const incidentTypeFiltersInputMock = {
          period: "MATCH",
          incidentType: "GOALS",
        };

        await CatalogueService.getObbEventParticipants(
          eventParticipantsRequestInputMock,
          incidentTypeFiltersInputMock,
          THROTTLE_OVERRIDES,
        );

        expect(getObbEventParticipantsSpy).toHaveBeenCalledWith(
          "getObbEventParticipantsQuery",
          eventParticipantsRequestInputMock,
          incidentTypeFiltersInputMock,
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.getObbEventParticipants(undefined);

        expect(result).toBe("obbEventParticipants");
      });
    });

    describe("getObbSquadbetQuotes", () => {
      it("should call CatalogueClient getObbSquadbetQuotes with correct arguments", async () => {
        const squadBetQuotesRequestInputMock = {
          eventId: {
            id: "eventId",
            supplier: Supplier.Sportex,
          },
          incidentTypeId: "incidentTypeId",
          participantIds: ["123", "456"],
          quantifier: "quantifier",
          timePeriodId: "timePeriodId",
          valuesRange: {
            min: 0,
            max: 2,
          },
        };

        await CatalogueService.getObbSquadbetQuotes(squadBetQuotesRequestInputMock, THROTTLE_OVERRIDES);

        expect(getObbSquadbetQuotesSpy).toHaveBeenCalledWith(
          "getObbSquadbetQuotesQuery",
          squadBetQuotesRequestInputMock,
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.getObbSquadbetQuotes(undefined);

        expect(result).toBe("buildObbSquadBetLegResultResponse");
      });
    });

    describe("readWebMessage", () => {
      it("should call CatalogueClient readWebMessage with correct arguments", async () => {
        await CatalogueService.readWebMessage(100, THROTTLE_OVERRIDES);

        expect(readWebMessageSpy).toHaveBeenCalledWith(100, "readWebMessageMutation", THROTTLE_OVERRIDES);
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.readWebMessage(100, undefined);

        expect(result).toBe("readWebMessage");
      });
    });

    describe("getFilteredSelectableItems", () => {
      it("should call CatalogueClient getFilteredSelectableItems method with the correct params", async () => {
        convertUserPreferences.mockReturnValue({
          favoriteSports: ["ppb:eventType:sport_id_1"],
          userProducts: ["EXCHANGE", "GAMES"],
        });

        await CatalogueService.getFilteredSelectableItems(
          "1",
          SelectableItemsFilterOptions.UK_AND_IRE,
          {
            userProducts: [UserProducts.Exchange, UserProducts.Games],
            favoriteSports: ["ppb:eventType:sport_id_1"],
          },
          [ProductExclusion.Games],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
        );

        expect(getFilteredSelectableItemsCardGroupSpy).toHaveBeenCalledWith(
          "1",
          "filteredSelectableItemsQuery",
          {
            countries: RaceCountriesFilterOptions.UkAndIre,
          },
          {
            favoriteSports: ["ppb:eventType:sport_id_1"],
            userProducts: ["EXCHANGE", "GAMES"],
          },
          ["GAMES"],
          EXPERIMENTS,
          THROTTLE_OVERRIDES,
        );
      });

      it("should call buildFilteredCouponLayout", async () => {
        await CatalogueService.getFilteredSelectableItems("1", SelectableItemsFilterOptions.UK_AND_IRE);

        expect(buildFilteredSelectableItemsLayout).toHaveBeenCalledWith("filteredSelectableItemsCardGroupResponse");
      });

      it("should return the mapped response", async () => {
        const result = await CatalogueService.getFilteredCoupon("1");

        expect(result).toBe("filteredCouponMappedResponse");
      });
    });

    describe("setExchangeDefaultProductPreference", () => {
      const exchangeDefaultProductSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:exchangeDefaultProduct",
        preferenceKey: "exchangeDefaultProduct",
        preferenceValues: [
          {
            value: "ems",
            translationKey: "ems",
          },
          {
            value: "neme",
            translationKey: "neme",
          },
        ],
        selectedValueIndex: 0,
        typename: "PreferenceSingleChoice",
      };

      const userProductsPreferences = ["games", "exchange"];

      beforeAll(() => {
        mapStringToExchangeDefaultProduct.mockReturnValue(ExchangeDefaultProduct.Neme);
      });

      it("should call CatalogueClient setExchangeDefaultProductPreference with correct arguments", async () => {
        await CatalogueService.setExchangeDefaultProductPreference(
          "ppb:tbd:preference:exchangeDefaultProduct",
          "neme",
          exchangeDefaultProductSingleChoicePreference,
          THROTTLE_OVERRIDES,
        );
        expect(setExchangeDefaultProductPreferenceSpy).toHaveBeenCalledWith(
          "ppb:tbd:preference:exchangeDefaultProduct",
          "exchangeDefaultProductPreferenceMutation",
          "NEME",
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.setExchangeDefaultProductPreference(
          "ppb:tbd:preference:exchangeDefaultProduct",
          "neme",
          userProductsPreferences,
        );

        expect(result).toBe("buildExchangeDefaultProductResult");
      });

      it("should call setExchangeDefaultProductPreference", async () => {
        await CatalogueService.setExchangeDefaultProductPreference(
          "ppb:tbd:preference:exchangeDefaultProduct",
          "neme",
          userProductsPreferences,
        );

        expect(setExchangeDefaultProductPreferenceSpy).toHaveBeenCalledWith(
          "ppb:tbd:preference:exchangeDefaultProduct",
          "exchangeDefaultProductPreferenceMutation",
          "NEME",
          undefined,
        );
      });
    });

    describe("setUserProductsPreference", () => {
      const userProductsSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:products",
        preferenceKey: "products",
        preferenceValues: [
          {
            value: "sportsbook",
            translationKey: "I18N.SPORTSBOOK",
          },
          {
            value: "exchange",
            translationKey: "I18N.EXCHANGE",
          },
        ],
        selectedValueIndex: 1,
        typename: "PreferenceSingleChoice",
      };

      beforeAll(() => {
        mapStringToUserProducts.mockReturnValue(UserProducts.Sportsbook);
        updateUserProductsList.mockReturnValue([UserProducts.Sportsbook]);
      });

      it("should call CatalogueClient setUserProductsPreference with correct arguments", async () => {
        await CatalogueService.setUserProductsPreference(
          "ppb:tbd:preference:userProducts:UserProducts",
          "sportsbook",
          userProductsSingleChoicePreference,
          ["exchange", "sportsbook"],
          THROTTLE_OVERRIDES,
        );
        expect(setUserProductsPreferenceSpy).toHaveBeenCalledWith(
          "ppb:tbd:preference:userProducts:UserProducts",
          "userProductsPreferenceMutation",
          ["SPORTSBOOK"],
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.setUserProductsPreference(
          "ppb:tbd:preference:userProducts:UserProducts",
          "sportsbook",
          userProductsSingleChoicePreference,
          ["exchange", "sportsbook"],
        );

        expect(result).toBe("buildUserProductsResult");
      });
    });

    describe("setDefaultProductPreference", () => {
      const defaultProductSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:defaultProduct",
        preferenceKey: "defaultProduct",
        preferenceValues: [
          {
            value: "last_viewed",
            translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.LAST_VIEWED",
          },
          {
            value: "sportsbook",
            translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.SPORTSBOOK",
          },
          {
            value: "exchange",
            translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.EXCHANGE",
          },
        ],
        selectedValueIndex: 1,
        typename: "PreferenceSingleChoice",
      };

      describe("when the selected default product is undefined", () => {
        beforeAll(() => {
          mapDefaultProductOptionToDefaultProduct.mockReturnValue(undefined);
        });

        it("should not call CatalogueClient setDefaultProductPreference", async () => {
          await CatalogueService.setDefaultProductPreference(
            "ppb:tbd:preference:defaultProduct:DefaultProduct",
            "sportsbook",
            defaultProductSingleChoicePreference,
            THROTTLE_OVERRIDES,
          );

          expect(setDefaultProductPreferenceSpy).not.toHaveBeenCalled();
        });

        it("should return undefined", async () => {
          const result = await CatalogueService.setDefaultProductPreference(
            "ppb:tbd:preference:defaultProduct:DefaultProduct",
            "sportsbook",
            defaultProductSingleChoicePreference,
            THROTTLE_OVERRIDES,
          );

          expect(result).toBeUndefined();
        });
      });

      describe("when the selected default product is defined", () => {
        beforeAll(() => {
          mapDefaultProductOptionToDefaultProduct.mockReturnValue(DefaultProduct.Sportsbook);
        });

        it("should call CatalogueClient setDefaultProductPreference with correct arguments", async () => {
          await CatalogueService.setDefaultProductPreference(
            "ppb:tbd:preference:defaultProduct:DefaultProduct",
            "sportsbook",
            defaultProductSingleChoicePreference,
            THROTTLE_OVERRIDES,
          );

          expect(setDefaultProductPreferenceSpy).toHaveBeenCalledTimes(1);
          expect(setDefaultProductPreferenceSpy).toHaveBeenCalledWith(
            "ppb:tbd:preference:defaultProduct:DefaultProduct",
            "defaultProductPreferenceMutation",
            DefaultProduct.Sportsbook,
            THROTTLE_OVERRIDES,
          );
        });

        it("should return the service response", async () => {
          const result = await CatalogueService.setDefaultProductPreference(
            "ppb:tbd:preference:defaultProduct:DefaultProduct",
            "sportsbook",
            defaultProductSingleChoicePreference,
            THROTTLE_OVERRIDES,
          );

          expect(result).toBe("buildDefaultProductResult");
        });
      });
    });

    describe("setConfirmCashoutPreference", () => {
      const confirmCashoutSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:confirmCashout",
        preferenceKey: "confirmCashout",
        preferenceValues: [
          {
            value: "ON",
            translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.ON",
          },
          {
            value: "OFF",
            translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.OFF",
          },
        ],
        selectedValueIndex: 1,
        typename: "PreferenceSingleChoice",
      };

      it("should call CatalogueClient setConfirmCashoutPreference with correct arguments", async () => {
        await CatalogueService.setConfirmCashoutPreference(
          "ppb:tbd:preference:confirmCashout:confirmCashout",
          true,
          confirmCashoutSingleChoicePreference,
          THROTTLE_OVERRIDES,
        );

        expect(setConfirmCashoutPreferenceSpy).toHaveBeenCalledTimes(1);
        expect(setConfirmCashoutPreferenceSpy).toHaveBeenCalledWith(
          "ppb:tbd:preference:confirmCashout:confirmCashout",
          "confirmCashoutPreferenceMutation",
          true,
          THROTTLE_OVERRIDES,
        );
      });

      it("should return the service response", async () => {
        const result = await CatalogueService.setConfirmCashoutPreference(
          "ppb:tbd:preference:confirmCashout:confirmCashout",
          true,
          confirmCashoutSingleChoicePreference,
          THROTTLE_OVERRIDES,
        );

        expect(result).toBe("buildConfirmCashoutResult");
      });
    });

    describe("setLastViewedProductPreference", () => {
      describe("when the selected last viewed product is undefined", () => {
        beforeAll(() => {
          mapLastViewedProductOptionToLastViewedProduct.mockReturnValue(undefined);
        });

        it("should not call CatalogueClient setLastViewedProductPreference", async () => {
          await CatalogueService.setLastViewedProductPreference(
            "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            "sportsbook",
            THROTTLE_OVERRIDES,
          );

          expect(setLastViewedProductPreferenceSpy).not.toHaveBeenCalled();
        });

        it("should return undefined", async () => {
          const result = await CatalogueService.setLastViewedProductPreference(
            "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            "sportsbook",
          );

          expect(result).toBeUndefined();
        });
      });

      describe("when the selected last viewed product is defined", () => {
        beforeAll(() => {
          mapLastViewedProductOptionToLastViewedProduct.mockReturnValue(LastViewedProduct.Sportsbook);
        });

        it("should call CatalogueClient setLastViewedProductPreference with correct arguments", async () => {
          await CatalogueService.setLastViewedProductPreference(
            "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            "sportsbook",
            THROTTLE_OVERRIDES,
          );

          expect(setLastViewedProductPreferenceSpy).toHaveBeenCalledTimes(1);
          expect(setLastViewedProductPreferenceSpy).toHaveBeenCalledWith(
            "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            "lastViewedProductPreferenceMutation",
            LastViewedProduct.Sportsbook,
            THROTTLE_OVERRIDES,
          );
        });

        it("should return the service response", async () => {
          const result = await CatalogueService.setLastViewedProductPreference(
            "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            "sportsbook",
            THROTTLE_OVERRIDES,
          );

          expect(result).toBe("buildLastViewedProductResult");
        });
      });
    });

    describe("setFavouriteMarket", () => {
      it("should call CatalogueClient setFavouriteMarket with correct arguments", async () => {
        await CatalogueService.setFavouriteMarket("ppb:contentSection:123", true, THROTTLE_OVERRIDES, true);

        expect(setFavouriteMarketSpy).toHaveBeenCalledWith(
          "setFavouriteMarketMutation",
          "ppb:contentSection:123",
          true,
          THROTTLE_OVERRIDES,
        );
        expect(buildFavouriteMarkets).toHaveBeenCalledWith("setFavouriteMarket");
      });

      it("should return the service mapped response", async () => {
        const result = await CatalogueService.setFavouriteMarket("ppb:contentSection:123", true);

        expect(result).toBe("buildFavouriteMarkets");
      });
    });
  });
});
