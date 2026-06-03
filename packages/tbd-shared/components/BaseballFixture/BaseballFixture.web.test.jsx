import { forwardRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { AvBFixture as BaseballFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";

import BaseballFixture from "./BaseballFixture.web";

const BASEBALL_FIXTURE_SELECTOR = '[data-testid="baseball-fixture"]';

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

jest.mock("./BaseballFixture.helper", () => ({
  getStatusLabel: jest.fn(() => "statusLabel"),
  isBaseballFixtureEqual: jest.fn(() => false),
  formatCouponScoreBoardData: jest.fn((data) => [data[0]]),
}));

jest.mock("./BaseballFixture.web.css", () => ({
  baseballFixture: "baseballFixture",
}));

function renderBaseballFixture(baseballFixtureProps) {
  return render(<BaseballFixture {...baseballFixtureProps} />);
}

describe("BaseballFixture", () => {
  beforeEach(jest.clearAllMocks);

  const COMPETITION_NAME = "MLB";
  const DATE = "tomorrow";
  const MATCH_STATUS = "IN_PLAY";
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

  const baseballFixtureProps = {
    clock: {
      period: "INNING_1",
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

  it("must render with a Baseball fixture component and scoreboard", () => {
    component = renderBaseballFixture(baseballFixtureProps).container;
    expect(component.querySelector(BASEBALL_FIXTURE_SELECTOR)).toBeVisible();
  });

  it("must render a Baseball fixture component and scoreboard with current score when viewMode is COUPON", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderBaseballFixture({ ...baseballFixtureProps, viewMode: COUPON_VIEW_MODE });

    expect(BaseballFixtureComponent).toHaveBeenCalledWith(
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

  it("must render a Baseball fixture component and scoreboard with current score when viewMode is COUPON and liveVideo is false", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderBaseballFixture({ ...baseballFixtureProps, viewMode: COUPON_VIEW_MODE, videoAvailable: false });

    expect(BaseballFixtureComponent).toHaveBeenCalledWith(
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

  it("must render a Baseball fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderBaseballFixture({
      ...baseballFixtureProps,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(BASEBALL_FIXTURE_SELECTOR)).toBeVisible();

    expect(BaseballFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: SportsIconName.BASEBALL,
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
        scoreData: [SCORE_DATA[0]],
        date: DATE,
        dateTime: DATE_TIME,
        statusLabel: "statusLabel",
        time: TIME,
        liveVideo: true,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a Baseball fixture component and scoreboard with correct view mode when passed", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderBaseballFixture({ ...baseballFixtureProps, viewMode: CUSTOM_VIEW_MODE });

    expect(BaseballFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: CUSTOM_VIEW_MODE,
        scoreData: [SCORE_DATA[0]],
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });
});
