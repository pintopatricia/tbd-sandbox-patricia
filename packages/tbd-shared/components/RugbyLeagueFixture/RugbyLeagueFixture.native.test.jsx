import { render } from "@testing-library/react-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-native";
import { ScoreStyle } from "@ppb/tbd-store/state/constants";
import RugbyLeagueFixture from "./RugbyLeagueFixture.native";

jest.mock("@ppb/the-wall-native", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard-mock testID="scoreboard" />),
  AvBFixture: jest.fn(({ children }) => <avb-fixture-mock testID="fixture">{children}</avb-fixture-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SportsIconName: { RUGBY_LEAGUE: "RugbyLeagueIcon" },
  SystemIconName: { NOTIFICATION_OFF: "NOTIFICATION_OFF" },
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
}));

function renderRugbyLeagueFixture(rugbyLeagueFixtureProps) {
  return render(<RugbyLeagueFixture {...rugbyLeagueFixtureProps} />);
}

const COMPETITION_NAME = "Super League";
const DATE = "tomorrow";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const ICON = "icon";
const NOTIFICATIONS_SUBSCRIPTION = false;
const SCORE_DATA = [
  {
    home: 1,
    away: 2,
    style: "BORDER",
  },
  {
    home: 3,
    away: 4,
    style: "GREY_BACKGROUND",
  },
];
const SHOW_BOTTOM_SEPARATOR = "bottomSeparator";
const TEAM_A = { name: "Team A" };
const TEAM_B = { name: "Team B" };
const TIME = "21:00";
const VIEW_MODE = ScoreboardViewMode.SMALL;
const MATCH_STATUS = "IN_PLAY";

const rugbyLeagueFixtureProps = {
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  matchStatus: MATCH_STATUS,
  icon: ICON,
  notificationsSubscription: NOTIFICATIONS_SUBSCRIPTION,
  scoreData: SCORE_DATA,
  showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: true,
  teamA: TEAM_A,
  teamB: TEAM_B,
  time: TIME,
  viewMode: VIEW_MODE,
  videoAvailable: true,
  labels: { inplay: "inplayz" },
};

describe("RugbyLeagueFixture", () => {
  beforeEach(jest.clearAllMocks);
  let container;

  describe("when viewMode is COUPON", () => {
    beforeEach(() => {
      container = renderRugbyLeagueFixture({
        ...rugbyLeagueFixtureProps,
        viewMode: ScoreboardViewMode.COUPON,
      });
    });

    it("should render AvBFixture and AvBScoreboard components", () => {
      const { queryByTestId } = container;
      const fixture = queryByTestId("fixture");
      const scoreboard = queryByTestId("scoreboard");
      expect(fixture).not.toBeNull();
      expect(scoreboard).not.toBeNull();
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          competitionLabel: undefined,
          notificationsSubscription: undefined,
          viewMode: ScoreboardViewMode.COUPON,
        }),
        undefined,
      );
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: [SCORE_DATA[0]],
          showEventDateBelow: rugbyLeagueFixtureProps.showEventDateBelow,
          showHorizontalDuration: rugbyLeagueFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is SMALL", () => {
    beforeEach(() => {
      container = renderRugbyLeagueFixture({
        ...rugbyLeagueFixtureProps,
        viewMode: ScoreboardViewMode.SMALL,
      });
    });

    it("should render AvBFixture and AvBScoreboard components", () => {
      const { queryByTestId } = container;
      const fixture = queryByTestId("fixture");
      const scoreboard = queryByTestId("scoreboard");
      expect(fixture).not.toBeNull();
      expect(scoreboard).not.toBeNull();
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "icon",
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          competitionLabel: COMPETITION_NAME,
          notificationsSubscription: undefined,
          viewMode: ScoreboardViewMode.SMALL,
        }),
        undefined,
      );
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: [SCORE_DATA[0]],
          showEventDateBelow: rugbyLeagueFixtureProps.showEventDateBelow,
          showHorizontalDuration: rugbyLeagueFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is DEFAULT", () => {
    beforeEach(() => {
      container = renderRugbyLeagueFixture({
        ...rugbyLeagueFixtureProps,
        viewMode: ScoreboardViewMode.DEFAULT,
      });
    });

    it("should render AvBFixture and AvBScoreboard components", () => {
      const { queryByTestId } = container;
      const fixture = queryByTestId("fixture");
      const scoreboard = queryByTestId("scoreboard");
      expect(fixture).not.toBeNull();
      expect(scoreboard).not.toBeNull();
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "icon",
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          competitionLabel: COMPETITION_NAME,
          viewMode: ScoreboardViewMode.DEFAULT,
        }),
        undefined,
      );
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: [SCORE_DATA[0]],
          showEventDateBelow: rugbyLeagueFixtureProps.showEventDateBelow,
          showHorizontalDuration: rugbyLeagueFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });

    describe("when there is a notificationSubscriptionIcon", () => {
      beforeEach(() => {
        container = renderRugbyLeagueFixture({
          ...rugbyLeagueFixtureProps,
          notificationsSubscription: true,
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should call AvBFixture with correct arguments", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationsSubscription: expect.anything(),
          }),
          undefined,
        );
      });
    });

    describe("when there is no notificationSubscriptionIcon", () => {
      beforeEach(() => {
        container = renderRugbyLeagueFixture({
          ...rugbyLeagueFixtureProps,
          notificationsSubscription: undefined,
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should call AvBFixture with correct arguments", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationsSubscription: undefined,
          }),
          undefined,
        );
      });
    });

    describe("when scoreData has mixed styles", () => {
      beforeEach(() => {
        container = renderRugbyLeagueFixture({
          ...rugbyLeagueFixtureProps,
          scoreData: [
            { home: 10, away: 11, style: ScoreStyle.FINISHED },
            { home: 12, away: 13, style: ScoreStyle.IN_PLAY },
            { home: 14, away: 15, style: ScoreStyle.DEFAULT },
            { home: 16, away: 17, style: ScoreStyle.PAUSED },
          ],
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should pass only first score item to AvBScoreboard", () => {
        expect(AvBScoreboard).toHaveBeenCalledWith(
          expect.objectContaining({
            scoreData: [{ home: 10, away: 11, style: ScoreStyle.FINISHED }],
          }),
          undefined,
        );
      });
    });
  });

  describe("when viewMode is undefined", () => {
    beforeEach(() => {
      container = renderRugbyLeagueFixture({
        ...rugbyLeagueFixtureProps,
        viewMode: undefined,
      });
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ScoreboardViewMode.DEFAULT,
        }),
        undefined,
      );
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ScoreboardViewMode.DEFAULT,
          showEventDateBelow: rugbyLeagueFixtureProps.showEventDateBelow,
        }),
        undefined,
      );
    });
  });

  describe("when icon is undefined", () => {
    beforeEach(() => {
      container = renderRugbyLeagueFixture({ ...rugbyLeagueFixtureProps, icon: undefined });
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "RugbyLeagueIcon",
        }),
        undefined,
      );
    });
  });
});
