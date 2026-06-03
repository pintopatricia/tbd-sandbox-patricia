import { UI__TOGGLE_SHOW_MORE_RUNNERS, UI__PROMO_DESCRIPTION_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { UI__NAVIGATE_TO_MARKET_VIEW, UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { PUSH, EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store/actions/router";

import { MARKET_BLURB_SUPER_SUB } from "../../config/market-blurb";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getThrottle = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

const getSportsbookMarketByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURN),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const STATE_MOCK = {
  entities: {
    sportsbookmarkets: {},
  },
};

const setup = (props = {}) => makeMapStateToProps()(STATE_MOCK, props);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when displayRunners is empty", () => {
    it("should pass all props with empty tabs", () => {
      const props = setup({ displayRunners: {} });

      expect(props).toEqual({
        runnerUrns: [],
        getCardType: expect.any(Function),
        runnersAmount: 0,
      });
    });
  });

  describe("when displayRunners is not empty", () => {
    describe("when there is exchange", () => {
      it("should return respective urn definitions", () => {
        const props = setup({
          displayRunners: {
            exchange: {
              market: "ppb:excMarket:1",
              runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
            },
          },
        });

        expect(props).toEqual({
          marketUrn: "ppb:excMarket:1",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
          getCardType: expect.any(Function),
        });
      });
    });

    describe("when there is sportsbook", () => {
      it("should return respective urn definitions", () => {
        const props = setup({
          displayRunners: {
            sportsbook: {
              market: "ppb:sbkMarket:1",
              runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
            },
          },
        });

        expect(props).toEqual({
          marketUrn: "ppb:sbkMarket:1",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
          getCardType: expect.any(Function),
        });
      });

      describe("when it's a super sub market", () => {
        beforeEach(() => {
          getSportsbookMarketByURN.mockReturnValueOnce({ isSuperSub: true });
        });

        describe("and the throttle SUPER_SUB_MARKET_BLURBS is disabled", () => {
          beforeEach(() => {
            getThrottle.mockReturnValueOnce({ isActive: false });
          });

          it("should not return a market blurb", () => {
            const { marketBlurb } = setup({
              displayRunners: {
                sportsbook: {
                  market: "ppb:sbkMarket:1",
                  runners: [],
                },
              },
            });

            expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
            expect(getSportsbookMarketByURN).toHaveBeenCalledWith(
              STATE_MOCK.entities.sportsbookmarkets,
              "ppb:sbkMarket:1",
            );

            expect(marketBlurb).toBeUndefined();
          });
        });

        describe("and the throttle SUPER_SUB_MARKET_BLURBS is active", () => {
          beforeEach(() => {
            getThrottle.mockReturnValueOnce({ isActive: true });
          });

          it("should return the super sub market blurb", () => {
            const { marketBlurb } = setup({
              displayRunners: {
                sportsbook: {
                  market: "ppb:sbkMarket:1",
                  runners: [],
                },
              },
            });

            expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
            expect(getSportsbookMarketByURN).toHaveBeenCalledWith({}, "ppb:sbkMarket:1");

            expect(marketBlurb).toEqual(MARKET_BLURB_SUPER_SUB);
          });
        });
      });
    });

    describe("when there is sportsbook and exchange", () => {
      it("should return respective the first available", () => {
        const props = setup({
          displayRunners: {
            sportsbook: {
              market: "ppb:sbkMarket:1",
              runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
            },
            exchange: {
              market: "ppb:excMarket:1",
              runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
            },
          },
        });

        expect(props).toEqual({
          marketUrn: "ppb:sbkMarket:1",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
          getCardType: expect.any(Function),
        });
      });
    });
  });

  describe("getCardType", () => {
    it("should return correct card type when isCashoutQuoteAvailable is truthy", () => {
      const { getCardType } = setup();

      expect(getCardType({ isCashoutQuoteAvailable: true })).toStrictEqual("MarketExtendedCard");
    });

    it("should return correct card type when isCashoutQuoteAvailable is not truthy", () => {
      const { getCardType } = setup();

      expect(getCardType()).toStrictEqual("MarketCard");
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("navigateToMarketView", () => {
    it("should create navigate to market view action", () => {
      const { navigateToMarketView } = mapDispatchToProps;
      expect(navigateToMarketView("MARKET_CARD", "href", "cardUrn", "Match Odds")).toEqual({
        type: UI__NAVIGATE_TO_MARKET_VIEW,
        payload: {
          cardType: "MARKET_CARD",
          href: "href",
          cardUrn: "cardUrn",
          marketName: "Match Odds",
        },
      });
    });
  });

  describe("pushAction", () => {
    it("should create push action", () => {
      const { pushAction } = mapDispatchToProps;
      const viewLink = { viewUrl: "url" };
      expect(pushAction(viewLink)).toEqual({
        type: PUSH,
        payload: viewLink,
      });
    });
  });

  describe("dispatchToggleShowMoreRunners", () => {
    it("should create toggle show more runners action", () => {
      const { dispatchToggleShowMoreRunners } = mapDispatchToProps;
      expect(dispatchToggleShowMoreRunners("cardURN", true)).toEqual({
        type: UI__TOGGLE_SHOW_MORE_RUNNERS,
        payload: {
          cardUrn: "cardURN",
          showMore: true,
        },
      });
    });
  });

  describe("dispatchTogglePromoDescription", () => {
    it("should create promo description toggle action", () => {
      const { dispatchTogglePromoDescription } = mapDispatchToProps;
      expect(dispatchTogglePromoDescription("extra places", true, "promo")).toEqual({
        type: UI__PROMO_DESCRIPTION_TOGGLE,
        payload: {
          title: "extra places",
          isOpen: true,
          variant: "promo",
        },
      });
    });
  });

  describe("dispatchMarketBlurbLinkClick", () => {
    it("should create the market blurb link click action", () => {
      const link = { url: "url", text: "text" };

      const { dispatchMarketBlurbLinkClick } = mapDispatchToProps;

      expect(dispatchMarketBlurbLinkClick(link)).toEqual({
        type: "UI__MARKET_BLURB_LINK_CLICK",
        payload: {
          destinationUrl: link.url,
          elementText: link.text,
          variant: "info",
        },
      });
    });
  });

  describe("dispatchNavigateToView", () => {
    it("should create navigate to view action with label", () => {
      const { dispatchNavigateToView } = mapDispatchToProps;
      expect(dispatchNavigateToView("viewUrl", "cardUrn", "runnerName")).toEqual({
        type: UI__NAVIGATE_TO_VIEW,
        payload: {
          url: "viewUrl",
          cardURN: "cardUrn",
          label: "runnerName",
          module: "primary swimlane",
        },
      });
    });

    it("should create navigate to view action without label", () => {
      const { dispatchNavigateToView } = mapDispatchToProps;
      expect(dispatchNavigateToView("viewUrl", "cardUrn")).toEqual({
        type: UI__NAVIGATE_TO_VIEW,
        payload: {
          url: "viewUrl",
          cardURN: "cardUrn",
          label: "",
          module: "primary swimlane",
        },
      });
    });
  });

  describe("dispatchPushExternalBlankAction", () => {
    it("should create external push blank action", () => {
      const { dispatchPushExternalBlankAction } = mapDispatchToProps;
      expect(dispatchPushExternalBlankAction("https://example.com")).toEqual({
        type: EXTERNAL_PUSH_BLANK,
        payload: {
          viewUrl: "https://example.com",
          viewUrn: "",
        },
      });
    });
  });
});
