import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScoreboardViewMode, TennisStatus } from "@ppb/the-wall-common/types";
import { AvBFixture as TennisFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { TEST_ID as TENNIS_FIXTURE } from "./TennisFixture.web.selectors";
import TennisFixture from "./TennisFixture.web";

jest.mock("@ppb/the-wall-web", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard />),
  AvBFixture: jest.fn(({ children }) => <fixture-component-mock>{children}</fixture-component-mock>),
}));

const COMPETITION_NAME = "competition";
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
  status: TennisStatus.PRE_MATCH,
  statusReason: "reason",
  surface: "surface",
  viewMode: ScoreboardViewMode.SMALL,
  showBottomSeparator: true,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  teamA: TEAM_A,
  teamB: TEAM_B,
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  matchStatus: "IN_PLAY",
  scoreData: SCORE_DATA,
  teamServing: "HOME",
  time: "21:00",
  icon: "Tennis",
  sporteventURN: "sportEvent",
  urn: "ppb:fixture:111222",
  notificationsSubscription: false,
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

  let component;

  it("must render a tennis fixture component with scoreboard", () => {
    renderTennisFixture({ ...TENNIS_FIXTURE_PROPS, viewMode: "COUPON" });

    expect(TennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: "COUPON",
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: "COUPON",
        scoreData: SCORE_DATA,
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a tennis fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderTennisFixture({
      ...TENNIS_FIXTURE_PROPS,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(TENNIS_FIXTURE)).toBeVisible();
    expect(TennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "Tennis",
        competitionLabel: COMPETITION_NAME,
        viewMode: "DEFAULT",
        showBottomSeparator: true,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        teamA: TEAM_A,
        teamB: TEAM_B,
        interrupted: undefined,
        matchStatus: "TENNIS_PRE_MATCH",
        surface: "surface",
        viewMode: "DEFAULT",
        teamServing: "HOME",
        scoreData: SCORE_DATA,
        date: DATE,
        dateTime: DATE_TIME,
        time: "21:00",
        liveVideo: true,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a tennis fixture component and scoreboard with default view mode when no view mode is passed as prop and videoAvailable is false", () => {
    component = renderTennisFixture({
      ...TENNIS_FIXTURE_PROPS,
      viewMode: undefined,
      showBottomSeparator: true,
      videoAvailable: false,
    }).container;

    expect(component.querySelector(TENNIS_FIXTURE)).toBeVisible();
    expect(TennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "Tennis",
        competitionLabel: COMPETITION_NAME,
        viewMode: "DEFAULT",
        showBottomSeparator: true,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        teamA: TEAM_A,
        teamB: TEAM_B,
        interrupted: undefined,
        matchStatus: "TENNIS_PRE_MATCH",
        surface: "surface",
        viewMode: "DEFAULT",
        teamServing: "HOME",
        scoreData: SCORE_DATA,
        date: DATE,
        dateTime: DATE_TIME,
        time: "21:00",
        liveVideo: false,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });
});
