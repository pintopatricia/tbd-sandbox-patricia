import { forwardRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { AvBFixture as RugbyUnionFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";

import { TEST_ID as RUGBY_UNION_FIXTURE } from "./RugbyUnionFixture.web.selectors";
import RugbyUnionFixture from "./RugbyUnionFixture.web";

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

jest.mock("./RugbyUnionFixture.helper", () => ({
  isRugbyUnionFixtureEqual: jest.fn(() => false),
  formatScoreBoardData: jest.fn((data) => [data[0]]),
}));

function renderRugbyUnionFixture(rugbyUnionFixtureProps) {
  return render(<RugbyUnionFixture {...rugbyUnionFixtureProps} />);
}

describe("RugbyUnionFixture", () => {
  beforeEach(jest.clearAllMocks);

  const COMPETITION_NAME = "European Champions Cup";
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
  const FIRST_SCORE_DATA = [SCORE_DATA[0]];
  const DEFAULT_VIEW_MODE = "DEFAULT";
  const SHOW_BOTTOM_BAR_SEPARATOR = false;
  const SPORT_EVENT_URN = "123456789";
  const TEAM_A = { name: "Team A" };
  const TEAM_B = { name: "Team B" };
  const TIME = "21:00";
  const MATCH_STATUS = "IN_PLAY";

  const rugbyUnionFixtureProps = {
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

  it("must render with a rugbyUnion fixture component and scoreboard", () => {
    component = renderRugbyUnionFixture(rugbyUnionFixtureProps).container;

    expect(component.querySelector(RUGBY_UNION_FIXTURE)).toBeVisible();
  });

  it("must render a rugbyUnion fixture component and scoreboard with current score when viewMode is COUPON", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderRugbyUnionFixture({ ...rugbyUnionFixtureProps, viewMode: COUPON_VIEW_MODE });

    expect(RugbyUnionFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        matchStatus: MATCH_STATUS,
        viewMode: COUPON_VIEW_MODE,
        scoreData: FIRST_SCORE_DATA,
        liveVideo: true,
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a rugbyUnion fixture component and scoreboard with current score when viewMode is COUPON and liveVideo is false", () => {
    const COUPON_VIEW_MODE = "COUPON";

    renderRugbyUnionFixture({ ...rugbyUnionFixtureProps, viewMode: COUPON_VIEW_MODE, videoAvailable: false });

    expect(RugbyUnionFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: COUPON_VIEW_MODE,
      }),
      undefined,
    );
    expect(AvBScoreboard).toHaveBeenCalledWith(
      expect.objectContaining({
        matchStatus: MATCH_STATUS,
        viewMode: COUPON_VIEW_MODE,
        scoreData: FIRST_SCORE_DATA,
        liveVideo: false,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  it("must render a rugbyUnion fixture component and scoreboard with default view mode when no view mode is passed as prop", () => {
    component = renderRugbyUnionFixture({
      ...rugbyUnionFixtureProps,
      viewMode: undefined,
      showBottomSeparator: true,
    }).container;

    expect(component.querySelector(RUGBY_UNION_FIXTURE)).toBeVisible();
    expect(RugbyUnionFixtureComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: SportsIconName.RUGBY_UNION,
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
        scoreData: FIRST_SCORE_DATA,
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

  it("must render a rugbyUnion fixture component and scoreboard with correct view mode when passed", () => {
    const CUSTOM_VIEW_MODE = "CUSTOM_VIEW_MODE";
    renderRugbyUnionFixture({ ...rugbyUnionFixtureProps, viewMode: CUSTOM_VIEW_MODE });

    expect(RugbyUnionFixtureComponent).toHaveBeenCalledWith(
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
