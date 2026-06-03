import { i18n } from "../../helpers/i18n";
import { getStatusLabel, isIceHockeyFixtureEqual } from "./IceHockeyFixture.helper";

jest.mock("../../helpers/dates", () => ({
  formatDate: jest.fn(() => "formatDate"),
  formatTime: jest.fn(() => "21:00"),
  isToday: jest.fn(() => false),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreStyle: {
    BORDER: "BORDER",
    BORDER_EMPTY: "BORDER_EMPTY",
    GREEN_BACKGROUND: "GREEN_BACKGROUND",
    GREY_BACKGROUND: "GREY_BACKGROUND",
    YELLOW_BACKGROUND: "YELLOW_BACKGROUND",
  },
  MatchStatus: {
    PRE_MATCH: "PRE_MATCH",
    IN_PLAY: "IN_PLAY",
    NO_EXTRA_TIME: "NO_EXTRA_TIME",
    END: "END",
  },
  ScoreboardViewMode: {
    DEFAULT: "DEFAULT",
    SMALL: "SMALL",
    COUPON: "COUPON",
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getStatusLabel", () => {
  const DEFAULT_VIEW_MODE = "DEFAULT";
  const SMALL_VIEW_MODE = "SMALL";

  const END_PERIOD_KEY = "I18N.MATCH_TIMELINE.END_PERIOD";
  const FULL_TIME_KEY = "I18N.MATCH_TIMELINE.FULL_TIME";

  const FOOTBALL_SCOREBOARD_END_PERIOD_KEY = "I18N.FOOTBALL_SCOREBOARD.END_PERIOD";
  const FOOTBALL_SCOREBOARD_FULL_TIME_KEY = "I18N.FOOTBALL_SCOREBOARD.FULL";

  const CLOCK = { period: "PERIOD_1" };

  describe("where there is no clock information available", () => {
    it("should return an empty string", () => {
      expect(getStatusLabel(undefined, DEFAULT_VIEW_MODE)).toEqual("");
    });
  });

  describe.each([
    [{ ...CLOCK, period: "END_PERIOD_1" }, DEFAULT_VIEW_MODE, END_PERIOD_KEY],
    [{ ...CLOCK, period: "END_PERIOD_2" }, DEFAULT_VIEW_MODE, END_PERIOD_KEY],
    [{ ...CLOCK, period: "END_PERIOD_3" }, DEFAULT_VIEW_MODE, END_PERIOD_KEY],
    // [{ ...CLOCK, period: "END_OVERTIME" }, DEFAULT_VIEW_MODE, END_PERIOD_KEY],
    [{ ...CLOCK, period: "END" }, DEFAULT_VIEW_MODE, FULL_TIME_KEY],
    [{ ...CLOCK, period: "END_PERIOD_1" }, SMALL_VIEW_MODE, FOOTBALL_SCOREBOARD_END_PERIOD_KEY],
    [{ ...CLOCK, period: "END_PERIOD_2" }, SMALL_VIEW_MODE, FOOTBALL_SCOREBOARD_END_PERIOD_KEY],
    [{ ...CLOCK, period: "END_PERIOD_3" }, SMALL_VIEW_MODE, FOOTBALL_SCOREBOARD_END_PERIOD_KEY],
    // [{ ...CLOCK, period: "END_OVERTIME" }, SMALL_VIEW_MODE, FOOTBALL_SCOREBOARD_END_PERIOD_KEY],
    [{ ...CLOCK, period: "END" }, SMALL_VIEW_MODE, FOOTBALL_SCOREBOARD_FULL_TIME_KEY],
  ])("when period status is %s", (clock, viewMode, i18nKey) => {
    it(`should call i18n with ${i18nKey} key`, async () => {
      getStatusLabel(clock, viewMode);
      expect(i18n).toHaveBeenCalledWith({ key: i18nKey });
    });
  });

  describe("when calling getStatusLabel with an end period", () => {
    describe("and there's no time remaining information", () => {
      it("should return the end period label", () => {
        expect(getStatusLabel({ ...CLOCK, period: "END", timeRemaining: undefined }, DEFAULT_VIEW_MODE)).toEqual(
          FULL_TIME_KEY,
        );
      });
    });
  });
});

describe("isIceHockeyFixtureEqual", () => {
  const BASE_PREV_PROPS = {
    clock: {
      period: "PERIOD_1",
    },
    competition: "NBA",
    date: "tomorrow",
    dateTime: new Date("2022-06-11 21:00:00"),
    matchStatus: "IN_PLAY",
    scoreData: [
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
    ],
    showBottomSeparator: false,
    sporteventURN: "123456789",
    teamA: { name: "team A" },
    teamB: { name: "team B" },
    notificationsSubscription: false,
    time: "21:00",
    viewMode: "DEFAULT",
  };

  describe("when competition name changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, competition: "NBB" })).toEqual(false);
    });
  });

  describe("when date changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, date: "today" })).toEqual(false);
    });
  });

  describe("when matchStatus changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, matchStatus: "END" })).toEqual(false);
    });
  });

  describe("when showBottomSeparator changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, showBottomSeparator: true })).toEqual(
        false,
      );
    });
  });

  describe("when sporteventURN changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, sporteventURN: "987654321" })).toEqual(
        false,
      );
    });
  });

  describe("when time changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, time: "21:30" })).toEqual(false);
    });
  });

  describe("when urn changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, urn: "99999999" })).toEqual(false);
    });
  });

  describe("when viewMode changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, viewMode: "SMALL" })).toEqual(false);
    });
  });

  describe("when teamA changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamA: "team AA" })).toEqual(false);
    });
  });

  describe("when teamB changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamB: "team BB" })).toEqual(false);
    });
  });

  describe("when notificationsSubscription changes", () => {
    it("should return false", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, notificationsSubscription: true })).toEqual(
        false,
      );
    });
  });

  describe("when scoreData changes", () => {
    it("should return false", () => {
      expect(
        isIceHockeyFixtureEqual(BASE_PREV_PROPS, {
          ...BASE_PREV_PROPS,
          scoreData: BASE_PREV_PROPS.scoreData.push({
            home: 7,
            away: 8,
            style: "GREY_BACKGROUND",
          }),
        }),
      ).toEqual(false);
    });
  });

  describe("when statusLabel changes", () => {
    it("should return false", () => {
      expect(
        isIceHockeyFixtureEqual(BASE_PREV_PROPS, {
          ...BASE_PREV_PROPS,
          viewMode: "SMALL",
        }),
      ).toEqual(false);
    });
  });

  describe("when all the data is the same", () => {
    it("should return true", () => {
      expect(isIceHockeyFixtureEqual(BASE_PREV_PROPS, BASE_PREV_PROPS)).toEqual(true);
    });
  });
});
