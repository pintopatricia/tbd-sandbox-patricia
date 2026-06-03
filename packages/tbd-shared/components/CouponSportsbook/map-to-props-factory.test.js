import { PUSH } from "@ppb/tbd-store/actions/router";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  createSportsbookMarketByURNSelector,
  getSportsbookMarket,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { SUBSCRIBE_MAIN_MARKET_TRANSITIONS } from "@ppb/tbd-store/actions/market-transitions";
import { UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET } from "@ppb/tbd-store/actions/navigation";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getEventMarketCardByURN = jest.fn();
const getSportsbookMarketByURNSelector = jest.fn();
const isBrandSettingEnabled = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarket: jest.fn(),
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURNSelector),
}));

jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getEventMarketCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn().mockReturnValue("SELECTION_TYPE_ICON"),
  SelectionTypeIconVariant: {
    COLORED: "COLORED",
  },
}));

const STATE = {
  layouts: {
    cards: {
      eventmarkets: {},
    },
  },
  entities: {
    sportsbookmarkets: {},
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

  it("should create selector for sportsbook market by urn", () => {
    makeMapStateToProps();

    expect(createSportsbookMarketByURNSelector).toHaveBeenCalledWith();
    expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create brand setting selector", () => {
    makeMapStateToProps();

    expect(createIsBrandSettingEnabledSelector).toHaveBeenCalledWith();
    expect(createIsBrandSettingEnabledSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    const EVENT_MARKET_CARD = {
      fixture: "ppb:fixture:1",
      marketURNs: ["urn:ppb:sbkMarket:1"],
      eventViewLink: {
        viewUrl: "https://url",
        viewUrn: "urn:ppb:event:1",
      },
      displayRunners: {
        sportsbook: undefined,
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

    it("should map state to props for sportsbook display runner", () => {
      getEventMarketCardByURN.mockReturnValueOnce({
        ...EVENT_MARKET_CARD,
        displayRunners: {
          sportsbook: {
            market: "urn:ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
      });
      getSportsbookMarketByURNSelector.mockReturnValue({ marketType: "MATCH_ODDS_90" });

      const props = setupMapStateToProps();

      expect(props).toEqual({
        fixture: "ppb:fixture:1",
        eventViewLink: {
          viewUrl: "https://url",
          viewUrn: "urn:ppb:event:1",
        },
        marketURN: "urn:ppb:sbkMarket:1",
        displayRunners: {
          sportsbook: {
            market: "urn:ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        isToShowStatsButton: true,
        fixtureViewMode: "COUPON",
        sporteventURN: "ppb:event:1",
        cardUrn: OWN_PROPS.urn,
        videoAvailable: true,
        iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
        statsPebbleURN: "urn:ppb:statsPebble:1",
        showHorizontalDuration: false,
      });
      expect(getEventMarketCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.eventmarkets, OWN_PROPS.urn);
    });

    describe("when fixture is a BaseFixture", () => {
      it("should return sbkMainMarketId", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          fixture: {
            urn: "ppb:fixture:29444319##MATCH_ODDS",
            typename: "BaseFixture",
            sportevent: "ppb:event:29444319",
            mainMarket: { exchange: "ppb:excMarket:1.11111", sportsbook: "ppb:sbkMarket:924.111111" },
          },
        });

        getSportsbookMarket.mockReturnValue({ marketId: "924.111111" });

        const props = setupMapStateToProps();

        expect(getSportsbookMarket).toHaveBeenCalledWith(STATE, "ppb:sbkMarket:924.111111");

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
            sbkMainMarketId: "924.111111",
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
      it("should include 90Min icon when market type is MATCH_ODDS_90 and there's a sportsbook displayRunner", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          displayRunners: {
            sportsbook: {
              market: "urn:ppb:sbkMarket:1",
              runners: ["runner1Urn", "runner2Urn"],
            },
          },
        });
        getSportsbookMarketByURNSelector.mockReturnValueOnce({ marketType: "MATCH_ODDS_90" });

        const { iconsList } = setupMapStateToProps();

        expect(iconsList).toContain(IconsList.NINETY_MINUTE_PAYOUT);
      });

      it("should include live video icon when videoAvailable is true", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          videoAvailable: true,
        });

        const { iconsList } = setupMapStateToProps();

        expect(iconsList).toContain(IconsList.LIVE_VIDEO);
      });

      describe("when brand setting SHOW_SELECTION_TYPE_ICON is enabled", () => {
        beforeAll(() => {
          isBrandSettingEnabled.mockReturnValue(true);
        });

        it("should include selection type icon when market is supported and there's a sportsbook displayRunner", () => {
          getEventMarketCardByURN.mockReturnValueOnce({
            ...EVENT_MARKET_CARD,
            displayRunners: {
              sportsbook: {
                market: "urn:ppb:sbkMarket:1",
                runners: ["runner1Urn", "runner2Urn"],
              },
            },
          });
          getSportsbookMarketByURNSelector.mockReturnValueOnce({ marketType: "FULL_TIME_RESULT_-_2_UP" });

          const { iconsList } = setupMapStateToProps();

          expect(iconsList).toContain("SELECTION_TYPE_ICON");
        });

        it("should include selection type icon when isSuperSubEligible is true", () => {
          getEventMarketCardByURN.mockReturnValueOnce({
            ...EVENT_MARKET_CARD,
            isSuperSubEligible: true,
          });

          const { iconsList } = setupMapStateToProps();

          expect(iconsList).toContain("SELECTION_TYPE_ICON");
        });
      });

      describe("when brand setting SHOW_SELECTION_TYPE_ICON is disabled", () => {
        beforeAll(() => {
          isBrandSettingEnabled.mockReturnValue(false);
        });

        it("should not include selection type icon when market is supported", () => {
          getEventMarketCardByURN.mockReturnValueOnce(EVENT_MARKET_CARD);
          getSportsbookMarketByURNSelector.mockReturnValueOnce({ marketType: "FULL_TIME_RESULT_-_2_UP" });

          const { iconsList } = setupMapStateToProps();

          expect(iconsList).not.toContain("SELECTION_TYPE_ICON");
        });

        it("should not include selection type icon when isSuperSubEligible is true", () => {
          getEventMarketCardByURN.mockReturnValueOnce({
            ...EVENT_MARKET_CARD,
            isSuperSubEligible: true,
          });

          const { iconsList } = setupMapStateToProps();

          expect(iconsList).not.toContain("SELECTION_TYPE_ICON");
        });
      });

      describe("memoization", () => {
        beforeEach(() => {
          getEventMarketCardByURN.mockReset();
          getSportsbookMarketByURNSelector.mockReset();
          isBrandSettingEnabled.mockReset();
        });

        it("should return the same iconsList reference across calls when inputs are unchanged", () => {
          const card = {
            ...EVENT_MARKET_CARD,
            displayRunners: {
              sportsbook: {
                market: "urn:ppb:sbkMarket:1",
                runners: ["runner1Urn", "runner2Urn"],
              },
            },
          };
          getEventMarketCardByURN.mockReturnValue(card);
          getSportsbookMarketByURNSelector.mockReturnValue({ marketType: "MATCH_ODDS_90" });
          isBrandSettingEnabled.mockReturnValue(false);

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(STATE, OWN_PROPS);
          const second = mapStateToProps(STATE, OWN_PROPS);

          expect(second.iconsList).toBe(first.iconsList);
        });

        it("should return a new iconsList reference when marketType changes", () => {
          const card = {
            ...EVENT_MARKET_CARD,
            displayRunners: {
              sportsbook: {
                market: "urn:ppb:sbkMarket:1",
                runners: ["runner1Urn", "runner2Urn"],
              },
            },
          };
          getEventMarketCardByURN.mockReturnValue(card);
          isBrandSettingEnabled.mockReturnValue(false);
          getSportsbookMarketByURNSelector
            .mockReturnValueOnce({ marketType: "MATCH_ODDS_90" })
            .mockReturnValueOnce({ marketType: "FULL_TIME_RESULT_-_2_UP" });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(STATE, OWN_PROPS);
          const second = mapStateToProps(STATE, OWN_PROPS);

          expect(second.iconsList).not.toBe(first.iconsList);
        });
      });
    });

    describe("when HORIZONTAL_COUPON brand setting is true", () => {
      it("should return showHorizontalDuration as true", () => {
        getEventMarketCardByURN.mockReturnValueOnce({
          ...EVENT_MARKET_CARD,
          displayRunners: {
            sportsbook: {
              market: "urn:ppb:sbkMarket:1",
              runners: ["runner1Urn", "runner2Urn"],
            },
          },
        });

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
      const marketURNs = ["urn:ppb:sbkMarket:1"];

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
      const subscriberId = "subscriber:1";

      expect(dispatchSportsbookMarketUpdatesSubscribe(marketId, subscriberId)).toEqual({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
          subscriberId,
        },
      });
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
      const { dispatchSportsbookMarketUpdatesUnsubscribe } = mapDispatchToProps;
      const marketId = "924.111111";
      const subscriberId = "subscriber:1";

      expect(dispatchSportsbookMarketUpdatesUnsubscribe(marketId, subscriberId)).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
          subscriberId,
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
