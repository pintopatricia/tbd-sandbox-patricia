import { createFutureRacingViewModel } from "./future-racing-grouping";
import { formatDateWithMonth } from "../helpers/dates";

const ITEMS_MOCK = [
  { date: "2019-12-23T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:1", typename: "EventMarketCard" },
  { date: "2019-12-23T12:16:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:2", typename: "EventMarketCard" },
  { date: "2019-12-24T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:3", typename: "EventMarketCard" },
  { date: "2019-12-24T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:4", typename: "EventMarketCard" },
];

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const STATE_MOCK = {
  urn: "ppb:tbd:cardgroup:filtered:1",
  title: "All matches",
  items: ITEMS_MOCK,
  filterOptions: {},
};

jest.mock("../helpers/dates", () => ({
  formatDateWithMonth: jest.fn(() => "date"),
}));

describe("createFutureRacingViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is correct", () => {
    const groupItemsByDate = createFutureRacingViewModel();

    it("should return expected data", () => {
      expect(groupItemsByDate(STATE_MOCK, USER_DETAILS)).toEqual({
        cardItems: [
          {
            date: "date",
            items: [
              { date: "2019-12-23T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:1", typename: "EventMarketCard" },
              { date: "2019-12-23T12:16:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:2", typename: "EventMarketCard" },
            ],
          },
          {
            date: "date",
            items: [
              { date: "2019-12-24T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:3", typename: "EventMarketCard" },
              { date: "2019-12-24T12:15:00Z", urn: "ppb:tbd:card:eventPrimaryMarket:4", typename: "EventMarketCard" },
            ],
          },
        ],
        urnList: ITEMS_MOCK,
      });

      expect(formatDateWithMonth).toHaveBeenNthCalledWith(1, expect.any(Date), "locale", "timezone");
      expect(formatDateWithMonth).toHaveBeenNthCalledWith(2, expect.any(Date), "locale", "timezone");
    });
  });
});
