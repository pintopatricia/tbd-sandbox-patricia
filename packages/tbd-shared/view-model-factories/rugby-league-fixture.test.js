import { createRugbyLeagueFixtureViewModel } from "./rugby-league-fixture";
import { formatDateWithToday, formatTime } from "../helpers/dates";

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const SPORT_EVENT = { name: "Sydney Roosters v South Sydney Rabbitohs", openDate: "2000-02-11 21:00:00" };

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

beforeEach(jest.clearAllMocks);

describe("createRugbyLeagueFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getRugbyLeagueFixtureViewModel = createRugbyLeagueFixtureViewModel();
        const rugbyLeagueFixtureViewModel = getRugbyLeagueFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(rugbyLeagueFixtureViewModel).toEqual(
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
          const getRugbyLeagueFixtureViewModel = createRugbyLeagueFixtureViewModel();
          const rugbyLeagueFixtureViewModel = getRugbyLeagueFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(rugbyLeagueFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getRugbyLeagueFixtureViewModel = createRugbyLeagueFixtureViewModel();
            getRugbyLeagueFixtureViewModel({
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
          const getRugbyLeagueFixtureViewModel = createRugbyLeagueFixtureViewModel();
          const rugbyLeagueFixtureViewModel = getRugbyLeagueFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(rugbyLeagueFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getRugbyLeagueFixtureViewModel = createRugbyLeagueFixtureViewModel();
            getRugbyLeagueFixtureViewModel({
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
});
