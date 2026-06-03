import { isRugbyUnionFixtureEqual, formatScoreBoardData } from "./RugbyUnionFixture.helper";

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
  ScoreboardViewMode: {
    DEFAULT: "DEFAULT",
    SMALL: "SMALL",
    COUPON: "COUPON",
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("isRugbyUnionFixtureEqual", () => {
  const BASE_PREV_PROPS = {
    competition: "European Champions Cup",
    date: "tomorrow",
    dateTime: new Date("2022-06-11 21:00:00"),
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
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, competition: "NBB" })).toEqual(false);
    });
  });

  describe("when date changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, date: "today" })).toEqual(false);
    });
  });

  describe("when showBottomSeparator changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, showBottomSeparator: true })).toEqual(
        false,
      );
    });
  });

  describe("when sporteventURN changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, sporteventURN: "987654321" })).toEqual(
        false,
      );
    });
  });

  describe("when time changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, time: "21:30" })).toEqual(false);
    });
  });

  describe("when urn changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, urn: "99999999" })).toEqual(false);
    });
  });

  describe("when viewMode changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, viewMode: "SMALL" })).toEqual(false);
    });
  });

  describe("when teamA changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamA: "team AA" })).toEqual(false);
    });
  });

  describe("when teamB changes", () => {
    it("should return false", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, teamB: "team BB" })).toEqual(false);
    });
  });

  describe("when notificationsSubscription changes", () => {
    it("should return false", () => {
      expect(
        isRugbyUnionFixtureEqual(BASE_PREV_PROPS, { ...BASE_PREV_PROPS, notificationsSubscription: true }),
      ).toEqual(false);
    });
  });

  describe("when scoreData changes", () => {
    it("should return false", () => {
      expect(
        isRugbyUnionFixtureEqual(BASE_PREV_PROPS, {
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
        isRugbyUnionFixtureEqual(BASE_PREV_PROPS, {
          ...BASE_PREV_PROPS,
          viewMode: "SMALL",
        }),
      ).toEqual(false);
    });
  });

  describe("when all the data is the same", () => {
    it("should return true", () => {
      expect(isRugbyUnionFixtureEqual(BASE_PREV_PROPS, BASE_PREV_PROPS)).toEqual(true);
    });
  });
});

describe("formatScoreBoardData", () => {
  const SCORE_DATA = [
    {
      home: 4,
      away: 5,
      style: "GREY_BACKGROUND",
    },
    {
      home: 1,
      away: 2,
      style: "BORDER",
    },
  ];
  describe("showing the in play score", () => {
    it("should return the correct score board for that view", () => {
      expect(formatScoreBoardData(SCORE_DATA)).toEqual([SCORE_DATA[0]]);
    });
  });
});
