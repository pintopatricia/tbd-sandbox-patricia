import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-web";
import { MatchStatus, ScoreboardViewMode, TeamSide } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import CricketFixture from "./CricketFixture.web";

jest.mock("@ppb/the-wall-web", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard data-testid="avb-scoreboard" />),
  AvBFixture: jest.fn(({ children }) => (
    <fixture-component-mock data-testid="avb-fixture">{children}</fixture-component-mock>
  )),
}));

jest.mock("./CricketFixture.helper", () => ({
  isCricketFixtureEqual: jest.fn(() => false),
  formatCouponViewScoreData: jest.fn(() => "formattedScoreData"),
}));

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

const COMPETITION_NAME = "ONE DAY INTERNATIONALS";
const DATE = "Today";
const MATCH_STATUS = MatchStatus.IN_PLAY;
const DATE_TIME = new Date("2022-06-11 21:00:00");
const CRICKET_SCORE_DATA = {
  scoreData: SCORE_DATA,
};
const SHOW_BOTTOM_BAR_SEPARATOR = false;
const TEAM_A = { name: "Team A" };
const TEAM_B = { name: "Team B" };
const TEAM_SERVING = TeamSide.HOME;
const TIME = "21:00";

const CRICKET_FIXTURE_PROPS = {
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  matchStatus: MATCH_STATUS,
  cricketScoreData: CRICKET_SCORE_DATA,
  showBottomSeparator: SHOW_BOTTOM_BAR_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  teamA: TEAM_A,
  teamB: TEAM_B,
  teamServing: TEAM_SERVING,
  time: TIME,
  videoAvailable: true,
  labels: {
    inplay: "inplayz",
  },
};

function renderCricketFixture(cricketFixtureProps) {
  return render(<CricketFixture {...cricketFixtureProps} />);
}

describe("CricketFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when viewMode is not defined", () => {
    it("should render an AvBFixture and Scoreboard with default viewMode and correct scoreData", () => {
      renderCricketFixture({ ...CRICKET_FIXTURE_PROPS, viewMode: undefined });

      expect(AvBFixture).toHaveBeenCalledWith(
        {
          icon: SportsIconName.CRICKET,
          competitionLabel: COMPETITION_NAME,
          viewMode: ScoreboardViewMode.DEFAULT,
          showBottomSeparator: SHOW_BOTTOM_BAR_SEPARATOR,
          children: expect.any(Object),
        },
        undefined,
      );
      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.DEFAULT,
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
  });

  describe("when cricketScoreData is not defined", () => {
    it("should call AvBScoreboard with scoreData as undefined", () => {
      renderCricketFixture({ ...CRICKET_FIXTURE_PROPS, cricketScoreData: undefined });

      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.DEFAULT,
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

  describe("when viewMode is defined and not COUPON", () => {
    it("should render an AvBFixture and Scoreboard with the received viewMode and correct scoreData", () => {
      renderCricketFixture({ ...CRICKET_FIXTURE_PROPS, viewMode: ScoreboardViewMode.SMALL });

      expect(AvBFixture).toHaveBeenCalledWith(
        {
          icon: SportsIconName.CRICKET,
          competitionLabel: COMPETITION_NAME,
          viewMode: ScoreboardViewMode.SMALL,
          showBottomSeparator: SHOW_BOTTOM_BAR_SEPARATOR,
          children: expect.any(Object),
        },
        undefined,
      );
      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.SMALL,
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
  });

  describe("when viewMode is COUPON", () => {
    it("should render an AvBFixture and Scoreboard with the received viewMode and formatted scoreData", () => {
      renderCricketFixture({ ...CRICKET_FIXTURE_PROPS, viewMode: ScoreboardViewMode.COUPON });

      expect(AvBFixture).toHaveBeenCalledWith(
        {
          icon: undefined,
          competitionLabel: undefined,
          viewMode: ScoreboardViewMode.COUPON,
          showBottomSeparator: false,
          children: expect.any(Object),
        },
        undefined,
      );
      expect(AvBScoreboard).toHaveBeenCalledWith(
        {
          teamA: TEAM_A,
          teamB: TEAM_B,
          matchStatus: MATCH_STATUS,
          viewMode: ScoreboardViewMode.COUPON,
          scoreData: "formattedScoreData",
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
});
