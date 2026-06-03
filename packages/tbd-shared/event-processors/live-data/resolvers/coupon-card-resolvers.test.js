import { getStore } from "@ppb/tbd-store/create-store";
import { refreshCouponCard } from "./coupon-card-resolvers";

const mockState = {
  layouts: {
    cardgroups: {
      racesbytimerangecardgroups: [],
      futureracingcardgroups: [],
      filteredcouponcardgroups: {
        "some-urn": {
          urn: "some-urn",
          filterOptions: {
            marketTypeFilter: {
              selectedOption: {
                marketType: "some-market-type",
              },
            },
            competitionsFilter: {
              defaultOptions: [],
              selectedOptions: [{ name: "ATP London 2025", urn: "ppb:competition:12740468" }],
            },
            dateRangeFilter: {
              selectedOption: {
                urn: "ppb:date-range:12740468",
              },
            },
            sortOption: {
              selectedOption: "some-sort-option",
            },
          },
        },
      },
    },
  },
};
jest.mock("@ppb/tbd-store/create-store", () => {
  const mockDispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch: mockDispatch,
      getState: jest.fn(() => mockState),
    })),
  };
});

describe("refreshCouponCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should dispatch FETCH_FILTERED_COUPON", () => {
    refreshCouponCard({ urn: "some-urn" });

    expect(getStore().dispatch).toHaveBeenCalledWith({
      payload: {
        filterBy: {
          marketType: "some-market-type",
          competitions: ["ppb:competition:12740468"],
          dateRange: "ppb:date-range:12740468",
        },
        sortBy: "some-sort-option",
        urn: "some-urn",
      },
      type: "FETCH_FILTERED_COUPON",
    });
  });
});
