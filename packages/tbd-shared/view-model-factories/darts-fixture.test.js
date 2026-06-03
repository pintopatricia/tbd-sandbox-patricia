import { createDartsFixtureViewModel } from "./darts-fixture";
import { formatDateWithToday } from "../helpers/dates";
import { DartsFixtureType } from "@ppb/tbd-store/state/entities/darts-fixture/DartsFixture";
import { MatchStatus, ScoreStyle } from "@ppb/the-wall-common/types";

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const SPORT_EVENT = { name: "Player A v Player B", openDate: "2000-02-11 21:00:00" };

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

beforeEach(jest.clearAllMocks);

describe("createDartsFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getDartsFixtureViewModel = createDartsFixtureViewModel();
        const dartsFixtureViewModel = getDartsFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(dartsFixtureViewModel).toEqual(
          expect.objectContaining({ date: undefined, dateTime: undefined, time: undefined }),
        );
      });
    });

    describe("where there is an openDate on the sportevent", () => {
      describe("and the event is happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("I18N.DATE.TODAY");
        });

        it("should return the correct sportevent date information", () => {
          const getDartsFixtureViewModel = createDartsFixtureViewModel();
          const dartsFixtureViewModel = getDartsFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(dartsFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });
      });
    });
  });

  describe("getMatchState (Inferred)", () => {
    it("should return PRE_MATCH when score is undefined", () => {
      const getDartsFixtureViewModel = createDartsFixtureViewModel();
      const dartsFixtureViewModel = getDartsFixtureViewModel({
        userDetails: USER_DETAILS,
        sportEvent: SPORT_EVENT,
        score: undefined,
      });

      expect(dartsFixtureViewModel).toEqual(
        expect.objectContaining({
          matchStatus: MatchStatus.PRE_MATCH,
        }),
      );
    });

    it("should return PRE_MATCH when score is 0-0 and no currentSet", () => {
      const getDartsFixtureViewModel = createDartsFixtureViewModel();
      const dartsFixtureViewModel = getDartsFixtureViewModel({
        userDetails: USER_DETAILS,
        sportEvent: SPORT_EVENT,
        score: { home: 0, away: 0 },
      });

      expect(dartsFixtureViewModel).toEqual(
        expect.objectContaining({
          matchStatus: MatchStatus.PRE_MATCH,
        }),
      );
    });

    it("should return IN_PLAY when score is valid (not 0-0)", () => {
      const getDartsFixtureViewModel = createDartsFixtureViewModel();
      const dartsFixtureViewModel = getDartsFixtureViewModel({
        userDetails: USER_DETAILS,
        sportEvent: SPORT_EVENT,
        score: { home: 1, away: 0 },
      });

      expect(dartsFixtureViewModel).toEqual(
        expect.objectContaining({
          matchStatus: MatchStatus.IN_PLAY,
        }),
      );
    });

    it("should return IN_PLAY when currentSet exists (even if main score is 0-0)", () => {
      const getDartsFixtureViewModel = createDartsFixtureViewModel();
      const dartsFixtureViewModel = getDartsFixtureViewModel({
        userDetails: USER_DETAILS,
        sportEvent: SPORT_EVENT,
        score: { home: 0, away: 0 },
        currentSet: { number: 1, score: { home: 0, away: 0 } },
      });

      expect(dartsFixtureViewModel).toEqual(
        expect.objectContaining({
          matchStatus: MatchStatus.IN_PLAY,
        }),
      );
    });
  });

  describe("Score Formatting", () => {
    describe("when type is LEGS (Basic Score)", () => {
      it("should format basic score correctly with IN_PLAY style", () => {
        const getDartsFixtureViewModel = createDartsFixtureViewModel();
        const result = getDartsFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          type: DartsFixtureType.LEGS,
          isAmericanFormat: false,
          score: { home: 5, away: 3 },
          currentSet: undefined,
        });

        expect(result.scoreData[0]).toEqual({
          teamA: 5,
          teamB: 3,
          style: ScoreStyle.IN_PLAY,
        });
      });

      it("should swap scores if american format", () => {
        const getDartsFixtureViewModel = createDartsFixtureViewModel();
        const result = getDartsFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          type: DartsFixtureType.LEGS,
          isAmericanFormat: true,
          score: { home: 5, away: 3 },
          currentSet: undefined,
        });

        expect(result.scoreData[0]).toEqual({
          teamA: 3,
          teamB: 5,
          style: ScoreStyle.IN_PLAY,
        });
      });
    });

    describe("when type is SETS (Sets Score)", () => {
      const mainScore = { home: 2, away: 1 }; // Sets Won
      const currentSetData = {
        number: 4,
        score: { home: 2, away: 2 }, // Legs in current set
      };

      it("should format sets score correctly (sets as DEFAULT, legs as IN_PLAY)", () => {
        const getDartsFixtureViewModel = createDartsFixtureViewModel();
        const result = getDartsFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          type: DartsFixtureType.SETS,
          isAmericanFormat: false,
          score: mainScore,
          currentSet: currentSetData,
        });

        // Column 0: Sets Score -> Should match Table Tennis "Sets" style (White/Default)
        expect(result.scoreData[0]).toEqual({
          teamA: 2,
          teamB: 1,
          style: ScoreStyle.DEFAULT,
        });

        // Column 1: Current Set Legs -> Should be Highlighted (Blue/InPlay)
        expect(result.scoreData[1]).toEqual({
          teamA: 2,
          teamB: 2,
          style: ScoreStyle.IN_PLAY,
        });
      });

      it("should swap scores if american format", () => {
        const getDartsFixtureViewModel = createDartsFixtureViewModel();
        const result = getDartsFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          type: DartsFixtureType.SETS,
          isAmericanFormat: true,
          score: mainScore,
          currentSet: currentSetData,
        });

        // Column 0: Sets Score (Swapped)
        expect(result.scoreData[0]).toEqual({
          teamA: 1,
          teamB: 2,
          style: ScoreStyle.DEFAULT,
        });

        // Column 1: Current Set Legs (Swapped)
        expect(result.scoreData[1]).toEqual({
          teamA: 2,
          teamB: 2,
          style: ScoreStyle.IN_PLAY,
        });
      });
    });
  });
});
