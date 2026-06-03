import { render, act } from "@testing-library/react-native";

import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

import { useIsFocused } from "@react-navigation/native";
import FixtureHeader from "./FixtureHeader.native";
import ConnectedFootballFixture from "../FootballFixture";
import ConnectedTennisFixture from "../TennisFixture";
import ConnectedBasketballFixture from "../BasketballFixture";
import ConnectedCricketFixture from "../CricketFixture";
import ConnectedTableTennisFixture from "../TableTennisFixture";
import ConnectedEventHeader from "../EventHeader";
import FootballFixture from "../FootballFixture/FootballFixture.native";
import TennisFixture from "../TennisFixture/TennisFixture.native";
import BasketballFixture from "../BasketballFixture/BasketballFixture.native";
import CricketFixture from "../CricketFixture/CricketFixture.native";
import TableTennisFixture from "../TableTennisFixture/TableTennisFixture.native";
import ConnectedIceHockeyFixture from "../IceHockeyFixture";
import IceHockeyFixture from "../IceHockeyFixture/IceHockeyFixture.native";
import ConnectedRugbyUnionFixture from "../RugbyUnionFixture";
import RugbyUnionFixture from "../RugbyUnionFixture/RugbyUnionFixture.native";
import ConnectedRugbyLeagueFixture from "../RugbyLeagueFixture";
import RugbyLeagueFixture from "../RugbyLeagueFixture/RugbyLeagueFixture.native";
import ConnectedSnookerFixture from "../SnookerFixture";
import SnookerFixture from "../SnookerFixture/SnookerFixture.native";
import ConnectedBaseballFixture from "../BaseballFixture";
import BaseballFixture from "../BaseballFixture/BaseballFixture.native";
import ConnectedDartsFixture from "../DartsFixture";
import DartsFixture from "../DartsFixture/DartsFixture.native";
import EventHeader from "../EventHeader/EventHeader.native";
import { useStickyCard } from "../../hooks/useStickyCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  EventHeader: jest.fn((props) => <event-header-component {...props} />),
}));

jest.mock("../FootballFixture/FootballFixture.native", () => jest.fn(() => <football-fixture-mock />));

jest.mock("../TennisFixture/TennisFixture.native", () => jest.fn(() => <tennis-fixture-mock />));

jest.mock("../BasketballFixture/BasketballFixture.native", () => jest.fn(() => <basketball-fixture-mock />));

jest.mock("../CricketFixture/CricketFixture.native", () => jest.fn(() => <cricket-fixture-mock />));

jest.mock("../TableTennisFixture/TableTennisFixture.native", () => jest.fn(() => <table-tennis-fixture-mock />));

jest.mock("../EventHeader/EventHeader.native", () => jest.fn(() => <event-header-mock />));

jest.mock("../FootballFixture", () => jest.fn(() => <connected-football-fixture-mock />));

jest.mock("../TennisFixture", () => jest.fn(() => <connected-tennis-fixture-mock />));

jest.mock("../BasketballFixture", () => jest.fn(() => <connected-basketball-fixture-mock />));

jest.mock("../CricketFixture", () => jest.fn(() => <connected-cricket-fixture-mock />));

jest.mock("../TableTennisFixture", () => jest.fn(() => <connected-table-tennis-fixture-mock />));

jest.mock("../IceHockeyFixture", () => jest.fn(() => <connected-ice-hockey-fixture-mock />));

jest.mock("../RugbyUnionFixture", () => jest.fn(() => <connected-rugby-union-fixture-mock />));

jest.mock("../RugbyLeagueFixture", () => jest.fn(() => <connected-rugby-league-fixture-mock />));

jest.mock("../SnookerFixture", () => jest.fn(() => <connected-snooker-fixture-mock />));

jest.mock("../BaseballFixture", () => jest.fn(() => <connected-baseball-fixture-mock />));

jest.mock("../DartsFixture/DartsFixture.native", () => jest.fn(() => <darts-fixture-mock />));

jest.mock("../DartsFixture", () => jest.fn(() => <connected-darts-fixture-mock />));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
  EventHeaderViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON" },
}));

jest.mock("../EventHeader", () => jest.fn(() => <connected-event-header-mock />));

jest.mock("../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notification-subscription-mock {...props} />),
);

jest.mock("../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn(() => <notification-subscription-mock />),
);

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  useScrollOffsetContext: jest.fn(() => 100),
}));

jest.mock("react-native-safe-area-context", () => ({
  initialWindowMetrics: {
    insets: {
      top: 44,
    },
  },
  useSafeAreaInsets: jest.fn(() => ({
    top: 44,
  })),
}));

jest.mock("../../hooks/useStickyCard.native", () => ({
  useStickyCard: jest.fn().mockReturnValue(false),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../../hooks/useDebounce", () => jest.fn().mockImplementation(() => true));

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: jest.fn().mockImplementation(() => true),
}));

const PROPS = {
  viewMode: ScoreboardViewMode.DEFAULT,
  stickyOnScroll: false,
  showBottomSeparator: true,
  showEventDateBelow: true,
  dispatchSubscribeFixtureUpdates: jest.fn(),
  dispatchUnsubscribeFixtureUpdates: jest.fn(),
  videoAvailable: true,
  iconsList: [IconsList.LIVE_VIDEO],
  activeProduct: Product.Exchange,
  marketURN: "market:urn",
};

const BASE_PROPS = {
  fixtureURN: "BaseFixtureURN",
  exchangeURN: "exchangeURN",
  sporteventURN: "sporteventURN",
  sportsbookURN: "sportsbookURN",
  ...PROPS,
};

const FOOTBALL_PROPS = {
  fixtureURN: "FootballFixtureURN",
  typename: "FootballFixture",
  ...PROPS,
};

const TENNIS_PROPS = {
  fixtureURN: "TennisFixtureURN",
  typename: "TennisMatch",
  ...PROPS,
};

const BASEBALL_PROPS = {
  fixtureURN: "BaseballFixtureURN",
  typename: "BaseballFixture",
  ...PROPS,
};

const BASKETBALL_PROPS = {
  fixtureURN: "BasketballFixtureURN",
  typename: "BasketballFixture",
  ...PROPS,
};

const CRICKET_PROPS = {
  fixtureURN: "CricketFixtureURN",
  typename: "CricketFixture",
  ...PROPS,
};

const TABLE_TENNIS_PROPS = {
  fixtureURN: "TableTennisFixtureURN",
  typename: "TableTennisFixture",
  ...PROPS,
};

const ICE_HOCKEY_PROPS = {
  fixtureURN: "IceHockeyFixtureURN",
  typename: "IceHockeyFixture",
  ...PROPS,
};

const RUGBY_UNION_PROPS = {
  fixtureURN: "RugbyUnionFixtureURN",
  typename: "RugbyUnionFixture",
  ...PROPS,
};

const RUGBY_LEAGUE_PROPS = {
  fixtureURN: "RugbyLeagueFixtureURN",
  typename: "RugbyLeagueFixture",
  ...PROPS,
};

const SNOOKER_PROPS = {
  fixtureURN: "SnookerFixtureURN",
  typename: "SnookerFixture",
  ...PROPS,
};

const DARTS_PROPS = {
  fixtureURN: "DartsFixtureURN",
  typename: "DartsFixture",
  ...PROPS,
};

const EXPECTED_BASE_PROPS = {
  component: EventHeader,
  exchangeURN: BASE_PROPS.exchangeURN,
  sporteventURN: BASE_PROPS.sporteventURN,
  sportsbookURN: BASE_PROPS.sportsbookURN,
  viewMode: PROPS.viewMode,
  showTertiaryTitle: true,
  showBottomSeparator: true,
  iconsList: [IconsList.LIVE_VIDEO],
  isSticky: false,
};

const EXPECTED_FOOTBALL_PROPS = {
  urn: FOOTBALL_PROPS.fixtureURN,
  component: FootballFixture,
  viewMode: FOOTBALL_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  iconsList: [IconsList.LIVE_VIDEO],
  activeProduct: Product.Exchange,
  marketURN: "market:urn",
};

const EXPECTED_TENNIS_PROPS = {
  urn: TENNIS_PROPS.fixtureURN,
  component: TennisFixture,
  viewMode: TENNIS_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_BASEBALL_PROPS = {
  urn: BASEBALL_PROPS.fixtureURN,
  component: BaseballFixture,
  viewMode: BASEBALL_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_BASKETBALL_PROPS = {
  urn: BASKETBALL_PROPS.fixtureURN,
  component: BasketballFixture,
  viewMode: BASKETBALL_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_CRICKET_PROPS = {
  urn: CRICKET_PROPS.fixtureURN,
  component: CricketFixture,
  viewMode: CRICKET_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_TABLE_TENNIS_PROPS = {
  urn: TABLE_TENNIS_PROPS.fixtureURN,
  component: TableTennisFixture,
  viewMode: TABLE_TENNIS_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_ICE_HOCKEY_PROPS = {
  urn: ICE_HOCKEY_PROPS.fixtureURN,
  component: IceHockeyFixture,
  viewMode: ICE_HOCKEY_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_RUGBY_UNION_PROPS = {
  urn: RUGBY_UNION_PROPS.fixtureURN,
  component: RugbyUnionFixture,
  viewMode: RUGBY_UNION_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_RUGBY_LEAGUE_PROPS = {
  urn: RUGBY_LEAGUE_PROPS.fixtureURN,
  component: RugbyLeagueFixture,
  viewMode: RUGBY_LEAGUE_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_SNOOKER_PROPS = {
  urn: SNOOKER_PROPS.fixtureURN,
  component: SnookerFixture,
  viewMode: SNOOKER_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_DARTS_PROPS = {
  urn: DARTS_PROPS.fixtureURN,
  component: DartsFixture,
  viewMode: DARTS_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

describe("FixtureHeader", () => {
  beforeEach(jest.clearAllMocks);

  describe("when stickyOnScroll", () => {
    describe("is set to true", () => {
      describe("and is not sticky", () => {
        it("must render with showTertiaryTitle as true", () => {
          useStickyCard.mockReturnValue(false);

          const props = { ...PROPS, stickyOnScroll: true, fixtureURN: "BasketballFixtureURN" };
          render(<FixtureHeader {...props} />);

          expect(ConnectedEventHeader).toHaveBeenCalledWith(
            expect.objectContaining({ showTertiaryTitle: true }),
            undefined,
          );
        });
      });

      describe("and is sticky", () => {
        it("must render with showTertiaryTitle as false", () => {
          jest.spyOn(Math, "round").mockReturnValue(0);
          useStickyCard.mockReturnValue(true);

          const props = { ...PROPS, stickyOnScroll: true, fixtureURN: "BasketballFixtureURN" };
          render(<FixtureHeader {...props} />);

          expect(ConnectedEventHeader).toHaveBeenCalledWith(
            expect.objectContaining({ showTertiaryTitle: false }),
            undefined,
          );
        });
      });
    });

    describe("is set to false", () => {
      it("must render with showTertiaryTitle as true", () => {
        useStickyCard.mockReturnValue(true);

        const props = { ...PROPS, stickyOnScroll: false, fixtureURN: "BasketballFixtureURN" };
        render(<FixtureHeader {...props} />);

        expect(ConnectedEventHeader).toHaveBeenCalledWith(
          expect.objectContaining({ showTertiaryTitle: true }),
          undefined,
        );
      });
    });
  });

  describe("when there is a cardURN", () => {
    it("should call useStickyCard with it", () => {
      const props = { ...PROPS, cardURN: "card:urn" };
      render(<FixtureHeader {...props} />);

      expect(useStickyCard).toHaveBeenCalledWith("card:urn");
    });
  });

  describe("when fixtureURN is undefined", () => {
    it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
      render(<FixtureHeader {...PROPS} />);

      expect(PROPS.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const props = { ...PROPS, dispatchUnsubscribeFixtureUpdates: jest.fn() };
      const { unmount } = render(<FixtureHeader {...props} />);

      act(() => {
        unmount();
      });

      expect(props.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    describe("and the view mode is DEFAULT", () => {
      it("must render with an ConnectedEventHeader component with the expected props", () => {
        render(<FixtureHeader {...BASE_PROPS} />);

        expect(ConnectedFootballFixture).not.toHaveBeenCalled();
        expect(ConnectedTennisFixture).not.toHaveBeenCalled();

        expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
        expect(ConnectedEventHeader).toHaveBeenCalledWith(EXPECTED_BASE_PROPS, undefined);
      });
    });

    describe("and the viewMode is COUPON", () => {
      it("must render with an ConnectedEventHeader component with the expected props", () => {
        const props = { ...BASE_PROPS, viewMode: ScoreboardViewMode.COUPON };
        render(<FixtureHeader {...props} />);

        expect(ConnectedFootballFixture).not.toHaveBeenCalled();
        expect(ConnectedTennisFixture).not.toHaveBeenCalled();

        expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
        expect(ConnectedEventHeader).toHaveBeenCalledWith(
          {
            ...EXPECTED_BASE_PROPS,
            viewMode: ScoreboardViewMode.COUPON,
          },
          undefined,
        );
      });
    });
  });

  describe("when typename is", () => {
    describe("not supported", () => {
      describe("and there is fixtureURN", () => {
        it("must render with an ConnectedEventHeader component", () => {
          const props = { ...BASE_PROPS, fixtureURN: "BaseFixtureURN" };
          render(<FixtureHeader {...props} />);

          expect(ConnectedFootballFixture).not.toHaveBeenCalled();
          expect(ConnectedTennisFixture).not.toHaveBeenCalled();
          expect(ConnectedBaseballFixture).not.toHaveBeenCalled();
          expect(ConnectedBasketballFixture).not.toHaveBeenCalled();
          expect(ConnectedCricketFixture).not.toHaveBeenCalled();
          expect(ConnectedIceHockeyFixture).not.toHaveBeenCalled();
          expect(ConnectedRugbyUnionFixture).not.toHaveBeenCalled();
          expect(ConnectedRugbyLeagueFixture).not.toHaveBeenCalled();
          expect(ConnectedSnookerFixture).not.toHaveBeenCalled();
          expect(ConnectedDartsFixture).not.toHaveBeenCalled();

          expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
          expect(ConnectedEventHeader).toHaveBeenCalledWith(EXPECTED_BASE_PROPS, undefined);
        });
      });

      describe("and there is no fixtureURN", () => {
        it("must render with a connected EventHeader component", () => {
          render(<FixtureHeader {...BASE_PROPS} />);

          expect(ConnectedFootballFixture).not.toHaveBeenCalled();
          expect(ConnectedTennisFixture).not.toHaveBeenCalled();
          expect(ConnectedBaseballFixture).not.toHaveBeenCalled();
          expect(ConnectedBasketballFixture).not.toHaveBeenCalled();
          expect(ConnectedCricketFixture).not.toHaveBeenCalled();
          expect(ConnectedIceHockeyFixture).not.toHaveBeenCalled();
          expect(ConnectedRugbyUnionFixture).not.toHaveBeenCalled();
          expect(ConnectedRugbyLeagueFixture).not.toHaveBeenCalled();
          expect(ConnectedSnookerFixture).not.toHaveBeenCalled();
          expect(ConnectedDartsFixture).not.toHaveBeenCalled();

          expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
          expect(ConnectedEventHeader).toHaveBeenCalledWith(EXPECTED_BASE_PROPS, undefined);
        });
      });
    });

    describe.each([
      ["FootballFixture", ConnectedFootballFixture, FOOTBALL_PROPS, EXPECTED_FOOTBALL_PROPS],
      ["TennisMatch", ConnectedTennisFixture, TENNIS_PROPS, EXPECTED_TENNIS_PROPS],
      ["BasketballFixture", ConnectedBasketballFixture, BASKETBALL_PROPS, EXPECTED_BASKETBALL_PROPS],
      ["CricketFixture", ConnectedCricketFixture, CRICKET_PROPS, EXPECTED_CRICKET_PROPS],
      ["TableTennisFixture", ConnectedTableTennisFixture, TABLE_TENNIS_PROPS, EXPECTED_TABLE_TENNIS_PROPS],
      ["IceHockeyFixture", ConnectedIceHockeyFixture, ICE_HOCKEY_PROPS, EXPECTED_ICE_HOCKEY_PROPS],
      ["RugbyUnionFixture", ConnectedRugbyUnionFixture, RUGBY_UNION_PROPS, EXPECTED_RUGBY_UNION_PROPS],
      ["RugbyLeagueFixture", ConnectedRugbyLeagueFixture, RUGBY_LEAGUE_PROPS, EXPECTED_RUGBY_LEAGUE_PROPS],
      ["SnookerFixture", ConnectedSnookerFixture, SNOOKER_PROPS, EXPECTED_SNOOKER_PROPS],
      ["BaseballFixture", ConnectedBaseballFixture, BASEBALL_PROPS, EXPECTED_BASEBALL_PROPS],
      ["DartsFixture", ConnectedDartsFixture, DARTS_PROPS, EXPECTED_DARTS_PROPS],
    ])("%s", (typename, connectedComponent, props, expectedProps) => {
      it(`must render with a ${typename} component`, () => {
        render(<FixtureHeader {...props} />);

        expect(connectedComponent).toHaveBeenCalledWith(expectedProps, undefined);
      });

      it("should not call dispatchSubscribeFixtureUpdates on mount when isFocused is false", () => {
        useIsFocused.mockImplementationOnce(() => false);
        render(<FixtureHeader {...props} />);

        expect(props.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
      });

      it("should call dispatchSubscribeFixtureUpdates on mount", () => {
        render(<FixtureHeader {...props} />);

        expect(props.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(props.fixtureURN, typename, props.viewMode);
      });

      it("should call dispatchUnsubscribeFixtureUpdates on unmount", () => {
        const { unmount } = render(<FixtureHeader {...props} />);

        act(() => {
          unmount();
        });

        expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(props.fixtureURN, typename);
      });

      describe("when videoAvailable is false", () => {
        it(`must render with a ${typename} component`, () => {
          const componentProps = { ...props, videoAvailable: false };
          render(<FixtureHeader {...componentProps} />);

          expect(connectedComponent).toHaveBeenCalledWith(
            { ...expectedProps, ...(typename !== "FootballFixture" && { videoAvailable: false }) },
            undefined,
          );
        });
      });

      describe("when is intersecting", () => {
        it(`must render ${typename} with SMALL view mode`, () => {
          jest.spyOn(Math, "round").mockReturnValue(0);

          const componentProps = { ...props, stickyOnScroll: true };
          render(<FixtureHeader {...componentProps} />);

          expect(connectedComponent.mock.calls.length).toEqual(1);
          expect(connectedComponent.mock.calls[0][0].viewMode).toEqual(ScoreboardViewMode.SMALL);
        });
      });
    });
  });
});
