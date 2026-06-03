import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { SupportingContentButton } from "@ppb/the-wall-web";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import ConnectedExchangeMarket from "../ExchangeMarket";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.web";
import styles from "../Coupon/Coupon.web.css";

import CouponExchange from "./CouponExchange.web";

jest.mock("../ExchangeMarket", () => jest.fn(() => <exchange-market />));
jest.mock("../ExchangeMarket/ExchangeMarket.web", () => jest.fn(() => <connected-exchange-market />));
jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header-mock />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header-mock />));
jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web", () => jest.fn(() => <stats-card />));
jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
jest.mock("@ppb/the-wall-web", () => ({
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));
jest.mock("../Betslip/withInlineBetslip/withInlineBetslip.web", () => ({
  withInlineBetslip: jest.fn((arg) => arg),
}));
jest.mock("@ppb/the-wall-icons", () => ({
  SupportingContentIconName: {
    TEAM_FORM: "TEAM_FORM",
    MATCH_STATS: "MATCH_STATS",
    MATCH_STATS_FILLED: "MATCH_STATS_FILLED",
  },
}));

const DEFAULT_PROPS = {
  urn: "ppb:fake:urn",
  marketURN: "ppb:fake:market:urn",
  couponCardGroupUrn: "couponCardGroupUrn",
  excMainMarketId: 1,
  iconsList: [IconsList.LIVE_VIDEO],
  videoAvailable: true,
  isToShowStatsButton: false,
  showHorizontalDuration: false,
  dispatchCouponPrimaryMarketPress: jest.fn(),
  dispatchExchangeMarketUpdatesSubscribe: jest.fn(),
  dispatchExchangeMarketUpdatesUnsubscribe: jest.fn(),
  dispatchMainMarketsTransitionsSubscription: jest.fn(),
  dispatchRouterPushAction: jest.fn(),
  displayRunners: { exchange: null },
};

const renderCouponExchange = (props = {}) => render(<CouponExchange {...DEFAULT_PROPS} {...props} />);

describe("CouponExchange", () => {
  const statsPebbleURN = "ppb:fake:stats:pebble:urn";

  beforeEach(() => {
    useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("the component is exported withInlineBetslip", () => {
    it("should call withInlineBetslip", () => {
      expect(withInlineBetslip).toHaveBeenCalledTimes(1);
    });
  });

  describe("when market urn is not defined", () => {
    it("should not render", () => {
      renderCouponExchange({
        marketURN: null,
        displayRunners: { exchange: null },
      });

      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
      expect(ConnectedExchangeMarket).not.toHaveBeenCalled();
    });
  });

  describe("when market urn is defined", () => {
    describe("Fixture Header", () => {
      describe("when event view link exists", () => {
        it("should render fixture header with activeProduct Exchange", async () => {
          await act(() =>
            renderCouponExchange({
              urn: "ppb:fake:urn",
              marketURN: "ppb:fake:market:urn",
              fixture: "ppb:fake:fixture:urn",
              sporteventURN: "ppb:fake:event:urn",
              fixtureViewMode: "INLINE",
              displayRunners: {
                exchange: {
                  market: {},
                  runners: [{ urn: "ppb:excRunner:1" }],
                },
              },
              eventViewLink: {
                viewUrl: "event:1",
                viewUrn: "ppb:tbd:view:event:1",
              },
            }),
          );

          expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
            {
              viewMode: "INLINE",
              stickyOnScroll: false,
              sporteventURN: "ppb:fake:event:urn",
              fixture: "ppb:fake:fixture:urn",
              showBottomSeparator: false,
              showHorizontalDuration: false,
              component: FixtureHeader,
              videoAvailable: true,
              iconsList: [IconsList.LIVE_VIDEO],
              displayRunners: [{ urn: "ppb:excRunner:1" }],
              activeProduct: Product.Exchange,
              marketURN: "ppb:fake:market:urn",
            },
            undefined,
          );
        });

        it("should dispatch dispatchMainMarketsTransitionsSubscription with cardUrn and exchange marketURN", async () => {
          const dispatchMainMarketsTransitionsSubscription = jest.fn();

          await act(() =>
            renderCouponExchange({
              urn: "ppb:fake:urn",
              marketURN: "ppb:fake:market:urn",
              fixture: "ppb:fake:fixture:urn",
              sporteventURN: "ppb:fake:event:urn",
              fixtureViewMode: "INLINE",
              displayRunners: {
                exchange: {
                  market: "excMarketURN",
                  runners: [],
                },
              },
              eventViewLink: {
                viewUrl: "event:1",
                viewUrn: "ppb:tbd:view:event:1",
              },
              dispatchMainMarketsTransitionsSubscription,
              cardUrn: "cardURN",
            }),
          );

          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardURN", ["excMarketURN"]);
        });

        describe("when clicking on the fixture", () => {
          describe("when event view link is defined", () => {
            it("should dispatch router push action and the GTM navigation event", () => {
              const dispatchRouterPushAction = jest.fn();
              const dispatchCouponPrimaryMarketPress = jest.fn();

              const { container } = renderCouponExchange({
                urn: "ppb:fake:urn",
                marketURN: "ppb:fake:market:urn",
                fixture: "ppb:fake:fixture:urn",
                sporteventURN: "sporteventURN",
                displayRunners: {
                  exchange: {
                    market: "ppb:fake:market:urn",
                    runners: [],
                  },
                },
                eventViewLink: {
                  viewUrl: "event:1",
                  viewUrn: "ppb:tbd:view:event:1",
                },
                dispatchRouterPushAction,
                dispatchCouponPrimaryMarketPress,
              });

              container.querySelector("a").click();

              expect(dispatchCouponPrimaryMarketPress).toHaveBeenCalledWith(
                "couponCardGroupUrn",
                "sporteventURN",
                "event:1",
              );
              expect(dispatchRouterPushAction).toHaveBeenCalledWith({
                viewUrl: "event:1",
                viewUrn: "ppb:tbd:view:event:1",
              });
            });
          });
        });
      });

      describe("when view link does not exist", () => {
        it("should not render fixture header", () => {
          renderCouponExchange({
            urn: "ppb:fake:urn",
            marketURN: "ppb:fake:market:urn",
            fixture: "ppb:fake:fixture:urn",
            displayRunners: {
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            },
          });

          expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
        });
      });
    });

    describe("ExchangeMarket", () => {
      it("should render ConnectedExchangeMarket", () => {
        renderCouponExchange({
          urn: "ppb:fake:urn",
          marketURN: "ppb:fake:market:urn",
          fixture: "ppb:fake:fixture:urn",
          marketStatus: ExchangeMarketStatus.Suspended,
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        expect(ConnectedExchangeMarket).toHaveBeenCalledWith(
          {
            urn: "ppb:fake:market:urn",
            cardUrn: "ppb:fake:urn",
            inline: true,
            component: expect.any(Object),
            displayRunnersUrns: [],
          },
          undefined,
        );
      });

      describe("when renderBetslip is defined", () => {
        it("should call renderBetslip for each exchange runner", () => {
          const renderBetslipSpy = jest.fn();

          renderCouponExchange({
            urn: "ppb:fake:urn",
            marketURN: "ppb:fake:market:urn",
            fixture: "ppb:fake:fixture:urn",
            marketStatus: "SUSPENDED",
            displayRunners: {
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [{ urn: "runner:a" }, { urn: "runner:b" }],
              },
            },
            renderBetslip: renderBetslipSpy,
          });

          expect(renderBetslipSpy).toHaveBeenCalledTimes(2);
          expect(renderBetslipSpy).toHaveBeenCalledWith("runner:a");
          expect(renderBetslipSpy).toHaveBeenCalledWith("runner:b");
        });
      });
    });
  });

  describe("Base Fixture", () => {
    describe("when mainMarketUrns is not empty", () => {
      it("should call dispatchMainMarketsTransitionsSubscription with exchange main market and withFixtureUpdates", async () => {
        const dispatchMainMarketsTransitionsSubscription = jest.fn();

        await act(() =>
          renderCouponExchange({
            excMainMarketId: null,
            cardUrn: "cardUrn",
            dispatchMainMarketsTransitionsSubscription,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
            },
          }),
        );

        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardUrn", ["ppb:fake:excmarket:urn"]);
        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(
          "cardUrn",
          ["ppb:excMarket:1.178522912"],
          true,
        );
      });
    });

    describe("when is intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: true, ref: null });
      });

      describe("when excMainMarketId exists", () => {
        it("should call dispatchExchangeMarketUpdatesSubscribe with correct params", () => {
          const dispatchExchangeMarketUpdatesSubscribe = jest.fn();

          renderCouponExchange({
            excMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchExchangeMarketUpdatesSubscribe,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchExchangeMarketUpdatesSubscribe).toHaveBeenCalledWith(1);
        });
      });
    });

    describe("when is not intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
      });

      describe("when excMainMarketId exists", () => {
        it("should call dispatchExchangeMarketUpdatesUnsubscribe with correct params", () => {
          const dispatchExchangeMarketUpdatesUnsubscribe = jest.fn();

          renderCouponExchange({
            excMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchExchangeMarketUpdatesUnsubscribe,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchExchangeMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1);
        });
      });
    });
  });

  describe("FootballStats", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const BASE_MOCK = {
      excMainMarketId: null,
      cardUrn: "cardUrn",
      fixture: {
        typename: "BaseFixture",
        sportevent: "ppb:event:1234",
        mainMarket: {
          exchange: "ppb:excMarket:1.178522912",
          sportsbook: "ppb:sbkMarket:1234",
        },
      },
      displayRunners: {
        exchange: {
          market: "ppb:fake:excmarket:urn",
          runners: [],
        },
      },
      statsPebbleURN,
    };

    describe("and isToShowStats is false", () => {
      beforeEach(() => {
        renderCouponExchange({ ...BASE_MOCK, isToShowStatsButton: false });
      });

      it("should not call SupportingContentButton", () => {
        expect(SupportingContentButton).not.toHaveBeenCalled();
      });

      it("should not call StatsPebbleCardGroup", () => {
        expect(StatsPebbleCardGroup).not.toHaveBeenCalled();
      });
    });

    describe("and isToShowStats is true", () => {
      beforeEach(async () => {
        renderCouponExchange({ ...BASE_MOCK, isToShowStatsButton: true });
      });

      afterEach(() => jest.clearAllMocks());

      it("should call SupportingContentButton with the correct properties", () => {
        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            icon: "MATCH_STATS",
            isOpen: false,
            className: styles.couponSupportingContentButton,
            onPress: expect.any(Function),
          },
          undefined,
        );
        expect(SupportingContentButton).toHaveBeenCalledTimes(1);
      });

      it("should not call StatsPebbleCardGroup", () => {
        expect(StatsPebbleCardGroup).not.toHaveBeenCalled();
      });

      describe("and the SupportingContentButton is clicked", () => {
        beforeEach(async () => {
          await act(async () => {
            SupportingContentButton.mock.calls[0][0].onPress();
          });
        });

        it("should call SupportingContentButton with closed icon on first render", () => {
          expect(SupportingContentButton).toHaveBeenNthCalledWith(
            1,
            {
              icon: "MATCH_STATS",
              isOpen: false,
              className: styles.couponSupportingContentButton,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });

        it("should call SupportingContentButton with open icon on second render", () => {
          expect(SupportingContentButton).toHaveBeenNthCalledWith(
            2,
            {
              icon: "MATCH_STATS_FILLED",
              isOpen: true,
              className: styles.couponSupportingContentButton,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });

        it("should call SupportingContentButton twice", () => {
          expect(SupportingContentButton).toHaveBeenCalledTimes(2);
        });

        it("should render StatsPebbleCardGroup", () => {
          expect(StatsPebbleCardGroup).toHaveBeenCalledWith(
            {
              urn: statsPebbleURN,
            },
            undefined,
          );
        });
      });
    });
  });
});
