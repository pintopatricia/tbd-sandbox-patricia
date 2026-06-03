import { fireEvent, render } from "@testing-library/react-native";

import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { navigate } from "@ppb/tbd-router/native";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SupportingContentButton } from "@ppb/the-wall-native";

import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import styles from "../Coupon/Coupon.native.styles";
import { FIXTURE_PRESSABLE, STATS_PRESSABLE } from "../Coupon/Coupon.native.selectors";

import CouponSportsbook from "./CouponSportsbook.native";

jest.mock("../SportsbookMarket", () => jest.fn(() => <sportsbook-market />));
jest.mock("../SportsbookMarket/SportsbookMarket.native", () => jest.fn(() => <connected-sportsbook-market />));
jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));
jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native", () => jest.fn(() => <stats-pebble-card-group />));
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
  displayRunners: { sportsbook: null },
  dispatchMainMarketsTransitionsSubscription: jest.fn(),
  dispatchCouponPrimaryMarketPress: jest.fn(),
};

const renderCouponSportsbook = (overwrites = {}) => render(<CouponSportsbook {...DEFAULT_PROPS} {...overwrites} />);

describe("CouponSportsbook", () => {
  afterEach(jest.clearAllMocks);

  const urn = "ppb:fake:urn";
  const marketURN = "ppb:fake:market:urn";
  const sporteventURN = "ppb:fake:sportevent:urn";
  const fixture = "ppb:fake:fixture:urn";
  const fixtureViewMode = "COUPON";
  const cardUrn = "ppb:fake:card:urn";
  const eventViewLink = { viewUrl: "event:1", viewUrn: "ppb:tbd:view:event:1" };
  const statsPebbleURN = "ppb:fake:stats:pebble:urn";

  describe("when market urn is not defined", () => {
    it("should not render", () => {
      renderCouponSportsbook({
        displayRunners: { sportsbook: null },
      });

      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
      expect(ConnectedSportsbookMarket).not.toHaveBeenCalled();
    });
  });

  describe("when market urn is defined", () => {
    describe("Fixture Header", () => {
      describe("when event view link exists", () => {
        it("should render fixture header with activeProduct Sportsbook", () => {
          renderCouponSportsbook({
            urn,
            marketURN,
            sporteventURN,
            fixture,
            fixtureViewMode,
            cardUrn,
            displayRunners: {
              sportsbook: {
                market: marketURN,
                runners: [{ urn: "ppb:sbkRunner:1" }],
              },
            },
            eventViewLink,
          });

          expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
            {
              component: FixtureHeader,
              cardURN: cardUrn,
              fixture,
              activeProduct: Product.Sportsbook,
              marketURN,
              displayRunners: [{ urn: "ppb:sbkRunner:1" }],
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
          renderCouponSportsbook({
            urn,
            marketURN,
            fixture,
            displayRunners: {
              sportsbook: {
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
          const container = renderCouponSportsbook({
            urn,
            marketURN,
            sporteventURN,
            fixture,
            fixtureViewMode,
            cardUrn,
            displayRunners: {
              sportsbook: { market: marketURN, runners: [] },
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
      it("should be called with the sportsbook market URN", () => {
        const dispatchMainMarketsTransitionsSubscription = jest.fn();

        renderCouponSportsbook({
          marketURN,
          cardUrn,
          displayRunners: {
            sportsbook: { market: "sbkMarketURN", runners: [] },
          },
          dispatchMainMarketsTransitionsSubscription,
        });

        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(cardUrn, ["sbkMarketURN"]);
      });

      describe("Base Fixture", () => {
        it("should call dispatchMainMarketsTransitionsSubscription with sportsbook main market and withFixtureUpdates", () => {
          const dispatchMainMarketsTransitionsSubscription = jest.fn();

          renderCouponSportsbook({
            urn,
            marketURN,
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
              sportsbook: { market: "ppb:fake:sbkmarket:urn", runners: [] },
            },
          });

          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardUrn", [
            "ppb:fake:sbkmarket:urn",
          ]);
          expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(
            "cardUrn",
            ["ppb:sbkMarket:924.111111"],
            true,
          );
        });
      });
    });

    describe("SportsbookMarket", () => {
      it("should render ConnectedSportsbookMarket", () => {
        renderCouponSportsbook({
          urn,
          marketURN,
          displayRunners: {
            sportsbook: { market: marketURN, runners: [] },
          },
          visible: true,
        });

        expect(ConnectedSportsbookMarket).toHaveBeenCalledWith(
          {
            urn: marketURN,
            cardUrn: urn,
            component: SportsbookMarket,
            displayRunnersUrns: [],
            template: "COUPON",
            visible: true,
          },
          undefined,
        );
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
        sportsbook: {
          market: marketURN,
          runners: [{ runnerURN: "ppb:sbkRunner:1" }],
        },
      },
      eventViewLink,
      statsPebbleURN,
    };

    describe("and isToShowStatsButton is false", () => {
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

    describe("and isToShowStatsButton is true", () => {
      beforeEach(() => {
        renderCouponSportsbook({ ...BASE_MOCK, isToShowStatsButton: true });
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
          const container = renderCouponSportsbook({ ...BASE_MOCK, isToShowStatsButton: true });
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
