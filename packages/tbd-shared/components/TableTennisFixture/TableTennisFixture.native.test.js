import { render } from "@testing-library/react-native";
import { AvBFixture as TableTennisFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { SportsIconName } from "@ppb/the-wall-icons";
import TableTennisFixture from "./TableTennisFixture.native";

jest.mock("@ppb/the-wall-native", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard-mock />),
  AvBFixture: jest.fn(({ children }) => <avb-fixture-mock>{children}</avb-fixture-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SportsIconName: jest.fn(() => <sports-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
}));

jest.mock("./TableTennisFixture.helper", () => ({
  formatCouponScoreBoardData: jest.fn(() => "formatCouponScoreBoardData"),
}));

const COMPETITION_NAME = "TT Series Men";
const DATE = "tomorrow";
const ICON = SportsIconName.CHESS;
const MATCH_STATUS = "IN_PLAY";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const TIME = "21:00";
const SHOW_BOTTOM_SEPARATOR = false;
const NOTIFICATIONS_SUBSCRIPTION = true;
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
  time: TIME,
  icon: ICON,
  showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: false,
  sporteventURN: "sportEvent",
  urn: "ppb:fixture:111222",
  viewMode: DEFAULT_VIEW_MODE,
  notificationsSubscription: NOTIFICATIONS_SUBSCRIPTION,
  videoAvailable: true,
  labels: { inplay: "inplayz" },
};

function renderTableTennisFixture(tableTennisFixtureProps) {
  return render(<TableTennisFixture {...tableTennisFixtureProps} />);
}

describe("TableTennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("must render with a table tennis fixture component", () => {
    renderTableTennisFixture(TABLE_TENNIS_FIXTURE_PROPS);

    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      {
        icon: ICON,
        competitionLabel: COMPETITION_NAME,
        viewMode: DEFAULT_VIEW_MODE,
        showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
        children: expect.any(Object),
      },
      undefined,
    );
  });

  it("must render with a table tennis fixture scoreboard", () => {
    renderTableTennisFixture(TABLE_TENNIS_FIXTURE_PROPS);

    expect(AvBScoreboard).toHaveBeenCalledWith(
      {
        teamA: TEAM_A,
        teamB: TEAM_B,
        matchStatus: MATCH_STATUS,
        viewMode: DEFAULT_VIEW_MODE,
        scoreData: "formatCouponScoreBoardData",
        date: DATE,
        dateTime: DATE_TIME,
        time: TIME,
        teamServing: "HOME",
        liveVideo: true,
        inplayLabel: "inplayz",
        showEventDateBelow: true,
        showHorizontalDuration: false,
      },
      undefined,
    );
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
    renderTableTennisFixture({
      ...TABLE_TENNIS_FIXTURE_PROPS,
      viewMode: undefined,
      showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
    });

    expect(TableTennisFixtureComponent).toHaveBeenCalledWith(
      {
        icon: ICON,
        competitionLabel: COMPETITION_NAME,
        viewMode: DEFAULT_VIEW_MODE,
        showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
        children: expect.any(Object),
      },
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
        time: TIME,
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
        showEventDateBelow: true,
        showHorizontalDuration: false,
      }),
      undefined,
    );
  });

  describe("when video available is false", () => {
    it("must render a table tennis fixture component and scoreboard with correct view mode when passed", () => {
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
});
