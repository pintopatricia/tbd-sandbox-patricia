import { forwardRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { AvBFixture as RugbyLeagueFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";

import { TEST_ID as RUGBY_LEAGUE_FIXTURE } from "./RugbyLeagueFixture.web.selectors";
import RugbyLeagueFixture from "./RugbyLeagueFixture.web";
import { ScoreStyle } from "@ppb/tbd-store/state/constants";

jest.mock("@ppb/the-wall-web", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard />),
  AvBFixture: jest.fn(({ children }) => <fixture-component-mock>{children}</fixture-component-mock>),
  Container: forwardRef(
    jest.fn(({ children }, ref) => (
      <div data-testid="fixture-container" ref={ref}>
        {children}
      </div>
    )),
  ),
  Card: jest.fn(({ children }) => <card-mock data-testid="card">{children}</card-mock>),
}));

jest.mock("./RugbyLeagueFixture.helper", () => ({
  isRugbyLeagueFixtureEqual: jest.fn(() => false),
}));

function renderRugbyLeagueFixture(rugbyLeagueFixtureProps) {
  return render(<RugbyLeagueFixture {...rugbyLeagueFixtureProps} />);
}

describe("RugbyLeagueFixture", () => {
  beforeEach(jest.clearAllMocks);

  const COMPETITION_NAME = "Super League";
  const DATE = "tomorrow";
  const DATE_TIME = new Date("2022-06-11 21:00:00");
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
  const DEFAULT_VIEW_MODE = "DEFAULT";
  const SHOW_BOTTOM_BAR_SEPARATOR = false;
  const SPORT_EVENT_URN = "123456789";
  const TEAM_A = { name: "Team A" };
  const TEAM_B = { name: "Team B" };
  const TIME = "21:00";
  const MATCH_STATUS = "IN_PLAY";

  const rugbyLeagueFixtureProps = {
    competition: COMPETITION_NAME,
    date: DATE,
    dateTime: DATE_TIME,
    matchStatus: MATCH_STATUS,
    scoreData: SCORE_DATA,
    showBottomSeparator: SHOW_BOTTOM_BAR_SEPARATOR,
    showEventDateBelow: true,
    showHorizontalDuration: false,
    sporteventURN: SPORT_EVENT_URN,
    teamA: TEAM_A,
    teamB: TEAM_B,
    time: TIME,
    videoAvailable: true,
    labels: { inplay: "inplayz" },
  };

  let component;

  it("must render with a rugbyLeague fixture component and scoreboard", () => {
    component = renderRugbyLeagueFixture(rugbyLeagueFixtureProps).container;

    expect(component.querySelector(RUGBY_LEAGUE_FIXTURE)).toBeVisible();
  });

  it("must render a rugbyLeague fixture component and scoreboard with current score when viewMode is COUPON", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderRugbyLeagueFixture({ ...rugbyLeagueFixtureProps, viewMode: COUPON_VIEW_MODE });

    expect(RugbyLeagueFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        matchStatus: MATCH_STATUS,
        viewMode: COUPON_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a rugbyLeague fixture component and scoreboard with current score when viewMode is COUPON and liveVideo is false", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderRugbyLeagueFixture({ ...rugbyLeagueFixtureProps, viewMode: COUPON_VIEW_MODE, videoAvailable: false });

    expect(RugbyLeagueFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        matchStatus: MATCH_STATUS,
        viewMode: COUPON_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        liveVideo: false,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a rugbyLeague fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderRugbyLeagueFixture({
      ...rugbyLeagueFixtureProps,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(RUGBY_LEAGUE_FIXTURE)).toBeVisible();
    expect(RugbyLeagueFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: SportsIconName.RUGBY_LEAGUE,
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
        viewMode: DEFAULT_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        date: DATE,
        matchStatus: MATCH_STATUS,
        dateTime: DATE_TIME,
        time: TIME,
        liveVideo: true,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render only first score item when viewMode is not COUPON", () => {
    const filteredScoreData = [
      { home: 10, away: 11, style: ScoreStyle.FINISHED },
      { home: 12, away: 13, style: ScoreStyle.IN_PLAY },
      { home: 14, away: 15, style: ScoreStyle.DEFAULT },
      { home: 16, away: 17, style: ScoreStyle.PAUSED },
    ];

    renderRugbyLeagueFixture({ ...rugbyLeagueFixtureProps, scoreData: filteredScoreData, viewMode: DEFAULT_VIEW_MODE });

    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: DEFAULT_VIEW_MODE,
        scoreData: [{ home: 10, away: 11, style: ScoreStyle.FINISHED }],
      }),
      undefined,
    );
  });

  it("must render a rugbyLeague fixture component and scoreboard with correct view mode when passed", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderRugbyLeagueFixture({ ...rugbyLeagueFixtureProps, viewMode: CUSTOM_VIEW_MODE });

    expect(RugbyLeagueFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        matchStatus: MATCH_STATUS,
        viewMode: CUSTOM_VIEW_MODE,
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });
});
