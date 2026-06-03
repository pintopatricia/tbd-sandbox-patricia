import { createHorsePastPerformancesViewModel } from "./horse-past-performances";
import { raceDistance } from "../formatters/distance-formatters";
import { formatFullDateWithShortYear } from "../helpers/dates";

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../formatters/distance-formatters", () => ({
  raceDistance: jest.fn(),
}));

jest.mock("../helpers/dates", () => ({
  formatFullDateWithShortYear: jest.fn(() => "MOCKED_DATE"),
}));

let getHorsePastPerformances;
const testDate = new Date("Thu Mar 03 2022 19:30:50 GMT+0000");

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

describe("horse past performance view model factory", () => {
  describe("createHorsePastPerformancesViewModel", () => {
    beforeEach(() => {
      getHorsePastPerformances = createHorsePastPerformancesViewModel();
    });

    describe("when there is no past performances data", () => {
      it("should return empty array if the card is missing", () => {
        expect(getHorsePastPerformances(null)).toEqual([]);
      });
    });

    describe("when there is past performances data", () => {
      describe("and all fields are available", () => {
        it("should return past performances with the returned values", () => {
          raceDistance.mockReturnValueOnce("3f");
          const result = getHorsePastPerformances(
            [
              {
                race: {
                  venue: "the course",
                  raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
                  details: {
                    scheduledTime: testDate,
                    distance: { miles: 0, furlongs: 3, yards: 0 },
                    going: "SOFT",
                    numberOfRunners: 10,
                    raceType: "HURDLE",
                  },
                },
                performanceComment: "the comment",
                positionOfficial: 5,
              },
            ],
            USER_DETAILS,
          );

          expect(result).toEqual([
            {
              course: "the course",
              going: "I18N.RACE_GOING.SOFT",
              date: "MOCKED_DATE",
              pos: "5/10",
              runnerComment: "the comment",
              type: "I18N.RACE_TYPE.HURDLE",
              distance: "3f",
              raceReplayUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
            },
          ]);
          expect(formatFullDateWithShortYear).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
        });
      });

      describe("and (some) fields are not available", () => {
        it("should return past performances with the default values", () => {
          expect(
            getHorsePastPerformances(
              [
                {
                  race: {
                    details: {},
                  },
                  performanceComment: undefined,
                },
              ],
              USER_DETAILS,
            ),
          ).toEqual([
            {
              course: "I18N.RECENT_RACES.DEFAULT_VALUE",
              going: "I18N.RECENT_RACES.DEFAULT_VALUE",
              date: "I18N.RECENT_RACES.DEFAULT_VALUE",
              pos: "I18N.RECENT_RACES.DEFAULT_VALUE",
              runnerComment: "I18N.RECENT_RACES.COMMENT_DEFAULT_VALUE",
              type: "I18N.RECENT_RACES.DEFAULT_VALUE",
              distance: "I18N.RECENT_RACES.DEFAULT_VALUE",
            },
          ]);
        });
      });
    });
  });
});
