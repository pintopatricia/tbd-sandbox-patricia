import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { SupportingContentButton } from "@ppb/the-wall-web";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web";
import styles from "../Coupon/Coupon.web.css";

import CouponSportsbook from "./CouponSportsbook.web";

jest.mock("../SportsbookMarket", () => jest.fn(() => <sportsbook-market />));
jest.mock("../SportsbookMarket/SportsbookMarket.web", () => jest.fn(() => <connected-sportsbook-market />));
jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header-mock />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header-mock />));
jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web", () => jest.fn(() => <stats-card />));
jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
jest.mock("@ppb/the-wall-web", () => ({
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));
jest.mock("@ppb/the-wall-icons", () => ({
  SupportingContentIconName: {
    TEAM_FORM: "TEAM_FORM",
    MATCH_STATS: "MATCH_STATS",
    MATCH_STATS_FILLED: "MATCH_STATS_FILLED",
  },
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const DEFAULT_PROPS = {
  urn: "ppb:fake:urn",
  marketURN: "ppb:fake:market:urn",
  couponCardGroupUrn: "couponCardGroupUrn",
  sbkMainMarketId: 1,
  iconsList: [IconsList.LIVE_VIDEO],
  videoAvailable: true,
  isToShowStatsButton: false,
  showHorizontalDuration: false,
  dispatchCouponPrimaryMarketPress: jest.fn(),
  dispatchSportsbookMarketUpdatesSubscribe: jest.fn(),
  dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
  dispatchMainMarketsTransitionsSubscription: jest.fn(),
  dispatchRouterPushAction: jest.fn(),
  displayRunners: { sportsbook: null },
};

const renderCouponSportsbook = (props = {}) => render(<CouponSportsbook {...DEFAULT_PROPS} {...props} />);

describe("CouponSportsbook", () => {
  const statsPebbleURN = "ppb:fake:stats:pebble:urn";

  beforeEach(() => {
    useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when market urn is not defined", () => {
    it("should not render", () => {
      renderCouponSportsbook({
        marketURN: null,
        displayRunners: { sportsbook: null },
      });

      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
      expect(ConnectedSportsbookMarket).not.toHaveBeenCalled();
    });
  });

  describe("when market urn is defined", () => {
    describe("Fixture Header", () => {
      describe("when event view link exists", () => {
        it("should render fixture header with activeProduct Sportsbook", async () => {
          await act(() =>
            renderCouponSportsbook({
              urn: "ppb:fake:urn",
              marketURN: "ppb:fake:market:urn",
              fixture: "ppb:fake:fixture:urn",
              sporteventURN: "ppb:fake:event:urn",
              fixtureViewMode: "INLINE",
              displayRunners: {
                sportsbook: {
                  market: {},
                  runners: [{ urn: "ppb:sbkRunner:1" }],
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
              displayRunners: [{ urn: "ppb:sbkRunner:1" }],
              activeProduct: Product.Sportsbook,
              marketURN: "ppb:fake:market:urn",
            },
            undefined,
          );
        });

        it("should dispatch dispatchMainMarketsTransitionsSubscription with cardUrn and sportsbook marketURN", async () => {
          const dispatchMainMarketsTransitionsSubscription = jest.fn();

          await act(() =>
            renderCouponSportsbook({
              urn: "ppb:fake:urn",
              marketURN: "ppb:fake:market:urn",
              fixture: "ppb:fake:fixture:urn",
              sporteventURN: "ppb:fake:event:urn",
              fixtureViewMode: "INLINE",
              displayRunners: {
                sportsbook: {
                  market: "sbkMarketURN",
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

          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardURN", ["sbkMarketURN"]);
        });

        describe("when clicking on the fixture", () => {
          describe("when event view link is defined", () => {
            it("should dispatch router push action and the GTM navigation event", () => {
              const dispatchRouterPushAction = jest.fn();
              const dispatchCouponPrimaryMarketPress = jest.fn();

              const { container } = renderCouponSportsbook({
                urn: "ppb:fake:urn",
                marketURN: "ppb:fake:market:urn",
                fixture: "ppb:fake:fixture:urn",
                sporteventURN: "sporteventURN",
                displayRunners: {
                  sportsbook: {
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
          renderCouponSportsbook({
            urn: "ppb:fake:urn",
            marketURN: "ppb:fake:market:urn",
            fixture: "ppb:fake:fixture:urn",
            displayRunners: {
              sportsbook: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            },
          });

          expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
        });
      });
    });

    describe("SportsbookMarket", () => {
      it("should render ConnectedSportsbookMarket", () => {
        renderCouponSportsbook({
          urn: "ppb:fake:urn",
          marketURN: "ppb:fake:market:urn",
          fixture: "ppb:fake:fixture:urn",
          displayRunners: {
            sportsbook: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        expect(ConnectedSportsbookMarket).toHaveBeenCalledWith(
          {
            urn: "ppb:fake:market:urn",
            cardUrn: "ppb:fake:urn",
            component: expect.any(Object),
            displayRunnersUrns: [],
            template: "COUPON",
          },
          undefined,
        );
      });
    });
  });

  describe("Base Fixture", () => {
    describe("when mainMarketUrns is not empty", () => {
      it("should call dispatchMainMarketsTransitionsSubscription with sportsbook main market and withFixtureUpdates", async () => {
        const dispatchMainMarketsTransitionsSubscription = jest.fn();

        await act(() =>
          renderCouponSportsbook({
            sbkMainMarketId: null,
            cardUrn: "cardUrn",
            dispatchMainMarketsTransitionsSubscription,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:924.111111",
              },
            },
            displayRunners: {
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          }),
        );

        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardUrn", ["ppb:fake:sbkmarket:urn"]);
        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(
          "cardUrn",
          ["ppb:sbkMarket:924.111111"],
          true,
        );
      });
    });

    describe("when is intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: true, ref: null });
      });

      describe("when sbkMainMarketId exists", () => {
        it("should call dispatchSportsbookMarketUpdatesSubscribe with correct params", () => {
          const dispatchSportsbookMarketUpdatesSubscribe = jest.fn();

          renderCouponSportsbook({
            sbkMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchSportsbookMarketUpdatesSubscribe,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:924.111111",
              },
            },
            displayRunners: {
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchSportsbookMarketUpdatesSubscribe).toHaveBeenCalledWith(1, "r:id");
        });
      });
    });

    describe("when is not intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
      });

      describe("when sbkMainMarketId exists", () => {
        it("should call dispatchSportsbookMarketUpdatesUnsubscribe with correct params", () => {
          const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

          renderCouponSportsbook({
            sbkMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchSportsbookMarketUpdatesUnsubscribe,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:924.111111",
              },
            },
            displayRunners: {
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1, "r:id");
        });
      });
    });
  });

  describe("FootballStats", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const BASE_MOCK = {
      sbkMainMarketId: null,
      cardUrn: "cardUrn",
      fixture: {
        typename: "BaseFixture",
        sportevent: "ppb:event:1234",
        mainMarket: {
          exchange: "ppb:excMarket:1.178522912",
          sportsbook: "ppb:sbkMarket:924.111111",
        },
      },
      displayRunners: {
        sportsbook: {
          market: "ppb:fake:sbkmarket:urn",
          runners: [],
        },
      },
      statsPebbleURN,
    };

    describe("and isToShowStats is false", () => {
      beforeEach(() => {
        renderCouponSportsbook({ ...BASE_MOCK, isToShowStatsButton: false });
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
        renderCouponSportsbook({ ...BASE_MOCK, isToShowStatsButton: true });
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
