import { createAustralianRulesFixtureViewModel } from "./australian-rules-fixture";
import { formatDateWithToday, formatTime } from "../helpers/dates";

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const SPORT_EVENT = { name: "Nam Ching v Able Hon Friends", openDate: "2000-02-11 21:00:00" };

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

beforeEach(jest.clearAllMocks);

describe("createAustralianRulesFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
        const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(australianRulesFixtureViewModel).toEqual(
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
          const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
          const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(australianRulesFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
            getAustralianRulesFixtureViewModel({
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
            });
          });

          it("should call formatDateWithToday", () => {
            expect(formatDateWithToday).toHaveBeenCalledTimes(1);
            expect(formatDateWithToday).toHaveBeenCalledWith(
              new Date("2000-02-11T21:00:00.000Z"),
              "locale",
              "timezone",
            );
          });

          it("should call formatTime", () => {
            expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
          });
        });
      });

      describe("and the event is not happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("formatDate");
        });

        it("should return the correct sportevent date information", () => {
          const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
          const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(australianRulesFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
            getAustralianRulesFixtureViewModel({
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
            });
          });

          it("should call formatDateWithToday", () => {
            expect(formatDateWithToday).toHaveBeenCalledTimes(1);
            expect(formatDateWithToday).toHaveBeenCalledWith(
              new Date("2000-02-11T21:00:00.000Z"),
              "locale",
              "timezone",
            );
          });

          it("should call formatTime", () => {
            expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
          });
        });
      });
    });
  });

  describe("getMatchState", () => {
    const IN_PLAY = "IN_PLAY";
    const PRE_MATCH = "PRE_MATCH";

    describe("when the is score", () => {
      it(`should return IN_PLAY`, async () => {
        const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
        const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: { points: { home: 0, away: 0 } },
        });

        expect(australianRulesFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: IN_PLAY,
          }),
        );
      });
    });

    describe("when the is no score (empty)", () => {
      it(`should return PRE_MATCH`, async () => {
        const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
        const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: {},
        });

        expect(australianRulesFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: PRE_MATCH,
          }),
        );
      });
    });

    describe("when the is no score (null)", () => {
      it(`should return PRE_MATCH`, async () => {
        const getAustralianRulesFixtureViewModel = createAustralianRulesFixtureViewModel();
        const australianRulesFixtureViewModel = getAustralianRulesFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: null,
        });

        expect(australianRulesFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: PRE_MATCH,
          }),
        );
      });
    });
  });
});
