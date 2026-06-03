import { fabricGQL } from "@flutter-global/uki-channels-http-clients";

import {
  DefaultProduct,
  LastViewedProduct,
  ProductExclusion,
  RaceCountriesFilterOptions,
  Supplier,
  UserProducts,
} from "./catalogue-response-types";
import CatalogueClient from "./catalogue-client";

const clientRequest = jest.fn(() => Promise.resolve({ data: "response" }));

const CUSTOM_HEADERS_MOCK = {
  "X-COUNTRY-CODE": "DK",
  "X-IP": "1.1.1.1",
};

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  fabricGQL: jest.fn(() => ({ request: clientRequest })),
}));

function createClient(
  url = new URL("http://fakeurl.com"),
  options = { applicationKey: "fakeKey", overrideUserAgent: "fakeUserAgent" },
  overrideReferer = "fakeReferer",
) {
  return CatalogueClient(url, options, overrideReferer);
}

const THROTTLE_OVERRIDES = { on: new Set(), off: new Set() };
const EXPERIMENTS = [{ id: "experiment-id", variant: "something-something-variant" }];
const decorationsOnly = false;

describe("CatalogueClient", () => {
  beforeEach(jest.clearAllMocks);

  it("should call fabricGQL client builder with the application key", () => {
    createClient();
    expect(fabricGQL).toHaveBeenCalledWith(new URL("http://fakeurl.com/"), {
      applicationKey: "fakeKey",
      overrideUserAgent: "fakeUserAgent",
    });
  });

  describe("when we call the getLayout method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getLayout(
        "urn",
        "graphqlQuery",
        4,
        3,
        true,
        true,
        true,
        true,
        "cursor",
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
        "currentUrl",
        EXPERIMENTS,
        THROTTLE_OVERRIDES,
        decorationsOnly,
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        currentUrl: "currentUrl",
        variables: {
          urn: "urn",
          numberOfFilledCardsInCardGroup: 4,
          numberOfFilledCardsInView: 3,
          withBottomBar: true,
          withLeftSidebar: true,
          withRegulatoryData: true,
          withPageInfo: true,
          cursor: "cursor",
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
          experiments: EXPERIMENTS,
          ...THROTTLE_OVERRIDES,
          decorationsOnly,
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getLayout("urn", "graphqlQuery");
      expect(returnValue).toBe("response");
    });

    describe("with overrideCustomHeaders", () => {
      it("should call fabricGQL request method with parsed custom headers when defined", async () => {
        const client = createClient(undefined, { overrideCustomHeaders: CUSTOM_HEADERS_MOCK });
        await client.getLayout(
          "urn",
          "graphqlQuery",
          4,
          3,
          true,
          true,
          true,
          true,
          "cursor",
          {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          [ProductExclusion.Games],
        );
        expect(clientRequest).toHaveBeenCalledWith({
          query: "graphqlQuery",
          variables: {
            urn: "urn",
            numberOfFilledCardsInCardGroup: 4,
            numberOfFilledCardsInView: 3,
            withBottomBar: true,
            withLeftSidebar: true,
            withRegulatoryData: true,
            withPageInfo: true,
            cursor: "cursor",
            preferences: {
              userProducts: [UserProducts.Games],
              favoriteSports: ["ppb:tbd:eventType:1"],
            },
            productExclusions: ["GAMES"],
          },
          headers: CUSTOM_HEADERS_MOCK,
        });
      });
    });
  });

  describe("when we call the getSearchResults method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getSearchResults(
        "query",
        "graphqlQuerySearch",
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuerySearch",
        variables: {
          query: "query",
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getSearchResults("query", "graphqlQuerySearch");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getCards method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getCards(
        ["1", "2", "3"],
        "graphqlCardsQuery",
        4,
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlCardsQuery",
        variables: {
          urn: ["1", "2", "3"],
          numberOfFilledCardsInCardGroup: 4,
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getCards(["1", "2", "3"], "graphqlCardsQuery");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getFullCard method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getFullCard(
        "1",
        "graphqlFullCardQuery",
        4,
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlFullCardQuery",
        variables: {
          urn: ["1"],
          numberOfFilledCardsInCardGroup: 4,
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getFullCard("1", "graphqlFullCardQuery");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getObbQuotes method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      const quotesRequestInput = {
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
        ],
      };
      await client.getObbQuotes("graphqlQuery", quotesRequestInput, {
        throttlesOn: ["TEST"],
        throttlesOff: ["TEST_OFF"],
      });

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: {
          quotesRequestInput,
          throttlesOn: ["TEST"],
          throttlesOff: ["TEST_OFF"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getObbQuotes("graphqlQuery", {});

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getObbEventParticipants method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      const eventParticipantsRequestInput = {
        event: "eventUrn",
        period: "MATCH",
        incidentType: "GOALS",
      };
      const incidentTypeFiltersInput = {
        period: "MATCH",
        incidentType: "GOALS",
      };

      await client.getObbEventParticipants("graphqlQuery", eventParticipantsRequestInput, incidentTypeFiltersInput, {
        throttlesOn: ["TEST"],
        throttlesOff: ["TEST_OFF"],
      });

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: {
          eventParticipantsRequestInput,
          incidentTypeFiltersInput,
          throttlesOn: ["TEST"],
          throttlesOff: ["TEST_OFF"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getObbEventParticipants("graphqlQuery", {});

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getObbSquadbetQuotes method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      const squadBetQuotesRequestInput = {
        eventId: {
          id: "eventId",
          supplier: Supplier.Sportex,
        },
        incidentTypeId: "GOALS",
        participantIds: ["123", "456"],
        quantifier: "AT_LEAST",
        timePeriodId: "MATCH",
        valuesRange: {
          min: 1,
          max: 5,
        },
      };
      await client.getObbSquadbetQuotes("graphqlQuery", squadBetQuotesRequestInput, {
        throttlesOn: ["TEST"],
        throttlesOff: ["TEST_OFF"],
      });

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: {
          squadBetQuotesRequestInput,
          throttlesOn: ["TEST"],
          throttlesOff: ["TEST_OFF"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getObbSquadbetQuotes("graphqlQuery", {});

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getSortableCardsDisplayRunnersUpdates method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getSortableCardsDisplayRunnersUpdates(
        ["1"],
        "bettingCardRunnersDisplayQuery",
        true,
        false,
        {
          prefA: 1,
          prefB: 2,
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "bettingCardRunnersDisplayQuery",
        variables: {
          urn: ["1"],
          requestForExc: true,
          requestForSbk: false,
          preferences: { prefA: 1, prefB: 2 },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getSortableCardsDisplayRunnersUpdates(
        ["1"],
        "bettingCardRunnersDisplayQuery",
        true,
        false,
      );
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getMainMarketsUpdates method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getMainMarketsUpdates(["1"], true, "mainMarketsQuery", { prefA: 1, prefB: 2 }, [
        ProductExclusion.Games,
      ]);
      expect(clientRequest).toHaveBeenCalledWith({
        query: "mainMarketsQuery",
        variables: {
          urn: ["1"],
          withFixtureUpdates: true,
          preferences: { prefA: 1, prefB: 2 },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getMainMarketsUpdates(["1"], "mainMarketsQuery");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getFilteredCoupon method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getFilteredCoupon(
        "1",
        "graphqlCardsQuery",
        "filteredCouponFilterBy",
        "futureRacingFilterBy",
        "racesByTimeRangeFilterBy",
        "sortBy",
        4,
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlCardsQuery",
        variables: {
          urn: "1",
          filteredCouponFilterBy: "filteredCouponFilterBy",
          futureRacingFilterBy: "futureRacingFilterBy",
          racesByTimeRangeFilterBy: "racesByTimeRangeFilterBy",
          sortBy: "sortBy",
          numberOfFilledCardsInCardGroup: 4,
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getFilteredCoupon("1", "graphqlCardsQuery");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the acceptImsPromotion method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.acceptImsPromotion("1", "graphqlAccept", 4);
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlAccept",
        variables: {
          urn: "1",
          productExclusions: [],
          amount: 4,
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.acceptImsPromotion("1", "graphqlAccept", 4);
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the cancelImsPromotion method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.cancelImsPromotion("1", "graphqlAccept", "123");
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlAccept",
        variables: {
          urn: "1",
          bonusInstanceCode: "123",
          productExclusions: [],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.cancelImsPromotion("1", "graphqlCardsQuery", "123");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the setSingleChoicePreference method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.setSingleChoicePreference("sportsbookOddsDisplay", "graphqlSetPreference", "DECIMAL");
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlSetPreference",
        variables: {
          urn: "sportsbookOddsDisplay",
          value: "DECIMAL",
          productExclusions: [],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.setSingleChoicePreference(
        "sportsbookOddsDisplay",
        "graphqlSetPreference",
        "DECIMAL",
      );
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the setDefaultProductPreference method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.setDefaultProductPreference("defaultProduct", "graphqlSetPreference", DefaultProduct.Sportsbook);

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlSetPreference",
        variables: {
          urn: "defaultProduct",
          value: DefaultProduct.Sportsbook,
          productExclusions: [],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.setDefaultProductPreference(
        "defaultProduct",
        "graphqlSetPreference",
        DefaultProduct.Sportsbook,
      );

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the setConfirmCashoutPreference method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.setConfirmCashoutPreference("confirmCashout", "graphqlSetPreference", true);

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlSetPreference",
        variables: {
          urn: "confirmCashout",
          value: true,
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.setConfirmCashoutPreference("confirmCashout", "graphqlSetPreference", true);

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the setLastViewedProductPreference method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.setLastViewedProductPreference(
        "lastViewedProduct",
        "graphqlSetPreference",
        LastViewedProduct.Sportsbook,
      );

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlSetPreference",
        variables: {
          urn: "lastViewedProduct",
          value: LastViewedProduct.Sportsbook,
          productExclusions: [],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.setLastViewedProductPreference(
        "lastViewedProduct",
        "graphqlSetPreference",
        LastViewedProduct.Sportsbook,
      );

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the setFavouriteMarket", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.setFavouriteMarket("setFavouriteMarket", "contentSectionURNMock", true);

      expect(clientRequest).toHaveBeenCalledWith({
        query: "setFavouriteMarket",
        variables: {
          contentSectionURN: "contentSectionURNMock",
          isFavourite: true,
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.setFavouriteMarket("setFavouriteMarket", "contentSectionURNMock", true);

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getMarkets", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      await client.getMarkets(["urn:1", "urn:2"], "graphqlQuery", "preferences");

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: { URNs: ["urn:1", "urn:2"], preferences: "preferences", productExclusions: [] },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getMarkets(["urn:1", "urn:2"], "graphqlQuery");

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getVirtualMarkets", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      await client.getVirtualMarkets(["urn:1", "urn:2"], "graphqlQuery");

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: { URNs: ["urn:1", "urn:2"], productExclusions: [] },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getVirtualMarkets(["urn:1", "urn:2"], "graphqlQuery");

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getWebMessages method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getWebMessages("graphqlGetWebMessages");
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlGetWebMessages",
        variables: { productExclusions: [] },
        headers: {
          Referer: "fakeReferer",
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getWebMessages("graphqlGetWebMessages");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the readWebMessage method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.readWebMessage(100, "graphqlReadWebMessage");
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlReadWebMessage",
        variables: {
          productExclusions: [],
          customerMessageId: 100,
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.readWebMessage(100, "graphqlReadWebMessage");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getRaceRunners", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      await client.getRaceRunners(["urn:1", "urn:2"], "graphqlQuery");

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: { URNs: ["urn:1", "urn:2"], productExclusions: [] },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getRaceRunners(["urn:1", "urn:2"], "graphqlQuery");

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getFilteredSelectableItemsCardGroup method", () => {
    it("should call the fabricGQL request method with the right arguments", async () => {
      const client = createClient();
      await client.getFilteredSelectableItemsCardGroup(
        "1",
        "graphqlCardsQuery",
        {
          countries: RaceCountriesFilterOptions.UkAndIre,
        },
        {
          userProducts: [UserProducts.Games],
          favoriteSports: ["ppb:tbd:eventType:1"],
        },
        [ProductExclusion.Games],
      );
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlCardsQuery",
        variables: {
          urn: "1",
          filterBy: {
            countries: RaceCountriesFilterOptions.UkAndIre,
          },
          preferences: {
            userProducts: [UserProducts.Games],
            favoriteSports: ["ppb:tbd:eventType:1"],
          },
          productExclusions: ["GAMES"],
        },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();
      const returnValue = await client.getFilteredSelectableItemsCardGroup("1", "graphqlCardsQuery");
      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getAppContext method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      await client.getAppContext("graphqlQuery", "token", { throttlesOn: ["TEST"], throttlesOff: ["TEST_OFF"] });

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        headers: {
          "X-Authentication": "token",
        },
        variables: { throttlesOn: ["TEST"], throttlesOff: ["TEST_OFF"] },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getAppContext("graphqlQuery");

      expect(returnValue).toBe("response");
    });
  });

  describe("when we call the getAppVersion method", () => {
    it("should call fabricGQL request method with the right arguments", async () => {
      const client = createClient();

      await client.getAppVersion("graphqlQuery", { throttlesOn: ["TEST"], throttlesOff: ["TEST_OFF"] });

      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        headers: {},
        variables: { throttlesOn: ["TEST"], throttlesOff: ["TEST_OFF"] },
      });
    });

    it("should return the promise from the fabricGQL client request method", async () => {
      const client = createClient();

      const returnValue = await client.getAppVersion("graphqlQuery");

      expect(returnValue).toBe("response");
    });
  });
});
