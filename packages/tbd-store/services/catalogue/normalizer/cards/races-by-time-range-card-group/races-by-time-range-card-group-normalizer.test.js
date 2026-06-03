import normalizer from "./races-by-time-range-card-group-normalizer";
import normalizeFilterOptionsFragmentIntoFilterOptions from "../filtered-coupon-card-group/filter-options-normalizer";

jest.mock("../filtered-coupon-card-group/filter-options-normalizer", () => jest.fn(() => "FilteredOptionsMock"));

const BFF_RESPONSE = {
  __typename: "RacesByTimeRangeCardGroup",
  urn: "ppb:tbd:card:bytimerange:1",
  filterOptions: {
    countriesFilter: {
      availableOptions: [
        {
          name: "PT",
          urn: "ppb:tbd:cardfilter:countriesoption:1",
        },
      ],
      defaultOption: {
        name: "PT",
        urn: "ppb:tbd:cardfilter:countriesoption:1",
      },
      urn: "ppb:tbd:cardfilter:countries:YEfKQhIAACUAM6Uu/s/1",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting1|10",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting1|10",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting2|10",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting3|10",
        },
      },
    ],
    pageInfo: {
      hasNextPage: true,
    },
  },
};

describe("By time range card group normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeRacesByTimeRangeCardGroupFragmentIntoRacesByTimeRangeCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RacesByTimeRangeCardGroup",
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting1|10",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting2|10",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting3|10",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        urn: "ppb:tbd:card:bytimerange:1",
        pageInfo: {
          hasNextPage: true,
        },
      });
    });

    it("should call filter options normalizer with filterOptions", () => {
      normalizer(BFF_RESPONSE);

      expect(normalizeFilterOptionsFragmentIntoFilterOptions).toHaveBeenCalledWith({
        countriesFilter: {
          availableOptions: [
            {
              name: "PT",
              urn: "ppb:tbd:cardfilter:countriesoption:1",
            },
          ],
          defaultOption: {
            name: "PT",
            urn: "ppb:tbd:cardfilter:countriesoption:1",
          },
          urn: "ppb:tbd:cardfilter:countries:YEfKQhIAACUAM6Uu/s/1",
        },
      });
    });

    it("should default filters as empty when no filterOptions are available", () => {
      normalizer({
        ...BFF_RESPONSE,
        filterOptions: undefined,
      });

      expect(normalizeFilterOptionsFragmentIntoFilterOptions).not.toHaveBeenCalled();
    });

    it("should correctly transform and return the data object when items are null", () => {
      BFF_RESPONSE.full.edges[0] = null;
      BFF_RESPONSE.partials.edges[1] = null;

      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RacesByTimeRangeCardGroup",
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:meeting3|10",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        urn: "ppb:tbd:card:bytimerange:1",
        pageInfo: {
          hasNextPage: true,
        },
      });
    });
  });
});
