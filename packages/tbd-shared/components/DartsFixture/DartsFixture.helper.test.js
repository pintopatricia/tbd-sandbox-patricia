import { isDartsFixtureEqual } from "./DartsFixture.helper";

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

describe("isDartsFixtureEqual", () => {
  const BASE_PREV_PROPS = {
    competition: "Premier League",
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
    // Darts Specific:
    currentSet: { number: 1, score: { home: 2, away: 0 } },
  };

  describe("when competition name changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, competition: "World Championship" })).toEqual(
        false,
      );
    });
  });

  describe("when date changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, date: "today" })).toEqual(false);
    });
  });

  describe("when matchStatus changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, matchStatus: "END" })).toEqual(false);
    });
  });

  describe("when showBottomSeparator changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, showBottomSeparator: true })).toEqual(false);
    });
  });

  describe("when sporteventURN changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, sporteventURN: "987654321" })).toEqual(false);
    });
  });

  describe("when time changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, time: "21:30" })).toEqual(false);
    });
  });

  describe("when urn changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, urn: "99999999" })).toEqual(false);
    });
  });

  describe("when viewMode changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, viewMode: "SMALL" })).toEqual(false);
    });
  });

  describe("when teamA changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamA: "team AA" })).toEqual(false);
    });
  });

  describe("when teamB changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamB: "team BB" })).toEqual(false);
    });
  });

  describe("when notificationsSubscription changes", () => {
    it("should return false", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, notificationsSubscription: true })).toEqual(
        false,
      );
    });
  });

  describe("when currentSet changes", () => {
    it("should return false", () => {
      // simulate a leg being scored
      const newCurrentSet = { ...BASE_PREV_PROPS.currentSet, score: { home: 2, away: 1 } };
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, currentSet: newCurrentSet })).toEqual(false);
    });
  });

  describe("when scoreData changes", () => {
    it("should return false", () => {
      const newScoreData = [
        ...BASE_PREV_PROPS.scoreData,
        {
          home: 7,
          away: 8,
          style: "GREY_BACKGROUND",
        },
      ];

      expect(
        isDartsFixtureEqual(BASE_PREV_PROPS, {
          ...BASE_PREV_PROPS,
          scoreData: newScoreData,
        }),
      ).toEqual(false);
    });
  });

  describe("when all the data is the same", () => {
    it("should return true", () => {
      expect(isDartsFixtureEqual(BASE_PREV_PROPS, BASE_PREV_PROPS)).toEqual(true);
    });
  });
});
