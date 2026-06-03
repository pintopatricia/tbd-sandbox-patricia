import { ScoreboardViewMode, TeamSide, MatchStatus } from "@ppb/the-wall-common/types";
import { formatCouponScoreBoardData, isEqualFixture } from "./TableTennisFixture.helper";

jest.mock("../../helpers/dates", () => ({
  isToday: jest.fn(() => false),
  formatDate: jest.fn(() => "formatDate"),
  formatTime: jest.fn(() => "21:00"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const SCORE_DATA = [
  {
    home: 0,
    away: 1,
    style: "GREEN_BACKGROUND",
  },
  {
    home: 2,
    away: 6,
    style: "BORDER",
  },
  {
    home: 3,
    away: 4,
    style: "BORDER",
  },
];

const CURRENT_SET = {
  currentServer: TeamSide.HOME,
  number: 2,
  score: {
    away: 4,
    home: 3,
  },
};

const SPORT_EVENT_OPEN_DATE = "2022-06-11 21:00:00";

const TABLE_TENNIS_FIXTURE = {
  competition: "competitionName",
  currentSet: CURRENT_SET,
  date: "I18N.DATE.TODAY",
  dateTime: new Date(SPORT_EVENT_OPEN_DATE),
  matchStatus: "IN_PLAY",
  scoreData: SCORE_DATA,
  teamServing: "HOME",
  teamA: {
    name: "TEAM A",
  },
  teamB: {
    name: "TEAM B",
  },
  time: "21:00",
  icon: "Table-Tennis",
  showBottomSeparator: false,
  sporteventURN: "sportEvent",
  urn: "ppb:fixture:111222",
  viewMode: "COUPON",
  notificationsSubscription: false,
};

describe("Table Tennis Helper", () => {
  describe("formatCouponScoreBoardData", () => {
    describe("when view mode is 'COUPON'", () => {
      describe("and game is 'END'", () => {
        it("should return the correct score board for that view", () => {
          expect(
            formatCouponScoreBoardData(SCORE_DATA, ScoreboardViewMode.COUPON, CURRENT_SET, MatchStatus.END),
          ).toEqual([
            {
              away: 1,
              home: 0,
              style: "GREEN_BACKGROUND",
            },
          ]);
        });
      });

      describe("and game is 'IN_PLAY'", () => {
        it("should return the correct score board for that view", () => {
          expect(
            formatCouponScoreBoardData(SCORE_DATA, ScoreboardViewMode.COUPON, CURRENT_SET, MatchStatus.IN_PLAY),
          ).toEqual([
            {
              away: 1,
              home: 0,
              style: "GREEN_BACKGROUND",
            },
            {
              home: 3,
              away: 4,
              style: "BORDER",
            },
          ]);
        });
      });
    });

    describe("when view mode is not 'COUPON'", () => {
      it("should return the correct score board for that view", () => {
        expect(formatCouponScoreBoardData(SCORE_DATA, ScoreboardViewMode.SMALL, CURRENT_SET)).toEqual([
          {
            home: 0,
            away: 1,
            style: "GREEN_BACKGROUND",
          },
          {
            home: 2,
            away: 6,
            style: "BORDER",
          },
          {
            home: 3,
            away: 4,
            style: "BORDER",
          },
        ]);
      });
    });
  });
});

describe("isEqualFixture", () => {
  describe("when fixtures are the same", () => {
    it("should return true", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, TABLE_TENNIS_FIXTURE)).toEqual(true);
    });
  });

  describe("when competition is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, competition: "competition" })).toEqual(
        false,
      );
    });
  });

  describe("when currentSet is different", () => {
    it("should return false", () => {
      expect(
        isEqualFixture(TABLE_TENNIS_FIXTURE, {
          ...TABLE_TENNIS_FIXTURE,
          currentSet: { ...CURRENT_SET, currentServer: TeamSide.AWAY },
        }),
      ).toEqual(false);
    });
  });

  describe("when date is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, date: "Date" })).toEqual(false);
    });
  });

  describe("when dateTime is different", () => {
    it("should return false", () => {
      expect(
        isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, dateTime: new Date("2022-06-11 21:10:00") }),
      ).toEqual(false);
    });
  });

  describe("when matchStatus is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, matchStatus: "END" })).toEqual(false);
    });
  });

  describe("when scoreData is different", () => {
    it("should return false", () => {
      expect(
        isEqualFixture(TABLE_TENNIS_FIXTURE, {
          ...TABLE_TENNIS_FIXTURE,
          scoreData: [
            ...SCORE_DATA,
            {
              home: 3,
              away: 5,
              style: "BORDER",
            },
          ],
        }),
      ).toEqual(false);
    });
  });

  describe("when teamServing is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, teamServing: "AWAY" })).toEqual(false);
    });
  });

  describe("when teamA is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, teamA: { name: "TEAM 1" } })).toEqual(
        false,
      );
    });
  });

  describe("when teamB is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, teamB: { name: "Team 2" } })).toEqual(
        false,
      );
    });
  });

  describe("when time is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, time: "22:00" })).toEqual(false);
    });
  });

  describe("when icon is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, icon: "Mock-Icon" })).toEqual(false);
    });
  });

  describe("when showBottomSeparator is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, showBottomSeparator: true })).toEqual(
        false,
      );
    });
  });

  describe("when sportEventURN is different", () => {
    it("should return false", () => {
      expect(
        isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, sporteventURN: "mock sportEvent" }),
      ).toEqual(false);
    });
  });

  describe("when urn is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, urn: "ppb:fixture:222111" })).toEqual(
        false,
      );
    });
  });

  describe("when viewMode is different", () => {
    it("should return false", () => {
      expect(isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, viewMode: "SMALL" })).toEqual(false);
    });
  });

  describe("when notificationsSubscription is true", () => {
    it("should return false", () => {
      expect(
        isEqualFixture(TABLE_TENNIS_FIXTURE, { ...TABLE_TENNIS_FIXTURE, notificationsSubscription: true }),
      ).toEqual(false);
    });
  });
});
