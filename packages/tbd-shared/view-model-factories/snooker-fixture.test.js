import { createSnookerFixtureViewModel } from "./snooker-fixture";
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

describe("createSnookerFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
        const snookerFixtureViewModel = getSnookerFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(snookerFixtureViewModel).toEqual(
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
          const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
          const snookerFixtureViewModel = getSnookerFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(snookerFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
            getSnookerFixtureViewModel({
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
          const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
          const snookerFixtureViewModel = getSnookerFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(snookerFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
            getSnookerFixtureViewModel({
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
    let snookerFixtureViewModel;
    describe("when there is not score", () => {
      beforeEach(() => {
        const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
        snookerFixtureViewModel = getSnookerFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
        });
      });
      it(`should return PRE_MATCH`, async () => {
        expect(snookerFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: "PRE_MATCH",
          }),
        );
      });
    });

    describe("when there is score", () => {
      beforeEach(() => {
        const getSnookerFixtureViewModel = createSnookerFixtureViewModel();
        snookerFixtureViewModel = getSnookerFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: { home: 1, away: 0 },
        });
      });
      it(`should return IN_PLAY`, async () => {
        expect(snookerFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: "IN_PLAY",
          }),
        );
      });
    });
  });
});
