import normalizer from "./filtered-coupon-card-group-normalizer";
import normalizeFilterOptionsFragmentIntoFilterOptions from "./filter-options-normalizer";

jest.mock("../../../gql-entities-mapper", () => ({
  getCardIcon: jest.fn(() => "icon"),
}));

jest.mock("./filter-options-normalizer", () => jest.fn(() => "FilteredOptionsMock"));

const BFF_RESPONSE = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:1",
  filteredCouponTitle: "All Matches",
  has90Min: true,
  viewAll: {
    icon: "ICON",
    label: "View more",
    viewLink: {
      viewUrl: "url",
      viewUrn: "urn",
    },
  },
  filterOptions: {
    sortOption: {
      defaultOption: "RANK",
      availableOptions: ["RANK", "TIME"],
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970407",
        },
      },
    ],
    pageInfo: {
      hasNextPage: true,
    },
  },
};

const BFF_RESPONSE_FILTERED = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:2",
  full: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
    pageInfo: {
      hasNextPage: true,
    },
  },
};

describe("Filtered coupon card group normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeFilteredCouponCardGroupFragmentIntoFilteredCouponCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FilteredCouponCardGroup",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970407",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        has90Min: true,
        title: "All Matches",
        viewAll: {
          icon: "icon",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        urn: "ppb:tbd:cardgroup:filtered:1",
        pageInfo: {
          hasNextPage: true,
        },
      });
    });

    it("when filteredCouponTitle is null, should correctly transform and return the data object", () => {
      const { data } = normalizer({ ...BFF_RESPONSE, filteredCouponTitle: null });

      expect(data).toEqual({
        typename: "FilteredCouponCardGroup",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970407",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        has90Min: true,
        title: "",
        viewAll: {
          icon: "icon",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        urn: "ppb:tbd:cardgroup:filtered:1",
        pageInfo: {
          hasNextPage: true,
        },
      });
    });

    it("when no filteredCouponTitle, should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE_FILTERED);

      expect(data).toEqual({
        typename: "FilteredCouponCardGroup",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
        ],
        filterOptions: {},
        title: "",
        viewAll: undefined,
        urn: "ppb:tbd:cardgroup:filtered:2",
        pageInfo: {
          hasNextPage: true,
        },
      });
    });

    it("should call filter options normalizer with filterOptions", () => {
      normalizer(BFF_RESPONSE);

      expect(normalizeFilterOptionsFragmentIntoFilterOptions).toHaveBeenCalledWith({
        sortOption: {
          defaultOption: "RANK",
          availableOptions: ["RANK", "TIME"],
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
      BFF_RESPONSE.partials.pageInfo = null;

      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FilteredCouponCardGroup",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970407",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        has90Min: true,
        title: "All Matches",
        viewAll: {
          icon: "icon",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        urn: "ppb:tbd:cardgroup:filtered:1",
        pageInfo: {
          hasNextPage: false,
        },
      });
    });

    it("when has90Min is null, should correctly transform and return the data object", () => {
      const { data } = normalizer({ ...BFF_RESPONSE, has90Min: null });

      expect(data).toEqual({
        typename: "FilteredCouponCardGroup",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970407",
          },
        ],
        filterOptions: "FilteredOptionsMock",
        has90Min: undefined,
        title: "All Matches",
        viewAll: {
          icon: "icon",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        urn: "ppb:tbd:cardgroup:filtered:1",
        pageInfo: {
          hasNextPage: false,
        },
      });
    });
  });
});
