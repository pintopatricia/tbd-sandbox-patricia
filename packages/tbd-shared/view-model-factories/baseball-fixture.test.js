import { createBaseballFixtureViewModel } from "./baseball-fixture"; // Updated import
import { formatDateWithToday, formatTime } from "../helpers/dates";

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const SPORT_EVENT = { name: "Yankees v Red Sox", openDate: "2000-02-11 21:00:00" };

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

beforeEach(jest.clearAllMocks);

describe("createBaseballFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
        const baseballFixtureViewModel = getBaseballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(baseballFixtureViewModel).toEqual(
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
          const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
          const baseballFixtureViewModel = getBaseballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(baseballFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
            getBaseballFixtureViewModel({
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
          const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
          const baseballFixtureViewModel = getBaseballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(baseballFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
            getBaseballFixtureViewModel({
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
    const END = "END";
    const PRE_MATCH = "PRE_MATCH";

    describe.each([
      ["INNING_1", IN_PLAY],
      ["INNING_2", IN_PLAY],
      ["INNING_5", IN_PLAY],
      ["INNING_9", IN_PLAY],
      ["EXTRA_INNINGS", IN_PLAY],
      ["UNKNOWN", IN_PLAY],
      ["END", END],
      ["PRE_MATCH", PRE_MATCH],
      [undefined, PRE_MATCH],
    ])("when period status is %s", (periodStatus, mappedStatus) => {
      it(`should map to ${mappedStatus}`, async () => {
        const CLOCK_PERIOD_VALUE = { period: periodStatus };

        const getBaseballFixtureViewModel = createBaseballFixtureViewModel();
        const baseballFixtureViewModel = getBaseballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          clock: CLOCK_PERIOD_VALUE,
        });

        expect(baseballFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: mappedStatus,
          }),
        );
      });
    });
  });
});
