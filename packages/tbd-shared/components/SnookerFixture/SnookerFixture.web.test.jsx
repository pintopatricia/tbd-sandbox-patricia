import { forwardRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { AvBFixture as SnookerFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";

import { TEST_ID as SNOOKER_FIXTURE } from "./SnookerFixture.web.selectors";
import SnookerFixture from "./SnookerFixture.web";

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

jest.mock("./SnookerFixture.helper", () => ({
  isSnookerFixtureEqual: jest.fn(() => false),
}));

function renderSnookerFixture(snookerFixtureProps) {
  return render(<SnookerFixture {...snookerFixtureProps} />);
}

describe("SnookerFixture", () => {
  beforeEach(jest.clearAllMocks);

  const COMPETITION_NAME = "Worlds Championship";
  const DATE = "tomorrow";
  const MATCH_STATUS = "IN_PLAY";
  const DATE_TIME = new Date("2022-06-11 21:00:00");
  const SCORE_DATA = [
    {
      home: 1,
      away: 2,
      style: "BORDER",
    },
  ];
  const DEFAULT_VIEW_MODE = "DEFAULT";
  const SHOW_BOTTOM_BAR_SEPARATOR = false;
  const SPORT_EVENT_URN = "123456789";
  const TEAM_A = { name: "Team A" };
  const TEAM_B = { name: "Team B" };
  const TIME = "21:00";

  const snookerFixtureProps = {
    clock: {
      period: "PERIOD_1",
    },
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

  it("must render with a Snooker fixture component and scoreboard", () => {
    component = renderSnookerFixture(snookerFixtureProps).container;

    expect(component.querySelector(SNOOKER_FIXTURE)).toBeVisible();
  });

  it("must render a Snooker fixture component and scoreboard with current score when viewMode is COUPON", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderSnookerFixture({ ...snookerFixtureProps, viewMode: COUPON_VIEW_MODE });

    expect(SnookerFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a Snooker fixture component and scoreboard with current score when viewMode is COUPON and liveVideo is false", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderSnookerFixture({ ...snookerFixtureProps, viewMode: COUPON_VIEW_MODE, videoAvailable: false });

    expect(SnookerFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        liveVideo: false,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a Snooker fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderSnookerFixture({
      ...snookerFixtureProps,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(SNOOKER_FIXTURE)).toBeVisible();
    expect(SnookerFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: SportsIconName.SNOOKER,
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
        scoreData: SCORE_DATA,
        date: DATE,
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

  it("must render a Snooker fixture component and scoreboard with correct view mode when passed", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderSnookerFixture({ ...snookerFixtureProps, viewMode: CUSTOM_VIEW_MODE });

    expect(SnookerFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });
});
