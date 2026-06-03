import { render } from "@testing-library/react-native";
import { ScoreboardViewMode, TennisStatus } from "@ppb/the-wall-common/types";
import { AvBFixture as TennisFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import TennisFixture from "./TennisFixture.native";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard-mock />),
  AvBFixture: jest.fn(({ children }) => <tennis-fixture-mock>{children}</tennis-fixture-mock>),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SportsIconName: { TENNIS: "TENNIS" },
  SystemIconName: { NOTIFICATION_OFF: "NOTIFICATION_OFF" },
}));

const COMPETITION_NAME = "competition";
const SHOW_BOTTOM_SEPARATOR = "showBottom";
const DATE = "tomorrow";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const TEAM_A = { name: "Team A" };
const TEAM_B = { name: "Team B" };
const SCORE_DATA = [
  {
    home: 1,
    away: 2,
    style: "GREY_BACKGROUND",
  },
  {
    home: 3,
    away: 4,
    style: "BORDER",
  },
  {
    home: 15,
    away: 30,
    style: "GREEN_BACKGROUND",
  },
];

const TENNIS_FIXTURE_PROPS = {
  event: "event",
  icon: "icon",
  interrupted: false,
  status: TennisStatus.PRE_MATCH,
  statusReason: "reason",
  surface: "surface",
  showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  teamA: TEAM_A,
  teamB: TEAM_B,
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  scoreData: SCORE_DATA,
  teamServing: "HOME",
  time: "21:00",
  notificationsSubscription: true,
  videoAvailable: true,
  labels: {
    inplay: "inplayz",
  },
};

function renderTennisFixture(tennisFixtureProps) {
  return render(<TennisFixture {...tennisFixtureProps} />);
}

describe("TennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when viewMode is COUPON", () => {
    it("should render tennis fixture component and scoreboard with correct props", () => {
      renderTennisFixture({
        ...TENNIS_FIXTURE_PROPS,
        viewMode: ScoreboardViewMode.COUPON,
      });

      expect(TennisFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
          competitionLabel: undefined,
          viewMode: ScoreboardViewMode.COUPON,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          notificationsSubscription: undefined,
        }),
        undefined,
      );

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          eventName: "event",
          teamA: TEAM_A,
          teamB: TEAM_B,
          viewMode: ScoreboardViewMode.COUPON,
          interrupted: false,
          matchStatus: TennisStatus.PRE_MATCH,
          matchStatusReason: "reason",
          surface: "surface",
          scoreData: SCORE_DATA,
          date: DATE,
          dateTime: DATE_TIME,
          time: "21:00",
          teamServing: "HOME",
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: TENNIS_FIXTURE_PROPS.showEventDateBelow,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when viewMode is SMALL", () => {
    it("should render tennis fixture component and scoreboard with correct props", () => {
      renderTennisFixture({
        ...TENNIS_FIXTURE_PROPS,
        viewMode: ScoreboardViewMode.SMALL,
      });

      expect(TennisFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "icon",
          competitionLabel: "competition",
          viewMode: ScoreboardViewMode.SMALL,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          notificationsSubscription: undefined,
        }),
        undefined,
      );

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          eventName: "event",
          teamA: TEAM_A,
          teamB: TEAM_B,
          viewMode: ScoreboardViewMode.SMALL,
          interrupted: false,
          matchStatus: TennisStatus.PRE_MATCH,
          matchStatusReason: "reason",
          surface: "surface",
          scoreData: SCORE_DATA,
          date: DATE,
          dateTime: DATE_TIME,
          time: "21:00",
          teamServing: "HOME",
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: TENNIS_FIXTURE_PROPS.showEventDateBelow,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when viewMode is DEFAULT", () => {
    it("should render tennis fixture component and scoreboard with correct props", () => {
      renderTennisFixture({
        ...TENNIS_FIXTURE_PROPS,
        viewMode: ScoreboardViewMode.DEFAULT,
      });

      expect(TennisFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "icon",
          competitionLabel: "competition",
          viewMode: ScoreboardViewMode.DEFAULT,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          notificationsSubscription: expect.any(Object),
        }),
        undefined,
      );

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          eventName: "event",
          teamA: TEAM_A,
          teamB: TEAM_B,
          viewMode: ScoreboardViewMode.DEFAULT,
          interrupted: false,
          matchStatus: TennisStatus.PRE_MATCH,
          matchStatusReason: "reason",
          surface: "surface",
          scoreData: SCORE_DATA,
          date: DATE,
          dateTime: DATE_TIME,
          time: "21:00",
          teamServing: "HOME",
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: TENNIS_FIXTURE_PROPS.showEventDateBelow,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when viewMode is DEFAULT and notification subscription false", () => {
    it("should render tennis fixture component and scoreboard with correct props", () => {
      renderTennisFixture({
        ...TENNIS_FIXTURE_PROPS,
        viewMode: ScoreboardViewMode.DEFAULT,
        notificationsSubscription: false,
      });

      expect(TennisFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "icon",
          competitionLabel: "competition",
          viewMode: ScoreboardViewMode.DEFAULT,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          notificationsSubscription: undefined,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode and icon are not defined", () => {
    it("should render tennis fixture component and scoreboard with correct props", () => {
      renderTennisFixture({ ...TENNIS_FIXTURE_PROPS, viewMode: undefined, icon: undefined });

      expect(TennisFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "TENNIS",
          competitionLabel: COMPETITION_NAME,
          viewMode: ScoreboardViewMode.DEFAULT,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          notificationsSubscription: expect.any(Object),
        }),
        undefined,
      );

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          eventName: "event",
          teamA: TEAM_A,
          teamB: TEAM_B,
          viewMode: ScoreboardViewMode.DEFAULT,
          interrupted: false,
          matchStatus: TennisStatus.PRE_MATCH,
          matchStatusReason: "reason",
          surface: "surface",
          scoreData: SCORE_DATA,
          date: DATE,
          dateTime: DATE_TIME,
          time: "21:00",
          teamServing: "HOME",
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: TENNIS_FIXTURE_PROPS.showEventDateBelow,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });
});
