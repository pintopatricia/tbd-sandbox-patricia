import { render } from "@testing-library/react-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-native";
import IceHockeyFixture from "./IceHockeyFixture.native";
import { getStatusLabel } from "./IceHockeyFixture.helper";

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
  SportsIconName: { ICE_HOCKEY: "IceHockeyIcon" },
  SystemIconName: { NOTIFICATION_OFF: "NOTIFICATION_OFF" },
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
}));

const STATUS_LABEL = "statusLabel";

jest.mock("./IceHockeyFixture.helper", () => ({
  getStatusLabel: jest.fn(() => STATUS_LABEL),
}));

function renderIceHockeyFixture(iceHockeyFixtureProps) {
  return render(<IceHockeyFixture {...iceHockeyFixtureProps} />);
}

const CLOCK = {
  period: "PERIOD_1",
};
const COMPETITION_NAME = "NHL";
const DATE = "tomorrow";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const ICON = "icon";
const MATCH_STATUS = "IN_PLAY";
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

const iceHockeyFixtureProps = {
  clock: CLOCK,
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  icon: ICON,
  matchStatus: MATCH_STATUS,
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

describe("iceHockeyFixture", () => {
  beforeEach(jest.clearAllMocks);
  let container;

  describe("status label", () => {
    it("should call getStatusLabel helper with correct arguments", () => {
      renderIceHockeyFixture({ ...iceHockeyFixtureProps, clock: "clock", viewMode: "viewMode" });

      expect(getStatusLabel).toHaveBeenCalledWith("clock", "viewMode");
    });
  });

  describe("when viewMode is COUPON", () => {
    beforeEach(() => {
      container = renderIceHockeyFixture({
        ...iceHockeyFixtureProps,
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
          showEventDateBelow: iceHockeyFixtureProps.showEventDateBelow,
          showHorizontalDuration: iceHockeyFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is SMALL", () => {
    beforeEach(() => {
      container = renderIceHockeyFixture({
        ...iceHockeyFixtureProps,
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
          scoreData: SCORE_DATA,
          showEventDateBelow: iceHockeyFixtureProps.showEventDateBelow,
          showHorizontalDuration: iceHockeyFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is DEFAULT", () => {
    beforeEach(() => {
      container = renderIceHockeyFixture({
        ...iceHockeyFixtureProps,
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
          scoreData: SCORE_DATA,
          showEventDateBelow: iceHockeyFixtureProps.showEventDateBelow,
          showHorizontalDuration: iceHockeyFixtureProps.showHorizontalDuration,
        }),
        undefined,
      );
    });

    describe("when there is a notificationSubscriptionIcon", () => {
      beforeEach(() => {
        container = renderIceHockeyFixture({
          ...iceHockeyFixtureProps,
          notificationsSubscription: true,
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should call AvBFixture with correct arguments", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationsSubscription: expect.anything(), // ie not undefined
          }),
          undefined,
        );
      });
    });

    describe("when there is no notificationSubscriptionIcon", () => {
      beforeEach(() => {
        container = renderIceHockeyFixture({
          ...iceHockeyFixtureProps,
          notificationsSubscription: undefined,
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should call AvBFixture with correct arguments", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationsSubscription: undefined, // ie not undefined
          }),
          undefined,
        );
      });
    });
  });

  describe("when viewMode is undefined", () => {
    beforeEach(() => {
      container = renderIceHockeyFixture({
        ...iceHockeyFixtureProps,
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
          showEventDateBelow: iceHockeyFixtureProps.showEventDateBelow,
        }),
        undefined,
      );
    });
  });

  describe("when icon is undefined", () => {
    beforeEach(() => {
      container = renderIceHockeyFixture({ ...iceHockeyFixtureProps, icon: undefined });
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "IceHockeyIcon",
        }),
        undefined,
      );
    });
  });
});
