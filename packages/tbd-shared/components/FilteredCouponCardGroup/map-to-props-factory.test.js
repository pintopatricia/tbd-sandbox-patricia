import { FETCH_FILTERED_COUPON } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP } from "@ppb/tbd-store/actions/navigation";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import {
  UI__FILTERS_RESET_CLICK,
  UI__FILTER_APPLY,
  UI__FILTER_CLOSE,
  UI__FILTER_OPEN,
  UI__SELECTED_MARKET_SWITCHER,
  UI__PROMO_DESCRIPTION_TOGGLE,
  UI__SELECTED_DATE_RANGE_FILTER_CHANGED,
  UI__SELECTED_SORT_FILTER_CHANGED,
  UI__SELECTED_COMPETITIONS_FILTER_CHANGED,
  UI__SELECTED_MONTH_FILTER_CHANGED,
  UI__SELECTED_COUNTRIES_FILTER_CHANGED,
} from "@ppb/tbd-store/actions/interface";

import { formatMonthLong } from "@ppb/tbd-store/helpers/dates";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

const getFilteredCouponCardGroupByURN = jest.fn();

jest.mock(
  "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors",
  () => ({
    createFindCouponCardGroupByURNSelector: jest.fn(() => getFilteredCouponCardGroupByURN),
  }),
);

jest.mock("@ppb/tbd-store/helpers/dates", () => ({
  formatMonthLong: jest.fn(() => "month"),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCodeBcp47: "en-GB",
  })),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const sortOptionFilterMock = {
  sortOption: {
    defaultOption: "RANK",
    availableOptions: ["RANK", "TIME"],
    selectedOption: "RANK",
  },
};

const dateRangeFilterMock = {
  dateRangeFilter: {
    defaultOption: { name: "Tomorrow", urn: "ppb:tomorrow:1" },
    selectedOption: { name: "Tomorrow", urn: "ppb:tomorrow:1" },
    availableOptions: [
      { name: "Tomorrow", urn: "ppb:tomorrow:1" },
      { name: "Today", urn: "ppb:today:1" },
    ],
  },
};

const marketTypeFilterMock = {
  marketTypeFilter: {
    defaultOption: { name: "Match Odds", marketType: "ppb:matchodds:1" },
    availableOptions: [
      { name: "Match Odds", marketType: "ppb:matchodds:1" },
      { name: "Over/Under", marketType: "ppb:overunder:1" },
    ],
    layout: "PEBBLES",
  },
};

const competitionsFilterMock = {
  competitionsFilter: {
    urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
    topCompetitions: [
      {
        urn: "ppb:competition:10932509",
        name: "English Premier League",
        sport: "ppb:eventType:1",
        competitionId: 10932509,
      },
    ],
    defaultOptions: [{ name: "Uefa Euro 2020", urn: "ppb:euro2020" }],
  },
};

const filtersSortingMock = ["competitionsFilter", "sortOption"];

const filterOptionsMock = {
  ...sortOptionFilterMock,
  ...competitionsFilterMock,
  ...dateRangeFilterMock,
  filtersSorting: filtersSortingMock,
};

const monthFilterMock = {
  monthFilter: {
    defaultOptions: [{ date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" }],
    urn: "ppb:tbd:cardfilter:month:7",
    availableOptions: [
      { date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" },
      {
        date: "2021-06-01T00:00:00.000Z",
        urn: "ppb:tbd:cardfilter:monthoption:1622505600000",
      },
    ],
    selectedOptions: [{ date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" }],
  },
};

const countriesFilterMock = {
  countriesFilter: {
    defaultOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
    urn: "ppb:tbd:cardfilter:countries:YIFBxxMAACEAQXKm/s/7",
    availableOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
    selectedOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
  },
};

const noDefaultOptionSortFiltersMock = {
  sortOption: {
    availableOptions: ["RANK", "TIME"],
  },
};

const noSelectedOptionSortFiltersMock = {
  sortOption: {
    defaultOption: "RANK",
    availableOptions: ["RANK", "TIME"],
  },
};

const noDefaultOptionDateRangeFiltersMock = {
  dateRangeFilter: {
    availableOptions: [
      { name: "Tomorrow", urn: "ppb:tomorrow:1" },
      { name: "Today", urn: "ppb:today:1" },
    ],
  },
};

const noSelectedOptionDateRangeFiltersMock = {
  dateRangeFilter: {
    defaultOption: { name: "Tomorrow", urn: "ppb:tomorrow:1" },
    availableOptions: [
      { name: "Tomorrow", urn: "ppb:tomorrow:1" },
      { name: "Today", urn: "ppb:today:1" },
    ],
  },
};

const noDefaultOptionMarketTypeFilterMock = {
  marketTypeFilter: {
    defaultOption: undefined,
    availableOptions: [
      { name: "Match Odds", marketType: "ppb:matchodds:1" },
      { name: "Over/Under", marketType: "ppb:overunder:1" },
    ],
    layout: "PEBBLES",
  },
};

const noDefaultOptionMonthFilterMock = {
  monthFilter: {
    defaultOptions: undefined,
    urn: "ppb:tbd:cardfilter:month:7",
    availableOptions: [
      { date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" },
      {
        date: "2021-06-01T00:00:00.000Z",
        urn: "ppb:tbd:cardfilter:monthoption:1622505600000",
      },
    ],
  },
};

const noSelectedOptionMonthFilterMock = {
  monthFilter: {
    urn: "ppb:tbd:cardfilter:month:7",
    availableOptions: [
      { date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" },
      {
        date: "2021-06-01T00:00:00.000Z",
        urn: "ppb:tbd:cardfilter:monthoption:1622505600000",
      },
    ],
    defaultOptions: [{ date: "2021-05-01T00:00:00.000Z", urn: "ppb:tbd:cardfilter:monthoption:1619827200000" }],
  },
};

const noDefaultOptionCountriesFilterMock = {
  countriesFilter: {
    defaultOptions: undefined,
    urn: "ppb:tbd:cardfilter:countries:YIFBxxMAACEAQXKm/s/7",
    availableOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
  },
};

const noSelectedOptionCountriesFilterMock = {
  countriesFilter: {
    urn: "ppb:tbd:cardfilter:countries:YIFBxxMAACEAQXKm/s/7",
    availableOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
    defaultOptions: [{ name: "USA", urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW" }],
  },
};

const stateMock = {
  layouts: {
    cardgroups: {
      couponcardgroups: {
        fakeCouponCardGroup: {
          urn: "fakeCouponCardGroupdefault",
        },
      },
      filteredcouponcardgroups: {
        fakeGamingCardGroupUrn: {
          urn: "fakeGamingCardGroupUrn",
        },
      },
    },
    cards: {
      eventmarkets: ["eventMarkets"],
    },
  },
  router: { currentUrl: "" },
};

const viewAllMock = { viewUrn: "urn", viewUrl: "url", viewDisplayMode: "BLANK_BROWSER" };

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should call getFilteredCouponCardGroupByURN", () => {
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(stateMock, { urn: "cardgroupURN" });

    expect(getFilteredCouponCardGroupByURN).toHaveBeenCalledWith(stateMock.layouts.cardgroups, "cardgroupURN");
  });

  describe("when there is no filteredcouponcardgroup", () => {
    it("should return default values", () => {
      const mapStateToProps = makeMapStateToProps();
      getFilteredCouponCardGroupByURN.mockReturnValue(undefined);
      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({});
    });
  });

  describe("when filteredCouponCardGroup is defined", () => {
    describe("and all filters are fully defined", () => {
      it("should return props from store correctly for sortOption", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "FilteredCouponCardGroup",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          pageInfo: {
            hasNextPage: true,
          },
          filterOptions: sortOptionFilterMock,
          viewAll: viewAllMock,
          has90Min: true,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result).toEqual({
          resetText: "I18N.RESET",
          title: "All Matches",
          urn: "cardgroupURN",
          typename: "FilteredCouponCardGroup",
          filters: {
            genericFilters: [
              {
                availableOptions: [
                  {
                    id: "RANK",
                    text: "I18N.SORT.RANK",
                  },
                  {
                    id: "TIME",
                    text: "I18N.SORT.TIME",
                  },
                ],
                defaultOption: {
                  text: "I18N.SORT.RANK",
                  id: "RANK",
                },
                selectedOption: {
                  text: "I18N.SORT.RANK",
                  id: "RANK",
                },
                id: "sortFilter",
                isSingleSelection: true,
                isActive: true,
                isSelected: false,
                title: "I18N.FILTERS.SORT_MATCHES_BY",
                value: "I18N.SORT.RANK",
              },
            ],
            defaultSelections: {
              competitionFilter: undefined,
              countriesFilter: undefined,
              dateRangeFilter: undefined,
              marketTypeFilter: null,
              monthFilter: undefined,
              sortFilter: "RANK",
            },
            filtersByItem: [
              {
                id: "sortFilter",
                isActive: true,
                isSelected: false,
                sortPriority: undefined,
                value: "I18N.SORT.RANK",
              },
            ],
          },
          refreshFilters: {
            marketType: null,
            competitions: null,
            dateRange: null,
          },
          hasMaxNumberOfEvents: true,
          viewAll: viewAllMock,
          hasResults: true,
          noResultsLabel: "I18N.ALL_MATCHES.NO_RESULTS",
          noResultsResetLabel: "I18N.ALL_MATCHES.NO_RESULTS_RESET",
          noResultsSuggestionLabel: "I18N.ALL_MATCHES.NO_RESULTS_SUGGESTION",
          marketSwitcherTitle: "I18N.FILTERS.SELECT_MARKET",
          notificationDetailLabel: "I18N.NOTIFICATION.FILTER_WARNING_MESSAGE",
          notificationMessageLabel: "I18N.NOTIFICATION.FILTER_WARNING_TITLE",
          has90Min: true,
        });
      });

      it("should return props from store correctly for dateRange filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: dateRangeFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
          viewAll: viewAllMock,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(i18n).toHaveBeenCalledWith({ key: "Tomorrow" });
        expect(i18n).toHaveBeenCalledWith({ key: "Today" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                { text: "Tomorrow", id: "ppb:tomorrow:1" },
                { text: "Today", id: "ppb:today:1" },
              ],
              defaultOption: {
                id: "ppb:tomorrow:1",
                text: "Tomorrow",
              },
              selectedOption: { text: "Tomorrow", id: "ppb:tomorrow:1" },
              id: "dateRangeFilter",
              isSingleSelection: true,
              isActive: true,
              isSelected: false,
              title: "I18N.FILTERS.SET_DATE_RANGE",
              value: "Tomorrow",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "ppb:tomorrow:1",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "dateRangeFilter",
              isActive: true,
              isSelected: false,
              sortPriority: undefined,
              value: "Tomorrow",
            },
          ],
        });
      });

      it("should return props from store correctly for marketType filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: marketTypeFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
          viewAll: viewAllMock,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [],
          marketTypeFilter: {
            availableOptions: [
              { text: "I18N.FILTERS.MARKET_TYPE_RECOMMENDED", id: "ppb:marketType:RECOMMENDED" },
              { id: "ppb:matchodds:1", text: "Match Odds" },
              { id: "ppb:overunder:1", text: "Over/Under" },
            ],
            defaultOption: {
              id: "ppb:matchodds:1",
              text: "Match Odds",
            },
            id: "marketTypeFilter",
            isSingleSelection: true,
            isActive: true,
            isSelected: false,
            title: "I18N.FILTERS.MARKET_TYPE_TITLE",
            value: "I18N.FILTERS.MARKET_TYPE",
            layout: "PEBBLES",
          },
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: "ppb:matchodds:1",
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [],
        });
      });

      it("should return props from store correctly for competitions filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: competitionsFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              topCompetitions: {
                id: "topCompetitions",
                title: "I18N.FILTERS.TOP_COMPETITIONS",
                items: [
                  {
                    id: "ppb:competition:10932509",
                    isSelected: false,
                    text: "English Premier League",
                  },
                ],
              },
              defaultOptions: [
                {
                  id: "ppb:euro2020",
                  text: "Uefa Euro 2020",
                  isSelected: true,
                },
              ],
              id: "competitionFilter",
              isSingleSelection: false,
              isActive: true,
              isSelected: false,
              title: "I18N.FILTERS.SET_COMPETITIONS",
              value: "I18N.FILTERS.COMPETITIONS",
              numberOfSelectedOptions: 1,
              selectedOptions: [
                {
                  id: "ppb:euro2020",
                  text: "Uefa Euro 2020",
                  isSelected: true,
                },
              ],
            },
          ],
          defaultSelections: {
            competitionFilter: [{ urn: "ppb:euro2020", name: "Uefa Euro 2020" }],
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "competitionFilter",
              isActive: true,
              numberOfSelectedOptions: 1,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.FILTERS.COMPETITIONS",
            },
          ],
        });
        expect(result.refreshFilters).toEqual({
          marketType: null,
          competitions: ["ppb:euro2020"],
          dateRange: null,
        });
      });

      it("should return props from store correctly for month filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: monthFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });
        expect(formatMonthLong).toHaveBeenCalledTimes(4);

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                {
                  id: "ppb:tbd:cardfilter:monthoption:1619827200000",
                  text: "month",
                  isSelected: true,
                },
                {
                  id: "ppb:tbd:cardfilter:monthoption:1622505600000",
                  text: "month",
                  isSelected: false,
                },
              ],
              defaultOptions: [
                {
                  id: "ppb:tbd:cardfilter:monthoption:1619827200000",
                  text: "2021-05-01T00:00:00.000Z",
                  isSelected: true,
                },
              ],
              id: "monthFilter",
              isSingleSelection: false,
              isActive: true,
              isSelected: false,
              title: "I18N.MONTH",
              value: "I18N.MONTH",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: ["ppb:tbd:cardfilter:monthoption:1619827200000"],
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "monthFilter",
              isActive: true,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.MONTH",
            },
          ],
        });
      });

      it("should return props from store correctly for countries filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: countriesFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters.genericFilters).toEqual([
          {
            availableOptions: [
              {
                id: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
                text: "USA",
                isSelected: true,
              },
            ],
            defaultOptions: [
              {
                id: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
                text: "USA",
                isSelected: true,
              },
            ],
            id: "countriesFilter",
            isSingleSelection: false,
            isActive: true,
            isSelected: false,
            title: "I18N.COUNTRIES",
            value: "I18N.COUNTRIES",
          },
        ]);
      });

      describe("and when have filtersSorting defined", () => {
        it("should return correctly the sort priority value", () => {
          const mapStateToProps = makeMapStateToProps();
          getFilteredCouponCardGroupByURN.mockReturnValue({
            typename: "CouponList",
            items: [{ urn: "1.1" }, { urn: "924.1" }],
            title: "All Matches",
            pageInfo: {
              hasNextPage: true,
            },
            filterOptions: filterOptionsMock,
            viewAll: viewAllMock,
            sortPriority: filterOptionsMock,
          });
          const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

          expect(result.filters).toEqual({
            genericFilters: [
              {
                availableOptions: [
                  { text: "Tomorrow", id: "ppb:tomorrow:1" },
                  { text: "Today", id: "ppb:today:1" },
                ],
                defaultOption: {
                  id: "ppb:tomorrow:1",
                  text: "Tomorrow",
                },
                selectedOption: {
                  id: "ppb:tomorrow:1",
                  text: "Tomorrow",
                },
                id: "dateRangeFilter",
                isSingleSelection: true,
                isActive: true,
                isSelected: false,
                title: "I18N.FILTERS.SET_DATE_RANGE",
                value: "Tomorrow",
                sortPriority: -1,
              },
              {
                topCompetitions: {
                  id: "topCompetitions",
                  title: "I18N.FILTERS.TOP_COMPETITIONS",
                  items: [
                    {
                      id: "ppb:competition:10932509",
                      isSelected: false,
                      text: "English Premier League",
                    },
                  ],
                },
                defaultOptions: [
                  {
                    id: "ppb:euro2020",
                    isSelected: true,
                    text: "Uefa Euro 2020",
                  },
                ],
                id: "competitionFilter",
                isSingleSelection: false,
                isActive: true,
                isSelected: false,
                title: "I18N.FILTERS.SET_COMPETITIONS",
                value: "I18N.FILTERS.COMPETITIONS",
                sortPriority: 0,
                numberOfSelectedOptions: 1,
                selectedOptions: [
                  {
                    id: "ppb:euro2020",
                    isSelected: true,
                    text: "Uefa Euro 2020",
                  },
                ],
              },
              {
                availableOptions: [
                  {
                    id: "RANK",
                    text: "I18N.SORT.RANK",
                  },
                  {
                    id: "TIME",
                    text: "I18N.SORT.TIME",
                  },
                ],
                defaultOption: {
                  text: "I18N.SORT.RANK",
                  id: "RANK",
                },
                id: "sortFilter",
                isSingleSelection: true,
                selectedOption: {
                  id: "RANK",
                  text: "I18N.SORT.RANK",
                },
                isActive: true,
                isSelected: false,
                title: "I18N.FILTERS.SORT_MATCHES_BY",
                value: "I18N.SORT.RANK",
                sortPriority: 1,
              },
            ],
            marketTypeFilter: undefined,
            defaultSelections: {
              competitionFilter: [{ urn: "ppb:euro2020", name: "Uefa Euro 2020" }],
              countriesFilter: undefined,
              dateRangeFilter: "ppb:tomorrow:1",
              marketTypeFilter: null,
              monthFilter: undefined,
              sortFilter: "RANK",
            },
            filtersByItem: [
              {
                id: "dateRangeFilter",
                isActive: true,
                isSelected: false,
                sortPriority: -1,
                value: "Tomorrow",
              },
              {
                id: "competitionFilter",
                isActive: true,
                isSelected: false,
                numberOfSelectedOptions: 1,
                sortPriority: 0,
                value: "I18N.FILTERS.COMPETITIONS",
              },
              {
                id: "sortFilter",
                isActive: true,
                isSelected: false,
                sortPriority: 1,
                value: "I18N.SORT.RANK",
              },
            ],
          });
        });
      });

      describe("and `getUserdetails` throws", () => {
        const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

        beforeEach(() => {
          getUserDetails.mockImplementationOnce(() => {
            throw new Error(GET_USER_DETAILS_ERROR);
          });
        });

        it("should call console.error with the error thrown from `getUserDetailsSelector`", () => {
          makeMapStateToProps()(stateMock, {});

          expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
        });

        it("should return an empty object", () => {
          expect(makeMapStateToProps()(stateMock, {})).toEqual({});
        });
      });
    });

    describe("and filters have no defaultOption", () => {
      it("should return props from store correctly for sortOption", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noDefaultOptionSortFiltersMock,
          pageInfo: {
            hasNextPage: false,
          },
          viewAll: viewAllMock,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result).toEqual({
          typename: "CouponList",
          resetText: "I18N.RESET",
          title: "All Matches",
          urn: "cardgroupURN",
          filters: {
            genericFilters: [
              {
                availableOptions: [
                  {
                    id: "RANK",
                    text: "I18N.SORT.RANK",
                  },
                  {
                    id: "TIME",
                    text: "I18N.SORT.TIME",
                  },
                ],
                defaultOption: undefined,
                id: "sortFilter",
                isSingleSelection: true,
                isActive: false,
                isSelected: false,
                title: "I18N.FILTERS.SORT_MATCHES_BY",
                value: "I18N.SORT.RANK",
              },
            ],
            defaultSelections: {
              competitionFilter: undefined,
              countriesFilter: undefined,
              dateRangeFilter: undefined,
              marketTypeFilter: null,
              monthFilter: undefined,
              sortFilter: undefined,
            },
            filtersByItem: [
              {
                id: "sortFilter",
                isActive: false,
                isSelected: false,
                sortPriority: undefined,
                value: "I18N.SORT.RANK",
              },
            ],
          },
          refreshFilters: {
            marketType: null,
            competitions: null,
            dateRange: null,
          },
          hasMaxNumberOfEvents: false,
          viewAll: viewAllMock,
          hasResults: true,
          noResultsLabel: "I18N.ALL_MATCHES.NO_RESULTS",
          noResultsResetLabel: "I18N.ALL_MATCHES.NO_RESULTS_RESET",
          noResultsSuggestionLabel: "I18N.ALL_MATCHES.NO_RESULTS_SUGGESTION",
          marketSwitcherTitle: "I18N.FILTERS.SELECT_MARKET",
          notificationDetailLabel: "I18N.NOTIFICATION.FILTER_WARNING_MESSAGE",
          notificationMessageLabel: "I18N.NOTIFICATION.FILTER_WARNING_TITLE",
          has90Min: false,
        });
      });

      it("should return props from store correctly for dateRange filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noDefaultOptionDateRangeFiltersMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                { text: "Tomorrow", id: "ppb:tomorrow:1" },
                { text: "Today", id: "ppb:today:1" },
              ],
              defaultOption: undefined,
              id: "dateRangeFilter",
              isSingleSelection: true,
              isActive: false,
              isSelected: false,
              title: "I18N.FILTERS.SET_DATE_RANGE",
              value: "I18N.FILTERS.DATE_RANGE",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "dateRangeFilter",
              isActive: false,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.FILTERS.DATE_RANGE",
            },
          ],
        });
      });

      it("should return props from store correctly for competitions filter", () => {
        const mapStateToProps = makeMapStateToProps();
        const competitionsFilterMockNoDefault = {
          competitionsFilter: {
            ...competitionsFilterMock.competitionsFilter,
            defaultOptions: undefined,
          },
        };

        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: competitionsFilterMockNoDefault,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters.genericFilters[0].defaultOptions).toEqual([]);
      });

      it("should return props from store correctly for marketType filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noDefaultOptionMarketTypeFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [],
          marketTypeFilter: {
            availableOptions: [
              { text: "I18N.FILTERS.MARKET_TYPE_RECOMMENDED", id: "ppb:marketType:RECOMMENDED" },
              { id: "ppb:matchodds:1", text: "Match Odds" },
              { id: "ppb:overunder:1", text: "Over/Under" },
            ],
            defaultOption: {
              id: "ppb:marketType:RECOMMENDED",
              text: "I18N.FILTERS.MARKET_TYPE_RECOMMENDED",
            },
            id: "marketTypeFilter",
            isSingleSelection: true,
            isActive: true,
            isSelected: false,
            title: "I18N.FILTERS.MARKET_TYPE_TITLE",
            value: "I18N.FILTERS.MARKET_TYPE",
            layout: "PEBBLES",
          },
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: "ppb:marketType:RECOMMENDED",
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [],
        });
        expect(result.refreshFilters).toEqual({
          marketType: null,
          competitions: null,
          dateRange: null,
        });
      });

      it("should return props from store correctly for month filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noDefaultOptionMonthFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                {
                  id: "ppb:tbd:cardfilter:monthoption:1619827200000",
                  text: "month",
                  isSelected: false,
                },
                {
                  id: "ppb:tbd:cardfilter:monthoption:1622505600000",
                  text: "month",
                  isSelected: false,
                },
              ],
              defaultOptions: [],
              id: "monthFilter",
              isSingleSelection: false,
              isActive: false,
              isSelected: false,
              title: "I18N.MONTH",
              value: "I18N.MONTH",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "monthFilter",
              isActive: false,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.MONTH",
            },
          ],
        });
      });

      it("should return props from store correctly for countries filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noDefaultOptionCountriesFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                {
                  id: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
                  text: "USA",
                  isSelected: false,
                },
              ],
              defaultOptions: [],
              id: "countriesFilter",
              isSingleSelection: false,
              isActive: false,
              isSelected: false,
              title: "I18N.COUNTRIES",
              value: "I18N.COUNTRIES",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "countriesFilter",
              isActive: false,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.COUNTRIES",
            },
          ],
        });
      });
    });

    describe("and filters have no selecteOptions", () => {
      it("should return props from store correctly for no selected sortOption", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noSelectedOptionSortFiltersMock,
          pageInfo: {
            hasNextPage: false,
          },
          viewAll: viewAllMock,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result).toEqual({
          typename: "CouponList",
          resetText: "I18N.RESET",
          title: "All Matches",
          urn: "cardgroupURN",
          filters: {
            genericFilters: [
              {
                availableOptions: [
                  {
                    id: "RANK",
                    text: "I18N.SORT.RANK",
                  },
                  {
                    id: "TIME",
                    text: "I18N.SORT.TIME",
                  },
                ],
                defaultOption: {
                  id: "RANK",
                  text: "I18N.SORT.RANK",
                },
                id: "sortFilter",
                isSingleSelection: true,
                isActive: true,
                isSelected: false,
                title: "I18N.FILTERS.SORT_MATCHES_BY",
                value: "I18N.SORT.RANK",
              },
            ],
            defaultSelections: {
              competitionFilter: undefined,
              countriesFilter: undefined,
              dateRangeFilter: undefined,
              marketTypeFilter: null,
              monthFilter: undefined,
              sortFilter: "RANK",
            },
            filtersByItem: [
              {
                id: "sortFilter",
                isActive: true,
                isSelected: false,
                sortPriority: undefined,
                selectedOption: undefined,
                value: "I18N.SORT.RANK",
              },
            ],
          },
          refreshFilters: {
            marketType: null,
            competitions: null,
            dateRange: null,
          },
          hasMaxNumberOfEvents: false,
          viewAll: viewAllMock,
          hasResults: true,
          noResultsLabel: "I18N.ALL_MATCHES.NO_RESULTS",
          noResultsResetLabel: "I18N.ALL_MATCHES.NO_RESULTS_RESET",
          noResultsSuggestionLabel: "I18N.ALL_MATCHES.NO_RESULTS_SUGGESTION",
          marketSwitcherTitle: "I18N.FILTERS.SELECT_MARKET",
          notificationDetailLabel: "I18N.NOTIFICATION.FILTER_WARNING_MESSAGE",
          notificationMessageLabel: "I18N.NOTIFICATION.FILTER_WARNING_TITLE",
          has90Min: false,
        });
      });

      it("should return props from store correctly for no selected dateRange filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noSelectedOptionDateRangeFiltersMock,
          pageInfo: {
            hasNextPage: false,
          },
          viewAll: viewAllMock,
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                { text: "Tomorrow", id: "ppb:tomorrow:1" },
                { text: "Today", id: "ppb:today:1" },
              ],
              defaultOption: { text: "Tomorrow", id: "ppb:tomorrow:1" },
              selectedOption: undefined,
              id: "dateRangeFilter",
              isSingleSelection: true,
              isActive: true,
              isSelected: false,
              title: "I18N.FILTERS.SET_DATE_RANGE",
              value: "Tomorrow",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "ppb:tomorrow:1",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "dateRangeFilter",
              isActive: true,
              isSelected: false,
              sortPriority: undefined,
              value: "Tomorrow",
            },
          ],
        });
        expect(result.refreshFilters).toEqual({
          marketType: null,
          competitions: null,
          dateRange: "ppb:tomorrow:1",
        });
      });

      it("should return props from store correctly for month filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noSelectedOptionMonthFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                {
                  id: "ppb:tbd:cardfilter:monthoption:1619827200000",
                  text: "month",
                  isSelected: true,
                },
                {
                  id: "ppb:tbd:cardfilter:monthoption:1622505600000",
                  text: "month",
                  isSelected: false,
                },
              ],
              defaultOptions: [
                {
                  text: "2021-05-01T00:00:00.000Z",
                  id: "ppb:tbd:cardfilter:monthoption:1619827200000",
                  isSelected: true,
                },
              ],
              id: "monthFilter",
              isSingleSelection: false,
              isActive: true,
              isSelected: false,
              title: "I18N.MONTH",
              value: "I18N.MONTH",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: ["ppb:tbd:cardfilter:monthoption:1619827200000"],
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "monthFilter",
              isActive: true,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.MONTH",
            },
          ],
        });
      });

      it("should return props from store correctly for countries filter", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }, { urn: "924.1" }],
          title: "All Matches",
          filterOptions: noSelectedOptionCountriesFilterMock,
          pageInfo: {
            hasNextPage: false,
          },
        });
        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result.filters).toEqual({
          genericFilters: [
            {
              availableOptions: [
                {
                  id: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
                  text: "USA",
                  isSelected: true,
                },
              ],
              defaultOptions: [
                { text: "USA", id: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW", isSelected: true },
              ],
              id: "countriesFilter",
              isSingleSelection: false,
              isActive: true,
              isSelected: false,
              title: "I18N.COUNTRIES",
              value: "I18N.COUNTRIES",
            },
          ],
          defaultSelections: {
            competitionFilter: undefined,
            countriesFilter: ["ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW"],
            dateRangeFilter: undefined,
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          },
          filtersByItem: [
            {
              id: "countriesFilter",
              isActive: true,
              isSelected: false,
              sortPriority: undefined,
              value: "I18N.COUNTRIES",
            },
          ],
        });
      });
    });

    describe("when route is inplay", () => {
      it("should return empty title when route is inplay", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }],
          title: "ShouldNotShow",
          filterOptions: {},
          pageInfo: { hasNextPage: false },
        });

        const stateWithInplay = {
          ...stateMock,
          router: { currentUrl: "/some/path/inplay" },
        };

        const result = mapStateToProps(stateWithInplay, { urn: "cardgroupURN" });

        expect(result.title).toBe("");
      });
    });
    describe("when route is not inplay", () => {
      it("should return card group's title when route is not inplay", () => {
        const mapStateToProps = makeMapStateToProps();
        getFilteredCouponCardGroupByURN.mockReturnValue({
          typename: "CouponList",
          items: [{ urn: "1.1" }],
          title: "VisibleTitle",
          filterOptions: {},
          pageInfo: { hasNextPage: false },
        });

        const stateWithoutInplay = {
          ...stateMock,
          router: { currentUrl: "/some/path/other" },
        };

        const result = mapStateToProps(stateWithoutInplay, { urn: "cardgroupURN" });

        expect(result.title).toBe("VisibleTitle");
      });

      describe("when filtered coupon card group has no title", () => {
        it("returns an empty title", () => {
          const mapStateToProps = makeMapStateToProps();
          getFilteredCouponCardGroupByURN.mockReturnValue({
            typename: "CouponList",
            items: [{ urn: "1.1" }],
            filterOptions: {},
            pageInfo: { hasNextPage: false },
          });
          const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });
          expect(result.title).toBe("");
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchFilteredCoupon", () => {
    describe("when sortBy is undefined", () => {
      it("should dispatch the filtered coupon action with sortOption as undefined", () => {
        const { dispatchFetchFilteredCoupon } = mapDispatchToProps;

        const urn = "urn:fake";
        const filterUrn = "filter:urn:fake";

        expect(dispatchFetchFilteredCoupon(urn, { dateRangeFilter: filterUrn })).toEqual({
          payload: {
            filterBy: {
              dateRange: "filter:urn:fake",
              marketType: null,
            },
            sortBy: undefined,
            urn: "urn:fake",
          },
          type: FETCH_FILTERED_COUPON,
        });
      });
    });

    describe("when sortBy is defined and is not RANK", () => {
      it("should dispatch the filtered coupon action with sortOption as TIME", () => {
        const { dispatchFetchFilteredCoupon } = mapDispatchToProps;

        const urn = "urn:fake";
        const filterUrn = "filter:urn:fake";
        const sortFilter = "fakeSort";

        expect(dispatchFetchFilteredCoupon(urn, { dateRangeFilter: filterUrn, sortFilter })).toEqual({
          payload: {
            filterBy: {
              dateRange: "filter:urn:fake",
              marketType: null,
            },
            sortBy: "TIME",
            urn: "urn:fake",
          },
          type: FETCH_FILTERED_COUPON,
        });
      });
    });

    describe("when sortBy is RANK", () => {
      it("should dispatch the filtered coupon action with sortOption as RANK", () => {
        const { dispatchFetchFilteredCoupon } = mapDispatchToProps;

        const urn = "urn:fake";
        const filterUrn = "filter:urn:fake";
        const sortFilter = "RANK";

        expect(dispatchFetchFilteredCoupon(urn, { dateRangeFilter: filterUrn, sortFilter })).toEqual({
          payload: {
            filterBy: {
              dateRange: "filter:urn:fake",
              marketType: null,
            },
            sortBy: "RANK",
            urn: "urn:fake",
          },
          type: FETCH_FILTERED_COUPON,
        });
      });
    });

    describe("when all filters are defined", () => {
      it("should dispatch the filtered coupon action", () => {
        const { dispatchFetchFilteredCoupon } = mapDispatchToProps;

        const urn = "urn:fake";
        const filterUrn = "filter:urn:fake";

        expect(
          dispatchFetchFilteredCoupon(urn, {
            sortFilter: "RANK",
            dateRangeFilter: filterUrn,
            marketTypeFilter: filterUrn,
          }),
        ).toEqual({
          payload: {
            filterBy: {
              dateRange: "filter:urn:fake",
              marketType: "filter:urn:fake",
            },
            sortBy: "RANK",
            urn: "urn:fake",
          },
          type: FETCH_FILTERED_COUPON,
        });
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      const viewLink = { viewUrn: "urn", viewUrl: "url", viewDisplayMode: "BLANK_BROWSER" };

      expect(dispatchPushAction(viewLink)).toEqual({
        payload: viewLink,
        type: PUSH,
      });
    });
  });

  describe("dispatchViewAllTap", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchViewAllTap } = mapDispatchToProps;

      const viewLink = { viewUrn: "urn", viewUrl: "url", viewDisplayMode: "BLANK_BROWSER" };
      const viewAll = { label: "label", viewLink };

      expect(dispatchViewAllTap("title", viewAll, "urn")).toEqual({
        payload: {
          title: "title",
          viewAllLink: viewAll,
          cardgroupURN: "urn",
        },
        type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
      });
    });
  });

  describe("dispatchFilterOpenEvent", () => {
    it("should dispatch the filter open action with correct payload", () => {
      const { dispatchFilterOpenEvent } = mapDispatchToProps;

      const label = "fake-label";

      expect(dispatchFilterOpenEvent(label)).toEqual({
        type: UI__FILTER_OPEN,
        payload: { label },
      });
    });
  });

  describe("dispatchFilterCloseEvent", () => {
    it("should dispatch the filter close action", () => {
      const { dispatchFilterCloseEvent } = mapDispatchToProps;

      expect(dispatchFilterCloseEvent()).toEqual({
        type: UI__FILTER_CLOSE,
      });
    });
  });

  describe("dispatchFilterApplyEvent", () => {
    it("should dispatch the filter apply action with correct payload", () => {
      const { dispatchFilterApplyEvent } = mapDispatchToProps;

      const selectedOptions = ["fake-option-1", "fake-option-2"];
      const module = "pebbles";

      expect(dispatchFilterApplyEvent(selectedOptions, module)).toEqual({
        type: UI__FILTER_APPLY,
        payload: {
          selectedOptions,
          module,
        },
      });
    });
  });

  describe("dispatchFilterResetClickEvent", () => {
    it("should dispatch the filter reset action with correct payload", () => {
      const { dispatchFilterResetClickEvent } = mapDispatchToProps;

      const label = "fake-reset-label";

      expect(dispatchFilterResetClickEvent(label)).toEqual({
        type: UI__FILTERS_RESET_CLICK,
        payload: { label },
      });
    });
  });

  describe("dispatchSelectedMarketSwitcherFilter", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedMarketSwitcherFilter } = mapDispatchToProps;

      const currentSelection = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOption: {
          marketType: "ppb:marketType:BOTH_TEAMS_TO_SCORE",
          name: "Both Teams To Score",
        },
      };

      expect(dispatchSelectedMarketSwitcherFilter(currentSelection)).toEqual({
        type: UI__SELECTED_MARKET_SWITCHER,
        payload: currentSelection,
      });
    });
  });

  describe("dispatchSelectedDateRangeFilterChanged", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedDateRangeFilterChanged } = mapDispatchToProps;

      const selectedOption = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOption: {
          urn: "ppb:tbd:daterangeoption:cHBiOnRiZDpjYX",
          name: "Today",
        },
      };

      expect(dispatchSelectedDateRangeFilterChanged(selectedOption)).toEqual({
        type: UI__SELECTED_DATE_RANGE_FILTER_CHANGED,
        payload: selectedOption,
      });
    });
  });

  describe("dispatchSelectedSortFilterChanged", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedSortFilterChanged } = mapDispatchToProps;

      const selectedOption = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOption: "RANK",
      };

      expect(dispatchSelectedSortFilterChanged(selectedOption)).toEqual({
        type: UI__SELECTED_SORT_FILTER_CHANGED,
        payload: selectedOption,
      });
    });
  });

  describe("dispatchSelectedCompetitionsFilterChanged", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedCompetitionsFilterChanged } = mapDispatchToProps;

      const selectedOptions = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOptions: [
          { name: "Spanish La Liga", urn: "ppb:competition:512051" },
          { name: "Italian Serie A", urn: "ppb:competition:554973" },
        ],
      };

      expect(dispatchSelectedCompetitionsFilterChanged(selectedOptions)).toEqual({
        type: UI__SELECTED_COMPETITIONS_FILTER_CHANGED,
        payload: selectedOptions,
      });
    });
  });

  describe("dispatchSelectedMonthFilterChanged", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedMonthFilterChanged } = mapDispatchToProps;

      const selectedOptions = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOptions: [
          { date: "June", urn: "ppb:tbd:cardfilter:monthoption:1748732400000" },
          { date: "July", urn: "ppb:tbd:cardfilter:monthoption:1751324400000" },
        ],
      };

      expect(dispatchSelectedMonthFilterChanged(selectedOptions)).toEqual({
        type: UI__SELECTED_MONTH_FILTER_CHANGED,
        payload: selectedOptions,
      });
    });
  });

  describe("dispatchSelectedCountriesFilterChanged", () => {
    it("should dispatch the push action with correct payload", () => {
      const { dispatchSelectedCountriesFilterChanged } = mapDispatchToProps;

      const selectedOptions = {
        urn: "ppb:tbd:cardgroup:filtered:YKUhHBAAACQA54Wr/s/1",
        selectedOptions: [
          { name: "France", urn: "ppb:tbd:cardfilter:countriesoption:ZmwbrhEAAB4Avk0M/s/7" },
          { name: "South Africa", urn: "ppb:tbd:cardfilter:countriesoption:Zmwb_BEAAB8Avk2Q/s/7" },
        ],
      };

      expect(dispatchSelectedCountriesFilterChanged(selectedOptions)).toEqual({
        type: UI__SELECTED_COUNTRIES_FILTER_CHANGED,
        payload: selectedOptions,
      });
    });
  });

  describe("dispatchTogglePromoDescription", () => {
    it("should have the correct type and payload", () => {
      const { dispatchTogglePromoDescription } = mapDispatchToProps;

      expect(dispatchTogglePromoDescription("90 min", true)).toEqual({
        type: UI__PROMO_DESCRIPTION_TOGGLE,
        payload: {
          title: "90 min",
          isOpen: true,
          variant: "90 minutes",
        },
      });
    });
  });
});
