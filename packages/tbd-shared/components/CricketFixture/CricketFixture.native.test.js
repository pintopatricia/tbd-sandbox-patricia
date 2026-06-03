import { render } from "@testing-library/react-native";
import { MatchStatus, ScoreboardViewMode, TeamSide } from "@ppb/the-wall-common/types";
import { AvBFixture as AvBFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import CricketFixture from "./CricketFixture.native";
import { formatCouponViewScoreData } from "./CricketFixture.helper";

jest.mock("@ppb/the-wall-native", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard-mock />),
  AvBFixture: jest.fn(({ children }) => <avb-fixture-mock>{children}</avb-fixture-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SportsIconName: { CRICKET: "CRICKET" },
  SystemIconName: { NOTIFICATION_OFF: "NOTIFICATION_OFF" },
}));

const FORMATTED_SCORE_DATA = "formattedScoreData";
jest.mock("./CricketFixture.helper", () => ({
  formatCouponViewScoreData: jest.fn(() => FORMATTED_SCORE_DATA),
}));

function renderCricketFixture(cricketFixtureProps) {
  return render(<CricketFixture {...cricketFixtureProps} />);
}

const COMPETITION_NAME = "NBA";
const DATE = "tomorrow";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const ICON = "icon";
const MATCH_STATUS = MatchStatus.IN_PLAY;
const NOTIFICATIONS_SUBSCRIPTION = true;
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
const CRICKET_SCORE_DATA = {
  scoreData: SCORE_DATA,
};
const SHOW_BOTTOM_SEPARATOR = "bottomSeparator";
const TEAM_A = { name: "Team A" };
const TEAM_B = { name: "Team B" };
const TEAM_SERVING = TeamSide.HOME;
const TIME = "21:00";
const VIEW_MODE = ScoreboardViewMode.SMALL;

const cricketFixtureProps = {
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  event: "event",
  icon: ICON,
  matchStatus: MATCH_STATUS,
  cricketScoreData: CRICKET_SCORE_DATA,
  showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  teamA: TEAM_A,
  teamB: TEAM_B,
  teamServing: TEAM_SERVING,
  time: TIME,
  viewMode: VIEW_MODE,
  notificationsSubscription: NOTIFICATIONS_SUBSCRIPTION,
  videoAvailable: true,
  labels: { inplay: "inplayz" },
};

describe("CricketFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should render avb fixture component and scoreboard with correct props", () => {
    renderCricketFixture(cricketFixtureProps);

    expect(AvBFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: ICON,
        competitionLabel: COMPETITION_NAME,
        viewMode: VIEW_MODE,
        showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
        notificationsSubscription: undefined,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      {
        teamA: TEAM_A,
        teamB: TEAM_B,
        eventName: "event",
        matchStatus: MATCH_STATUS,
        viewMode: VIEW_MODE,
        scoreData: SCORE_DATA,
        date: DATE,
        dateTime: DATE_TIME,
        teamServing: TEAM_SERVING,
        time: TIME,
        liveVideo: true,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      },
      undefined,
    );
  });

  describe("when cricketScoreData is not defined", () => {
    it("should call AvBScoreboard with scoreData as undefined", () => {
      renderCricketFixture({ ...cricketFixtureProps, cricketScoreData: undefined });

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          eventName: "event",
          viewMode: ScoreboardViewMode.SMALL,
          scoreData: undefined,
          date: DATE,
          dateTime: DATE_TIME,
          teamServing: TEAM_SERVING,
          time: TIME,
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when viewMode is COUPON", () => {
    describe("when cricketScoreData is not defined", () => {
      it("should call AvBScoreboard with scoreData as undefined", () => {
        renderCricketFixture({
          ...cricketFixtureProps,
          viewMode: ScoreboardViewMode.COUPON,
          cricketScoreData: undefined,
        });

        expect(AvBScoreboard).toHaveBeenCalledWith(expect.objectContaining({ scoreData: undefined }), undefined);
        expect(formatCouponViewScoreData).not.toHaveBeenCalled();
      });
    });

    it("when cricketScoreData is defined, it should call formatCouponViewScoreData helper with correct arguments", () => {
      renderCricketFixture({ ...cricketFixtureProps, viewMode: ScoreboardViewMode.COUPON });

      expect(formatCouponViewScoreData).toHaveBeenCalledWith(CRICKET_SCORE_DATA, MATCH_STATUS);
    });

    it("should render avb scoreboard with the formatted scoreData", () => {
      renderCricketFixture({ ...cricketFixtureProps, viewMode: ScoreboardViewMode.COUPON });

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.COUPON,
          scoreData: FORMATTED_SCORE_DATA,
          eventName: "event",
          date: DATE,
          dateTime: DATE_TIME,
          teamServing: TEAM_SERVING,
          time: TIME,
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when viewMode is undefined", () => {
    it("should render avb fixture component and scoreboard with DEFAULT view mode", () => {
      renderCricketFixture({ ...cricketFixtureProps, viewMode: undefined });

      expect(AvBFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ScoreboardViewMode.DEFAULT,
        }),
        undefined,
      );
      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.DEFAULT,
          scoreData: SCORE_DATA,
          eventName: "event",
          date: DATE,
          dateTime: DATE_TIME,
          teamServing: TEAM_SERVING,
          time: TIME,
          liveVideo: true,
          inplayLabel: "inplayz",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when icon is undefined", () => {
    it("should render avb fixture component with CRICKET icon", () => {
      renderCricketFixture({ ...cricketFixtureProps, icon: undefined });

      expect(AvBFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "CRICKET",
        }),
        undefined,
      );
    });
  });
});
