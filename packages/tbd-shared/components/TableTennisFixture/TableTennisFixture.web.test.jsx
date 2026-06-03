import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AvBFixture as TableTennisFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";

import { TEST_ID as TABLE_TENNIS_FIXTURE } from "./TableTennisFixture.web.selectors";

import TableTennisFixture from "./TableTennisFixture.web";

jest.mock("@ppb/the-wall-web", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard />),
  AvBFixture: jest.fn(({ children }) => <fixture-component-mock>{children}</fixture-component-mock>),
}));

jest.mock("./TableTennisFixture.helper", () => ({
  isEqualFixture: jest.fn(() => false),
  formatCouponScoreBoardData: jest.fn(() => "formatCouponScoreBoardData"),
}));

const COMPETITION_NAME = "TT Series Men";
const DATE = "tomorrow";
const MATCH_STATUS = "IN_PLAY";
const DATE_TIME = new Date("2022-06-11 21:00:00");
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
];
const CURRENT_SET = {
  currentServer: "HOME",
  number: 2,
  score: {
    away: 4,
    home: 3,
  },
};
const DEFAULT_VIEW_MODE = "DEFAULT";
const TEAM_A = { name: "Team A" };
const TEAM_B = { name: "Team B" };

const TABLE_TENNIS_FIXTURE_PROPS = {
  competition: COMPETITION_NAME,
  currentSet: CURRENT_SET,
  date: DATE,
  dateTime: DATE_TIME,
  matchStatus: "IN_PLAY",
  scoreData: SCORE_DATA,
  teamServing: "HOME",
  teamA: TEAM_A,
  teamB: TEAM_B,
  time: "21:00",
  icon: "Table-Tennis",
  showBottomSeparator: false,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  sporteventURN: "sportEvent",
  urn: "ppb:fixture:111222",
  viewMode: "COUPON",
  notificationsSubscription: false,
  videoAvailable: true,
  labels: {
    inplay: "inplayz",
  },
};

function renderTableTennisFixture(tableTennisFixtureProps) {
  return render(<TableTennisFixture {...tableTennisFixtureProps} />);
}

describe("TableTennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  let component;

  it("must render with a table tennis fixture component and scoreboard", () => {
    component = renderTableTennisFixture(TABLE_TENNIS_FIXTURE_PROPS).container;

    expect(component.querySelector(TABLE_TENNIS_FIXTURE)).toBeVisible();
  });

  it("must render a table tennis fixture component and scoreboard with current score when viewMode is COUPON", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderTableTennisFixture({ ...TABLE_TENNIS_FIXTURE_PROPS, viewMode: COUPON_VIEW_MODE });

    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
        scoreData: "formatCouponScoreBoardData",
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a table tennis fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderTableTennisFixture({
      ...TABLE_TENNIS_FIXTURE_PROPS,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(TABLE_TENNIS_FIXTURE)).toBeVisible();
    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "Table-Tennis",
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
        matchStatus: MATCH_STATUS,
        viewMode: DEFAULT_VIEW_MODE,
        scoreData: "formatCouponScoreBoardData",
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

  it("must render a table tennis fixture component and scoreboard with correct view mode when passed", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderTableTennisFixture({ ...TABLE_TENNIS_FIXTURE_PROPS, viewMode: CUSTOM_VIEW_MODE });

    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
        liveVideo: true,
      }),
      undefined,
    );
  });

  it("must render a table tennis fixture component and scoreboard with correct view mode when passed and videoAvailable is false", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderTableTennisFixture({ ...TABLE_TENNIS_FIXTURE_PROPS, viewMode: CUSTOM_VIEW_MODE, videoAvailable: false });

    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
        liveVideo: false,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });
});
