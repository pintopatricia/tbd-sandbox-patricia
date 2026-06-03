import { PUSH } from "@ppb/tbd-store/actions/router";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { SUBSCRIBE_MAIN_MARKET_TRANSITIONS } from "@ppb/tbd-store/actions/market-transitions";
import { UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET } from "@ppb/tbd-store/actions/navigation";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/exchange-markets";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getEventMarketCardByURN = jest.fn();
const getExchangeMarketByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => getExchangeMarketByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getEventMarketCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const STATE = {
  layouts: {
    cards: {
      eventmarkets: {},
    },
  },
  entities: {
    exchangemarkets: {},
  },
  router: {
    currentView: "view",
  },
};

const OWN_PROPS = {
  urn: "urn:ppb:eventmarketcard:1",
  couponCardGroupUrn: "couponCardGroupUrn",
};

const setupMapStateToProps = ({ state = {}, ownProps = {} } = {}) =>
  makeMapStateToProps()({ ...STATE, ...state }, { ...OWN_PROPS, ...ownProps });

beforeEach(jest.clearAllMocks);

describe("makeMapStateToProps", () => {
  it("should create selector for event market card by urn", () => {
    makeMapStateToProps();

    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create selector for get exchange market by urn", () => {
    makeMapStateToProps();

    expect(createExchangeMarketSelector).toHaveBeenCalledWith();
    expect(createExchangeMarketSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    const EVENT_MARKET_CARD = {
      fixture: "ppb:fixture:1",
      marketURNs: ["urn:ppb:excMarket:1"],
      eventViewLink: {
        viewUrl: "https://url",
        viewUrn: "urn:ppb:event:1",
      },
      displayRunners: {
        exchange: undefined,
      },
      sportevent: "ppb:event:1",
      videoAvailable: true,
      isSuperSubEligible: false,
      statsPebbleURN: "urn:ppb:statsPebble:1",
    };

    it("should map state to props when card is not defined", () => {
      getEventMarketCardByURN.mockReturnValueOnce(null);

      const props = setupMapStateToProps();

      expect(props).toEqual({});
    });

    it("should map state to props for exchange display runner", () => {
      getEventMarketCardByURN.mockReturnValueOnce({
        ...EVENT_MARKET_CARD,
        displayRunners: {
          exchange: {
            market: "urn:ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
      });

      const props = setupMapStateToProps();

      expect(props).toEqual({
        fixture: "ppb:fixture:1",
        eventViewLink: {
          viewUrl: "https://url",
          viewUrn: "urn:ppb:event:1",
        },
        marketURN: "urn:ppb:excMarket:1",
        displayRunners: {
          exchange: {
            market: "urn:ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        isToShowStatsButton: true,
        fixtureViewMode: "COUPON",
        sporteventURN: "ppb:event:1",
        cardUrn: OWN_PROPS.urn,
        videoAvailable: true,
        iconsList: [IconsList.LIVE_VIDEO],
        statsPebbleURN: "urn:ppb:statsPebble:1",
        showHorizontalDuration: false,
      });
      expect(getEventMarketCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.eventmarkets, OWN_PROPS.urn);
    });

    describe("when fixture is a BaseFixture", () => {
      it("should return excMainMarketId", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          fixture: {
            urn: "ppb:fixture:29444319##MATCH_ODDS",
            typename: "BaseFixture",
            sportevent: "ppb:event:29444319",
            mainMarket: { exchange: "ppb:excMarket:1.11111", sportsbook: "ppb:sbkMarket:924.111111" },
          },
        });

        getExchangeMarketByURN.mockReturnValue({ marketId: "1.11111" });

        const props = setupMapStateToProps();

        expect(getExchangeMarketByURN).toHaveBeenCalledWith(STATE.entities.exchangemarkets, "ppb:excMarket:1.11111");

        expect(props).toEqual(
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
            videoAvailable: true,
          }),
        );
      });
    });

    describe("isToShowStatsButton", () => {
      it("should return false if the eventMarketCard has no statsPebbleURN property", () => {
        getEventMarketCardByURN.mockReturnValueOnce({ ...EVENT_MARKET_CARD, statsPebbleURN: null });

        const props = setupMapStateToProps();

        expect(props.isToShowStatsButton).toBe(false);
      });

      it("should return true if the eventMarketCard has the statsPebbleURN property", () => {
        getEventMarketCardByURN.mockReturnValueOnce(EVENT_MARKET_CARD);

        const props = setupMapStateToProps();

        expect(props.isToShowStatsButton).toBe(true);
      });
    });

    describe("iconsList", () => {
      it("should include live video icon when videoAvailable is true", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          videoAvailable: true,
        });

        const { iconsList } = setupMapStateToProps();

        expect(iconsList).toContain(IconsList.LIVE_VIDEO);
      });

      it("should not include live video icon when videoAvailable is false", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          videoAvailable: false,
        });

        const { iconsList } = setupMapStateToProps();

        expect(iconsList).not.toContain(IconsList.LIVE_VIDEO);
      });

      describe("memoization", () => {
        beforeEach(() => {
          getEventMarketCardByURN.mockReset();
          getExchangeMarketByURN.mockReset();
        });

        it("should return the same iconsList reference across calls when videoAvailable is unchanged", () => {
          getEventMarketCardByURN.mockReturnValue({ ...EVENT_MARKET_CARD, videoAvailable: true });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(STATE, OWN_PROPS);
          const second = mapStateToProps(STATE, OWN_PROPS);

          expect(second.iconsList).toBe(first.iconsList);
        });

        it("should return the same iconsList reference when videoAvailable toggles between false and undefined", () => {
          getEventMarketCardByURN
            .mockReturnValueOnce({ ...EVENT_MARKET_CARD, videoAvailable: false })
            .mockReturnValueOnce({ ...EVENT_MARKET_CARD, videoAvailable: undefined });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(STATE, OWN_PROPS);
          const second = mapStateToProps(STATE, OWN_PROPS);

          expect(second.iconsList).toBe(first.iconsList);
        });

        it("should return a new iconsList reference when videoAvailable changes meaningfully", () => {
          getEventMarketCardByURN
            .mockReturnValueOnce({ ...EVENT_MARKET_CARD, videoAvailable: false })
            .mockReturnValueOnce({ ...EVENT_MARKET_CARD, videoAvailable: true });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(STATE, OWN_PROPS);
          const second = mapStateToProps(STATE, OWN_PROPS);

          expect(second.iconsList).not.toBe(first.iconsList);
        });
      });
    });

    describe("when HORIZONTAL_COUPON brand setting is true", () => {
      it("should return showHorizontalDuration as true", () => {
        getEventMarketCardByURN.mockReturnValueOnce(EVENT_MARKET_CARD);

        const { showHorizontalDuration } = setupMapStateToProps({
          state: {
            entities: { brandSettings: { HORIZONTAL_COUPON: true } },
          },
        });

        expect(showHorizontalDuration).toBe(true);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchRouterPushAction", () => {
    it("should dispatch router push action", () => {
      const { dispatchRouterPushAction } = mapDispatchToProps;
      const viewLink = { viewUrn: "ppb:urn", viewUrl: "http://url" };

      expect(dispatchRouterPushAction(viewLink)).toEqual({
        type: PUSH,
        payload: viewLink,
      });
    });
  });

  describe("dispatchMainMarketsTransitionsSubscription", () => {
    it("should dispatch SUBSCRIBE_MAIN_MARKET_TRANSITIONS action", () => {
      const { dispatchMainMarketsTransitionsSubscription } = mapDispatchToProps;
      const cardURN = "urn:ppb:eventmarketcard:1";
      const marketURNs = ["urn:ppb:excMarket:1"];

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

  describe("dispatchExchangeMarketUpdatesSubscribe", () => {
    it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
      const { dispatchExchangeMarketUpdatesSubscribe } = mapDispatchToProps;
      const marketId = "1.11111";

      expect(dispatchExchangeMarketUpdatesSubscribe(marketId)).toEqual({
        type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });

  describe("dispatchExchangeMarketUpdatesUnsubscribe", () => {
    it("should dispatch UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
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

  describe("dispatchCouponPrimaryMarketPress", () => {
    it("should dispatch UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET action", () => {
      const { dispatchCouponPrimaryMarketPress } = mapDispatchToProps;
      const couponCardGroupUrn = "couponCardGroupUrn";
      const sporteventURN = "sporteventURN";
      const href = "href";

      expect(dispatchCouponPrimaryMarketPress(couponCardGroupUrn, sporteventURN, href)).toEqual({
        type: UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
        payload: {
          couponCardGroupUrn,
          sporteventURN,
          href,
        },
      });
    });
  });
});
