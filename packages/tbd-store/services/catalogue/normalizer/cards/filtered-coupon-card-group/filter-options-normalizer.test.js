import { FilteredGroupSort } from "../../../../../state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import normalizer from "./filter-options-normalizer";

jest.mock("../../entities/sports/sport-normalizer", () => jest.fn(() => ({ data: { urn: "ppb:sport:urn" } })));

jest.mock("../../entities/competitions/competition-normalizer", () =>
  jest.fn(() => ({ data: { urn: "ppb:competition:urn" } })),
);

const FILTER_OPTIONS_MOCK = {
  sortOption: {
    defaultOption: "RANK",
    availableOptions: ["RANK", "TIME"],
  },
  dateRangeFilter: {
    urn: "ppb:tbd:cardfilter:daterange:YEfKQhIAACUAM6Uu/s/1",
    defaultOption: {
      urn: "ppb:tbd:daterangeoption:YEfKQhIAACUAM6Uu/s/1|X_izlhAAACMAo5Ex",
      title: {
        __typename: "DisplayNameTitle",
        name: "Tomorrow's Racing",
      },
    },
    availableOptions: [
      {
        urn: "ppb:tbd:daterangeoption:YEfKQhIAACUAM6Uu/s/1|X_izlhAAACMAo5Ex",
        title: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "Tomorrow's Racing",
        },
      },
    ],
  },
  marketTypeFilter: {
    urn: "ppb:tbd:cardfilter:markettype:YIA8mBEAACMAMOhA/s/1",
    defaultOption: { name: "competition name", marketType: { urn: "sportUrn" } },
    availableOptions: [
      {
        marketType: {
          urn: "ppb:marketType:MATCH_ODDS",
        },
        name: "Match Odds",
      },
    ],
    layout: "PEBBLES",
  },
  competitionsFilter: {
    urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
    defaultOptions: [
      { urn: "competition:filter:urn", competitionId: 222, name: "competition name", sport: { urn: "sportUrn" } },
    ],
    topCompetitions: [
      {
        __typename: "Competition",
        urn: "ppb:competition:10932509",
        name: "English Premier League",
        competitionId: 10932509,
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    ],
  },
  countriesFilter: {
    availableOptions: [
      {
        name: "PT",
        urn: "ppb:tbd:cardfilter:countriesoption:1",
      },
    ],
    defaultOptions: {
      name: "PT",
      urn: "ppb:tbd:cardfilter:countriesoption:1",
    },
    urn: "ppb:tbd:cardfilter:countries:YEfKQhIAACUAM6Uu/s/1",
  },
  monthFilter: {
    availableOptions: [
      {
        date: "2021-01-01T00:00:00.000Z",
        urn: "ppb:tbd:cardfilter:monthoption:1",
      },
    ],
    defaultOptions: {
      date: "2021-01-01T00:00:00.000Z",
      urn: "ppb:tbd:cardfilter:monthoption:1",
    },
    urn: "ppb:tbd:cardfilter:month:YEfKQhIAACUAM6Uu/s/1",
  },
  filtersSorting: ["competitionsFilter", "sortOption"],
};

const EXPECTED_DATA = {
  dateRangeFilter: {
    availableOptions: [
      {
        name: "Tomorrow's Racing",
        urn: "ppb:tbd:daterangeoption:YEfKQhIAACUAM6Uu/s/1|X_izlhAAACMAo5Ex",
      },
    ],
    defaultOption: {
      name: "Tomorrow's Racing",
      urn: "ppb:tbd:daterangeoption:YEfKQhIAACUAM6Uu/s/1|X_izlhAAACMAo5Ex",
    },
    urn: "ppb:tbd:cardfilter:daterange:YEfKQhIAACUAM6Uu/s/1",
  },
  sortOption: {
    availableOptions: [FilteredGroupSort.Rank, FilteredGroupSort.Time],
    defaultOption: FilteredGroupSort.Rank,
  },
  marketTypeFilter: {
    availableOptions: [
      {
        marketType: "ppb:marketType:MATCH_ODDS",
        name: "Match Odds",
      },
    ],
    defaultOption: { marketType: "sportUrn", name: "competition name" },
    urn: "ppb:tbd:cardfilter:markettype:YIA8mBEAACMAMOhA/s/1",
    layout: "PEBBLES",
  },
  competitionsFilter: {
    defaultOptions: [{ urn: "ppb:competition:urn" }],
    topCompetitions: [
      {
        urn: "ppb:competition:urn",
      },
    ],
    urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
  },
  monthFilter: {
    availableOptions: [
      {
        date: "2021-01-01T00:00:00.000Z",
        urn: "ppb:tbd:cardfilter:monthoption:1",
      },
    ],
    defaultOptions: {
      date: "2021-01-01T00:00:00.000Z",
      urn: "ppb:tbd:cardfilter:monthoption:1",
    },
    urn: "ppb:tbd:cardfilter:month:YEfKQhIAACUAM6Uu/s/1",
  },
  countriesFilter: {
    availableOptions: [
      {
        name: "PT",
        urn: "ppb:tbd:cardfilter:countriesoption:1",
      },
    ],
    defaultOptions: {
      name: "PT",
      urn: "ppb:tbd:cardfilter:countriesoption:1",
    },
    urn: "ppb:tbd:cardfilter:countries:YEfKQhIAACUAM6Uu/s/1",
  },
  filtersSorting: ["competitionsFilter", "sortOption"],
};

describe("Filter options normalizer", () => {
  describe("normalizeFilterOptionsFragmentIntoFilterOptions", () => {
    it("should correctly transform and return the data object", () => {
      const data = normalizer(FILTER_OPTIONS_MOCK);

      expect(data).toEqual(EXPECTED_DATA);
    });
  });

  describe("when don't have sortOption", () => {
    it("should transform all the props excepted the sortOption", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        sortOption: null,
      });
      const expectedDataWithoutSortOption = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutSortOption.sortOption;

      expect(data).toEqual(expectedDataWithoutSortOption);
    });
    describe("and sortOption.defaultOption", () => {
      it("should transform all the props with defaultOption undefined", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          sortOption: {
            ...FILTER_OPTIONS_MOCK.sortOption,
            defaultOption: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          sortOption: {
            ...EXPECTED_DATA.sortOption,
            defaultOption: undefined,
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have dateRangeFilter", () => {
    it("should transform all the props excepted the dateRangeFilter", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        dateRangeFilter: null,
      });

      const expectedDataWithoutDateRangeFilter = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutDateRangeFilter.dateRangeFilter;

      expect(data).toEqual(expectedDataWithoutDateRangeFilter);
    });
    describe("and dateRangeFilter.defaultOption", () => {
      it("should transform all the props with dateRangeFilter.defaultOption undefined", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          dateRangeFilter: {
            ...FILTER_OPTIONS_MOCK.dateRangeFilter,
            defaultOption: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          dateRangeFilter: {
            ...EXPECTED_DATA.dateRangeFilter,
            defaultOption: undefined,
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have marketTypeFilter", () => {
    it("should transform all the props excepted the marketTypeFilter", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        marketTypeFilter: null,
      });

      const expectedDataWithoutMarketTypeFilter = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutMarketTypeFilter.marketTypeFilter;

      expect(data).toEqual(expectedDataWithoutMarketTypeFilter);
    });
    describe("and marketTypeFilter.defaultOption", () => {
      it("should transform all the props with marketTypeFilter.defaultOption undefined", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          marketTypeFilter: {
            ...FILTER_OPTIONS_MOCK.marketTypeFilter,
            defaultOption: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          marketTypeFilter: {
            ...EXPECTED_DATA.marketTypeFilter,
            defaultOption: undefined,
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have competitionsFilter", () => {
    it("should transform all the props excepted the competitionsFilter", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        competitionsFilter: null,
      });

      const expectedDataWithoutCompetitionsFilter = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutCompetitionsFilter.competitionsFilter;

      expect(data).toEqual(expectedDataWithoutCompetitionsFilter);
    });
    describe("and competitionsFilter.defaultOptions", () => {
      it("should transform all the props with competitionsFilter.defaultOptions equals to empty array", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          competitionsFilter: {
            ...FILTER_OPTIONS_MOCK.competitionsFilter,
            defaultOptions: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          competitionsFilter: {
            ...EXPECTED_DATA.competitionsFilter,
            defaultOptions: [],
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have countriesFilter", () => {
    it("should transform all the props excepted the countriesFilter", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        countriesFilter: null,
      });

      const expectedDataWithoutCountriesFilter = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutCountriesFilter.countriesFilter;

      expect(data).toEqual(expectedDataWithoutCountriesFilter);
    });
    describe("and countriesFilter.defaultOptions", () => {
      it("should transform all the props with countriesFilter.defaultOptions undefined", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          countriesFilter: {
            ...FILTER_OPTIONS_MOCK.countriesFilter,
            defaultOptions: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          countriesFilter: {
            ...EXPECTED_DATA.countriesFilter,
            defaultOptions: undefined,
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have monthFilter", () => {
    it("should transform all the props excepted the monthFilter", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        monthFilter: null,
      });

      const expectedDataWithoutMonthFilter = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutMonthFilter.monthFilter;

      expect(data).toEqual(expectedDataWithoutMonthFilter);
    });
    describe("and monthFilter.defaultOptions", () => {
      it("should transform all the props with monthFilter.defaultOptions undefined", () => {
        const data = normalizer({
          ...FILTER_OPTIONS_MOCK,
          monthFilter: {
            ...FILTER_OPTIONS_MOCK.monthFilter,
            defaultOptions: undefined,
          },
        });
        const expectedDataWithoutDefaultOption = {
          ...EXPECTED_DATA,
          monthFilter: {
            ...EXPECTED_DATA.monthFilter,
            defaultOptions: undefined,
          },
        };

        expect(data).toEqual(expectedDataWithoutDefaultOption);
      });
    });
  });

  describe("when don't have filtersSorting", () => {
    it("should transform all the props excepted the filtersSorting", () => {
      const data = normalizer({
        ...FILTER_OPTIONS_MOCK,
        filtersSorting: null,
      });
      const expectedDataWithoutFiltersSorting = {
        ...EXPECTED_DATA,
      };

      delete expectedDataWithoutFiltersSorting.filtersSorting;

      expect(data).toEqual(expectedDataWithoutFiltersSorting);
    });
  });
});
