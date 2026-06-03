import { SUBSCRIBE_MAIN_MARKET_TRANSITIONS } from "@ppb/tbd-store/actions/market-transitions";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/exchange-markets";
import { UI__NAVIGATE_TO_EVENT_FROM_SPORT } from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarket: jest.fn(() => ({
    marketId: "924.111111",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: () =>
    jest.fn(() => ({
      marketId: "1.11111",
    })),
}));

const eventMarketCardURN = "ppb:tbd:card:eventPrimaryMarket:29635406";

const getEventMarketCardMock = {
  urn: eventMarketCardURN,
  fixture: "ppb:fixture:29444319##MATCH_ODDS",
  eventViewLink: {
    viewUrl: "eventViewUrl",
    viewUrn: "eventViewUrn",
  },
  runnerViewLinks: [
    {
      viewUrl: "runnerViewUrl",
      viewUrn: "runnerViewUrn",
    },
  ],
  displayRunners: {
    exchange: {
      market: "ppb:excMarket:1.167020952",
      runners: ["runner1Urn", "runner2Urn"],
    },
    sportsbook: {
      market: "ppb:sbkMarket:924.218604979",
      runners: ["runner1Urn", "runner2Urn"],
    },
  },
  sportevent: "ppb:sportevent:1",
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
  videoAvailable: true,
};

const getEventMarketCardByURN = jest.fn(() => getEventMarketCardMock);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: () => getEventMarketCardByURN,
}));

const STATE = {
  entities: {
    exchangemarkets: {
      "ppb:excMarket:1.162031694": {
        urn: "ppb:excMarket:1.162031694",
        name: "Match Odds",
        marketId: "1.162031694",
        sportevent: "ppb:event:29444319",
        runners: [],
        status: "OPEN",
        totalMatched: 1671.64,
      },
    },
  },
  layouts: {
    cards: {
      eventmarkets: {},
    },
  },
};

afterEach(jest.clearAllMocks);

describe("Connected event card", () => {
  describe("when mapping state to props", () => {
    it("should getEventMarketCardByURN", () => {
      makeMapStateToProps()(STATE, { urn: eventMarketCardURN });
      expect(getEventMarketCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.eventmarkets, eventMarketCardURN);
    });

    it("should return props needed to render component and fetch data", () => {
      const result = makeMapStateToProps()(STATE, { urn: eventMarketCardURN });

      expect(result).toEqual({
        fixture: "ppb:fixture:29444319##MATCH_ODDS",
        fixtureURN: "ppb:fixture:29444319##MATCH_ODDS",
        sporteventURN: "ppb:sportevent:1",
        stickyOnScroll: false,
        cardUrn: eventMarketCardURN,
        eventViewLink: {
          viewUrl: "eventViewUrl",
          viewUrn: "eventViewUrn",
        },
        runnerViewLinks: [
          {
            viewUrl: "runnerViewUrl",
            viewUrn: "runnerViewUrn",
          },
        ],
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.167020952",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.218604979",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        videoAvailable: true,
      });
    });

    describe("when fixture is a baseFixture", () => {
      it("should return fixture object, excMainMarketId and sbkMainMarketId", () => {
        getEventMarketCardByURN.mockReturnValue({
          ...getEventMarketCardMock,
          fixture: {
            urn: "ppb:fixture:29444319##MATCH_ODDS",
            typename: "BaseFixture",
            sportevent: "ppb:event:29444319",
            mainMarket: { exchange: "ppb:excMarket:1.11111", sportsbook: "ppb:sbkMarket:924.111111" },
          },
        });

        const result = makeMapStateToProps()(STATE, { urn: eventMarketCardURN });

        expect(result).toEqual(
          expect.objectContaining({
            fixture: {
              mainMarket: {
                exchange: "ppb:excMarket:1.11111",
                sportsbook: "ppb:sbkMarket:924.111111",
              },
              sportevent: "ppb:event:29444319",
              typename: "BaseFixture",
              urn: "ppb:fixture:29444319##MATCH_ODDS",
            },
            excMainMarketId: "1.11111",
            sbkMainMarketId: "924.111111",
          }),
        );
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchClickCardAction", () => {
    it("should dispatch click card action", () => {
      const { dispatchClickCardAction } = mapDispatchToProps;
      const cardUrn = "fakeUrn";
      const href = "fakeHref";

      expect(dispatchClickCardAction(cardUrn, "fixtureURN", "sportEventURN", href, [])).toEqual({
        payload: {
          cardUrn: "fakeUrn",
          href: "fakeHref",
          fixtureURN: "fixtureURN",
          sportEventURN: "sportEventURN",
          type: "primary swimlane",
        },
        type: UI__NAVIGATE_TO_EVENT_FROM_SPORT,
      });
    });
  });

  describe("dispatchMainMarketsTransitionsSubscription", () => {
    it("should dispatch SUBSCRIBE_MAIN_MARKET_TRANSITIONS action", () => {
      const { dispatchMainMarketsTransitionsSubscription } = mapDispatchToProps;
      const cardURN = "urn:ppb:eventmarketcard:1";
      const marketURNs = ["urn:ppb:excMarket:1", "urn:ppb:sbkMarket:1"];

      expect(dispatchMainMarketsTransitionsSubscription(cardURN, marketURNs, true)).toEqual({
        type: SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
        payload: {
          cardURN,
          marketURNs,
          withFixtureUpdates: true,
        },
      });
    });
  });

  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    it("should dispatch SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
      const { dispatchSportsbookMarketUpdatesSubscribe } = mapDispatchToProps;
      const marketId = "924.111111";

      expect(dispatchSportsbookMarketUpdatesSubscribe(marketId)).toEqual({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
      const { dispatchSportsbookMarketUpdatesUnsubscribe } = mapDispatchToProps;
      const marketId = "924.111111";

      expect(dispatchSportsbookMarketUpdatesUnsubscribe(marketId)).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });

  describe("dispatchExchangeMarketUpdatesSubscribe", () => {
    it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
      const { dispatchExchangeMarketUpdatesSubscribe } = mapDispatchToProps;
      const marketId = "1.11111";

      expect(dispatchExchangeMarketUpdatesSubscribe(marketId)).toEqual({
        type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
        payload: { marketId },
      });
    });
  });

  describe("dispatchExchangeMarketUpdatesUnsubscribe", () => {
    it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
      const { dispatchExchangeMarketUpdatesUnsubscribe } = mapDispatchToProps;
      const marketId = "1.11111";

      expect(dispatchExchangeMarketUpdatesUnsubscribe(marketId)).toEqual({
        type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });
});
