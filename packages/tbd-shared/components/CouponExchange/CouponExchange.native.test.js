import { fireEvent, render } from "@testing-library/react-native";

import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { navigate } from "@ppb/tbd-router/native";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SupportingContentButton } from "@ppb/the-wall-native";

import ConnectedExchangeMarket from "../ExchangeMarket";
import ExchangeMarket from "../ExchangeMarket/ExchangeMarket.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.native";
import styles from "../Coupon/Coupon.native.styles";
import { FIXTURE_PRESSABLE, STATS_PRESSABLE } from "../Coupon/Coupon.native.selectors";

import CouponExchange from "./CouponExchange.native";

jest.mock("../ExchangeMarket", () => jest.fn(() => <exchange-market />));
jest.mock("../ExchangeMarket/ExchangeMarket.native", () => jest.fn(() => <connected-exchange-market />));
jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));
jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native", () => jest.fn(() => <stats-pebble-card-group />));
jest.mock("../Betslip/withInlineBetslip/withInlineBetslip.native", () => ({
  withInlineBetslip: jest.fn((arg) => arg),
}));
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));
jest.mock("@ppb/the-wall-native", () => ({
  SupportingContentButton: jest.fn((props) => <supporting-content-button {...props} />),
}));
jest.mock("@ppb/the-wall-icons", () => ({
  SupportingContentIconName: {
    TEAM_FORM: "TEAM_FORM",
    MATCH_STATS: "MATCH_STATS",
    MATCH_STATS_FILLED: "MATCH_STATS_FILLED",
  },
}));
jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    CouponSupportingContentButtonBorderRadius: {},
    CouponPadding: { paddingTop: 12, paddingBottom: 12, paddingLeft: 0, paddingRight: 12 },
    CouponHorizontalGapPrimary: { gap: 8 },
    StatsBackgroundColour: "#FCFCFC",
  },
  spacings: {},
  heights: {},
}));
jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const DEFAULT_PROPS = {
  urn: "ppb:fake:urn",
  couponCardGroupUrn: "couponCardGroupUrn",
  videoAvailable: true,
  iconsList: [IconsList.LIVE_VIDEO],
  isToShowStatsButton: false,
  showHorizontalDuration: false,
  displayRunners: { exchange: null },
  dispatchMainMarketsTransitionsSubscription: jest.fn(),
  dispatchCouponPrimaryMarketPress: jest.fn(),
};

const renderCouponExchange = (overwrites = {}) => render(<CouponExchange {...DEFAULT_PROPS} {...overwrites} />);

describe("CouponExchange", () => {
  afterEach(jest.clearAllMocks);

  const urn = "ppb:fake:urn";
  const marketURN = "ppb:fake:market:urn";
  const sporteventURN = "ppb:fake:sportevent:urn";
  const fixture = "ppb:fake:fixture:urn";
  const fixtureViewMode = "COUPON";
  const cardUrn = "ppb:fake:card:urn";
  const eventViewLink = { viewUrl: "event:1", viewUrn: "ppb:tbd:view:event:1" };
  const statsPebbleURN = "ppb:fake:stats:pebble:urn";

  describe("the component is exported withInlineBetslip", () => {
    it("should call withInlineBetslip", () => {
      expect(withInlineBetslip).toHaveBeenCalledTimes(1);
    });
  });

  describe("when market urn is not defined", () => {
    it("should not render", () => {
      renderCouponExchange({
        displayRunners: { exchange: null },
      });

      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
      expect(ConnectedExchangeMarket).not.toHaveBeenCalled();
    });
  });

  describe("when market urn is defined", () => {
    describe("Fixture Header", () => {
      describe("when event view link exists", () => {
        it("should render fixture header with activeProduct Exchange", () => {
          renderCouponExchange({
            urn,
            marketURN,
            sporteventURN,
            fixture,
            fixtureViewMode,
            cardUrn,
            displayRunners: {
              exchange: {
                market: marketURN,
                runners: [{ urn: "ppb:excRunner:1" }],
              },
            },
            eventViewLink,
          });

          expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
            {
              component: FixtureHeader,
              cardURN: cardUrn,
              fixture,
              activeProduct: Product.Exchange,
              marketURN,
              displayRunners: [{ urn: "ppb:excRunner:1" }],
              sporteventURN,
              viewMode: fixtureViewMode,
              stickyOnScroll: false,
              showBottomSeparator: false,
              videoAvailable: true,
              iconsList: [IconsList.LIVE_VIDEO],
              showHorizontalDuration: false,
            },
            undefined,
          );
        });
      });

      describe("when event view link does not exist", () => {
        it("should not render fixture header", () => {
          renderCouponExchange({
            urn,
            marketURN,
            fixture,
            displayRunners: {
              exchange: {
                market: marketURN,
                runners: [],
              },
            },
          });

          expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
        });
      });
    });

    describe("when clicking on the fixture", () => {
      describe("when event view link is defined", () => {
        it("should call navigation function and dispatch the GTM navigation event", () => {
          const dispatchCouponPrimaryMarketPress = jest.fn();
          const container = renderCouponExchange({
            urn,
            marketURN,
            sporteventURN,
            fixture,
            fixtureViewMode,
            cardUrn,
            displayRunners: {
              exchange: { market: marketURN, runners: [] },
            },
            eventViewLink,
            dispatchCouponPrimaryMarketPress,
          });

          const pressable = container.queryByTestId(FIXTURE_PRESSABLE);
          fireEvent.press(pressable);

          expect(dispatchCouponPrimaryMarketPress).toHaveBeenCalledWith(
            "couponCardGroupUrn",
            sporteventURN,
            eventViewLink.viewUrl,
          );
          expect(navigate).toHaveBeenCalledWith(eventViewLink);
        });
      });
    });

    describe("dispatchMainMarketsTransitionsSubscription", () => {
      it("should be called with the exchange market URN", () => {
        const dispatchMainMarketsTransitionsSubscription = jest.fn();

        renderCouponExchange({
          marketURN,
          cardUrn,
          displayRunners: {
            exchange: { market: "excMarketURN", runners: [] },
          },
          dispatchMainMarketsTransitionsSubscription,
        });

        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(cardUrn, ["excMarketURN"]);
      });

      describe("Base Fixture", () => {
        it("should call dispatchMainMarketsTransitionsSubscription with exchange main market and withFixtureUpdates", () => {
          const dispatchMainMarketsTransitionsSubscription = jest.fn();

          renderCouponExchange({
            urn,
            marketURN,
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
              exchange: { market: "ppb:fake:excmarket:urn", runners: [] },
            },
          });

          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardUrn", [
            "ppb:fake:excmarket:urn",
          ]);
          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(
            "cardUrn",
            ["ppb:excMarket:1.178522912"],
            true,
          );
        });
      });
    });

    describe("ExchangeMarket", () => {
      it("should render ConnectedExchangeMarket", () => {
        renderCouponExchange({
          urn,
          marketURN,
          displayRunners: {
            exchange: { market: marketURN, runners: [] },
          },
          visible: true,
        });

        expect(ConnectedExchangeMarket).toHaveBeenCalledWith(
          {
            urn: marketURN,
            cardUrn: urn,
            component: ExchangeMarket,
            inline: true,
            displayRunnersUrns: [],
            visible: true,
          },
          undefined,
        );
      });

      describe("when renderBetslip is defined", () => {
        it("should call renderBetslip for each exchange runner", () => {
          const renderBetslipSpy = jest.fn();

          renderCouponExchange({
            urn,
            marketURN,
            displayRunners: {
              exchange: {
                market: marketURN,
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

  describe("when there is FootballStats information", () => {
    const BASE_MOCK = {
      urn,
      marketURN,
      sporteventURN,
      fixture,
      fixtureViewMode,
      cardUrn,
      displayRunners: {
        exchange: {
          market: marketURN,
          runners: [{ runnerURN: "ppb:excRunner:1" }],
        },
      },
      eventViewLink,
      statsPebbleURN,
    };

    describe("and isToShowStatsButton is false", () => {
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

    describe("and isToShowStatsButton is true", () => {
      beforeEach(() => {
        renderCouponExchange({ ...BASE_MOCK, isToShowStatsButton: true });
      });

      it("should call SupportingContentButton with the correct properties", () => {
        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            icon: "MATCH_STATS",
            isOpen: false,
            style: styles.couponSupportingContentButton,
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
        beforeEach(() => {
          const container = renderCouponExchange({ ...BASE_MOCK, isToShowStatsButton: true });
          const statsButtonContainer = container.queryByTestId(STATS_PRESSABLE);
          const pressable = statsButtonContainer.findByProps({ icon: "MATCH_STATS" });

          fireEvent.press(pressable);
        });

        it("should call the StatsPebbleCardGroup component", () => {
          expect(StatsPebbleCardGroup).toHaveBeenCalledTimes(1);
          expect(StatsPebbleCardGroup).toHaveBeenCalledWith(
            {
              urn: statsPebbleURN,
            },
            undefined,
          );
        });

        it("should call SupportingContentButton with open icon", () => {
          expect(SupportingContentButton).toHaveBeenCalledWith(
            {
              icon: "MATCH_STATS_FILLED",
              isOpen: true,
              style: styles.couponSupportingContentButton,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
      });
    });
  });
});
