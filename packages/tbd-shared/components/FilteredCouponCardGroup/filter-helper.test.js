import { renderHook, act } from "@testing-library/react";
import { isCompetitionFilter, isMultipleFilter, isSingleFilter, useFilters } from "./filter-helper";
import { sortFilters } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("./map-to-props-factory", () => ({
  sortFilters: jest.fn((items) => items.sort((a, b) => a.sortPriority - b.sortPriority)),
}));

const filterMock = (type, single = false) => ({
  id: type,
  value: "value",
  isSelected: false,
  isActive: false,
  isSingleSelection: single,
  title: "fake title",
});

const filtersMock = [
  {
    id: "sortFilter",
    value: "filter sort",
    isSelected: false,
    isActive: false,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
      { id: "fake:filter:1:option:urn:2", text: "filter 1 option 2" },
    ],
    defaultOption: { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
  },
  {
    id: "dateRangeFilter",
    value: "filter date",
    isSelected: false,
    isActive: false,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:2:option:urn:1", text: "filter 2 option 1" },
      { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
    ],
    defaultOption: { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
  },
];

const filtersByItemMock = [
  {
    id: "sortFilter",
    value: "filter sort",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
  {
    id: "dateRangeFilter",
    value: "filter date",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
];

const sortFiltersMock = [
  {
    id: "sortFilter",
    value: "filter sort",
    isSelected: false,
    isActive: false,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
      { id: "fake:filter:1:option:urn:2", text: "filter 1 option 2" },
    ],
    defaultOption: { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
  },
];

const sortByItemMock = [
  {
    id: "sortFilter",
    value: "filter sort",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
];

const competitionsFiltersMock = [
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "set competitions",
    defaultOptions: [{ id: "fake:filter:3:option:urn:3" }],
    sortPriority: 0,
  },
];

const competitionsByItemMock = [
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    sortPriority: 0,
  },
];

const monthFiltersMock = [
  {
    id: "monthFilter",
    value: "Months",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "Months",
    defaultOptions: [{ id: "fake:filter:4:option:urn:4", text: "fake4" }],
    availableOptions: [{ id: "fake:filter:4:option:urn:4", text: "fake4" }],
  },
];

const monthByItemMock = [
  {
    id: "monthFilter",
    value: "Months",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
];

const countriesFiltersMock = [
  {
    id: "countriesFilter",
    value: "Countries",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "Countries",
    defaultOptions: [{ id: "fake:filter:5:option:urn:5", text: "fake5" }],
    availableOptions: [{ id: "fake:filter:5:option:urn:5", text: "fake5" }],
  },
];

const countriesByItemMock = [
  {
    id: "countriesFilter",
    value: "Countries",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
    availableOptions: [],
  },
];

const dateRangeFiltersMock = [
  {
    id: "dateRangeFilter",
    value: "filter date",
    isSelected: false,
    isActive: false,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:2:option:urn:1", text: "filter 2 option 1" },
      { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
    ],
    defaultOption: { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
  },
];

const dateRangeByItemMock = [
  {
    id: "dateRangeFilter",
    value: "filter date",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
];

const filtersWithMonthAndCountriesMock = [
  {
    id: "monthFilter",
    value: "Months",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "Months",
    defaultOptions: [{ id: "fake:filter:4:option:urn:4" }],
    availableOptions: [],
  },
  {
    id: "countriesFilter",
    value: "Countries",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "Countries",
    defaultOptions: [{ id: "fake:filter:5:option:urn:5" }],
    availableOptions: [],
  },
];

const filtersByItemWithMonthAndCountriesMock = [
  {
    id: "monthFilter",
    value: "Months",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
  },
  {
    id: "countriesFilter",
    value: "Countries",
    isSelected: false,
    isActive: false,
    sortPriority: undefined,
    availableOptions: [],
  },
];

const filtersWithSortPriorityCompetitionMock = [
  {
    ...filtersMock[0],
    sortPriority: 1,
    isActive: true,
  },
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "set competitions",
    defaultOptions: [{ id: "fake:filter:3:option:urn:3" }],
    sortPriority: 0,
  },
  {
    ...filtersMock[1],
    sortPriority: undefined,
    isActive: true,
  },
  {
    ...filtersWithMonthAndCountriesMock[0],
    sortPriority: undefined,
    isActive: true,
  },
];

const filtersByItemWithSortPrioryCompetitionMock = [
  {
    id: "sortFilter",
    value: "filter sort",
    isSelected: false,
    isActive: true,
    sortPriority: 1,
  },
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    sortPriority: 0,
  },
  {
    id: "dateRangeFilter",
    value: "filter date",
    isSelected: false,
    isActive: true,
    sortPriority: undefined,
  },
  {
    id: "monthFilter",
    value: "Months",
    isSelected: false,
    isActive: true,
    sortPriority: undefined,
  },
];

const filtersWithCompetitionMock = [
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "set competitions",
    defaultOptions: [{ id: "fake:filter:3:option:urn:3" }],
    sortPriority: 0,
  },
];

const filtersByItemWithCompetitionMock = [
  {
    id: "competitionFilter",
    value: "competitions",
    isSelected: false,
    isActive: false,
    sortPriority: 0,
  },
];

const marketFilterMock = {
  id: "marketTypeFilter",
  value: "Market Type",
  isSelected: false,
  isActive: false,
  isSingleSelection: true,
  title: "Set Market",
  availableOptions: [
    { id: "fake:filter:market:option:urn:1", text: "filter market option 1" },
    { id: "fake:filter:market:option:urn:2", text: "filter market option 2" },
    { id: "fake:filter:market:option:urn:3", text: "filter market option 3" },
  ],
  defaultOption: { id: "fake:filter:market:option:urn:1", text: "filter market option 1" },
};

const defaultSelectionsMock = {
  competitionFilter: undefined,
  countriesFilter: undefined,
  dateRangeFilter: "fake:filter:2:option:urn:2",
  marketTypeFilter: null,
  monthFilter: undefined,
  sortFilter: undefined,
};

const baseSelectionsMock = {
  competitionFilter: undefined,
  countriesFilter: undefined,
  dateRangeFilter: undefined,
  marketTypeFilter: null,
  monthFilter: undefined,
  sortFilter: undefined,
};

const defaultSortSelectionsMock = {
  ...baseSelectionsMock,
  sortFilter: "fake:filter:1:option:urn:1",
};
const defaultCompetitionsSelectionsMock = {
  ...baseSelectionsMock,
  competitionFilter: ["fake:filter:3:option:urn:3"],
};
const defaultMonthSelectionsMock = {
  ...baseSelectionsMock,
  monthFilter: ["fake:filter:4:option:urn:4"],
};
const defaultCountriesSelectionsMock = {
  ...baseSelectionsMock,
  countriesFilter: ["fake:filter:5:option:urn:5"],
};

const dispatchFetchFilteredCouponMock = jest.fn();
const dispatchFilterOpenEventMock = jest.fn();
const dispatchFilterCloseEventMock = jest.fn();
const dispatchFilterApplyEventMock = jest.fn();
const dispatchFilterResetClickEventMock = jest.fn();
const dispatchSelectedMarketSwitcherFilterMock = jest.fn();
const dispatchSelectedDateRangeFilterChangedMock = jest.fn();
const dispatchSelectedSortFilterChangedMock = jest.fn();
const dispatchSelectedCompetitionsFilterChangedMock = jest.fn();
const dispatchSelectedMonthFilterChangedMock = jest.fn();
const dispatchSelectedCountriesFilterChangedMock = jest.fn();

const renderUseFilters = ({
  filters = {
    genericFilters: filtersMock,
    marketTypeFilter: marketFilterMock,
    defaultSelections: defaultSelectionsMock,
    filtersByItem: filtersByItemMock,
  },
  urn = "ppb:urn:filter:1:option:1",
  dispatchFetchFilteredCoupon = dispatchFetchFilteredCouponMock,
  dispatchFilterOpenEvent = dispatchFilterOpenEventMock,
  dispatchFilterCloseEvent = dispatchFilterCloseEventMock,
  dispatchFilterApplyEvent = dispatchFilterApplyEventMock,
  dispatchFilterResetClickEvent = dispatchFilterResetClickEventMock,
  dispatchSelectedMarketSwitcherFilter = dispatchSelectedMarketSwitcherFilterMock,
  dispatchSelectedDateRangeFilterChanged = dispatchSelectedDateRangeFilterChangedMock,
  dispatchSelectedSortFilterChanged = dispatchSelectedSortFilterChangedMock,
  dispatchSelectedCompetitionsFilterChanged = dispatchSelectedCompetitionsFilterChangedMock,
  dispatchSelectedMonthFilterChanged = dispatchSelectedMonthFilterChangedMock,
  dispatchSelectedCountriesFilterChanged = dispatchSelectedCountriesFilterChangedMock,
} = {}) => {
  const { result } = renderHook(() =>
    useFilters(
      filters,
      urn,
      dispatchFetchFilteredCoupon,
      dispatchFilterOpenEvent,
      dispatchFilterCloseEvent,
      dispatchFilterApplyEvent,
      dispatchFilterResetClickEvent,
      dispatchSelectedMarketSwitcherFilter,
      dispatchSelectedDateRangeFilterChanged,
      dispatchSelectedSortFilterChanged,
      dispatchSelectedCompetitionsFilterChanged,
      dispatchSelectedMonthFilterChanged,
      dispatchSelectedCountriesFilterChanged,
    ),
  );

  return result;
};

describe("Filter Helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("isCompetitionFilter", () => {
    describe("when is a competition filter", () => {
      it("should be true", () => {
        const result = isCompetitionFilter(filterMock("competitionFilter"));
        expect(result).toBeTruthy();
      });

      describe("and filter is null", () => {
        it("should be false", () => {
          const result = isCompetitionFilter(null);
          expect(result).toBeFalsy();
        });
      });
    });

    describe("when is not a competition filter", () => {
      it("should be false", () => {
        const result = isCompetitionFilter(filterMock("dateRangeFilter"));
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isMultipleFilter", () => {
    describe("when is a multiple filter", () => {
      it("should be true", () => {
        const result = isMultipleFilter(filterMock("countriesFilter"));
        expect(result).toBeTruthy();
      });

      describe("and filter is null", () => {
        it("should be false", () => {
          const result = isMultipleFilter(null);
          expect(result).toBeFalsy();
        });
      });
    });

    describe("when is not a multiple filter", () => {
      it("should be false", () => {
        const result = isMultipleFilter(filterMock("competitionFilter"));
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isSingleFilter", () => {
    describe("when is a single filter", () => {
      it("should be true", () => {
        const result = isSingleFilter(filterMock("dateRangeFilter", true));
        expect(result).toBeTruthy();
      });

      describe("and filter is null", () => {
        it("should be false", () => {
          const result = isSingleFilter(null);
          expect(result).toBeFalsy();
        });
      });
    });

    describe("when is not a single filter", () => {
      it("should be false", () => {
        const result = isSingleFilter(filterMock("countriesFilter"));
        expect(result).toBeFalsy();
      });
    });
  });

  describe("useFilters", () => {
    describe("onFilterTap", () => {
      const setupOnFilterTap = () => {
        const result = renderUseFilters();
        act(() => result.current.onFilterTap("sortFilter", "filter sort"));

        return result;
      };

      it("should call dispatchFilterOpenEvent", () => {
        setupOnFilterTap();
        expect(dispatchFilterOpenEventMock).toHaveBeenCalledWith("filter sort");
      });

      it("should return filterByState updated", () => {
        const result = setupOnFilterTap();

        expect(result.current.filterByState).toEqual([
          { id: "sortFilter", isActive: false, isSelected: true, value: "filter sort" },
          { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter date" },
        ]);

        expect(result.current.filterByState[0].isSelected).not.toEqual(filtersMock[0].isSelected);
      });

      it("should return currentFilter updated with sort filter options", () => {
        const result = setupOnFilterTap();

        expect(result.current.currentFilter).toEqual({
          availableOptions: [
            {
              id: "fake:filter:1:option:urn:1",
              text: "filter 1 option 1",
            },
            {
              id: "fake:filter:1:option:urn:2",
              text: "filter 1 option 2",
            },
          ],
          defaultOption: {
            id: "fake:filter:1:option:urn:1",
            text: "filter 1 option 1",
          },
          id: "sortFilter",
          isActive: false,
          isSelected: false,
          isSingleSelection: true,
          title: "filter title",
          value: "filter sort",
        });
      });

      it("should modal be open", () => {
        const result = setupOnFilterTap();

        expect(result.current.isModalClosed).toBeFalsy();
      });
    });

    describe("onMarketTypeFilterTap", () => {
      let result;
      describe("when id is not provided (list/modal layout)", () => {
        beforeEach(() => {
          result = renderUseFilters({
            filters: {
              genericFilters: [],
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultSelectionsMock,
              filtersByItem: [],
            },
          });
          act(() => result.current.onMarketTypeFilterTap("filter market"));
        });

        it("should call dispatchFilterOpenEvent", () => {
          expect(dispatchFilterOpenEventMock).toHaveBeenCalledWith("filter market");
        });

        it("should return empty filterByState", () => {
          expect(result.current.filterByState.length).toBe(0);
        });

        it("should return currentFilter updated with sort filter options", () => {
          expect(result.current.currentFilter).toEqual({
            availableOptions: [
              {
                id: "fake:filter:market:option:urn:1",
                text: "filter market option 1",
              },
              {
                id: "fake:filter:market:option:urn:2",
                text: "filter market option 2",
              },
              {
                id: "fake:filter:market:option:urn:3",
                text: "filter market option 3",
              },
            ],
            defaultOption: {
              id: "fake:filter:market:option:urn:1",
              text: "filter market option 1",
            },
            id: "marketTypeFilter",
            isActive: false,
            isSelected: false,
            isSingleSelection: true,
            title: "Set Market",
            value: "Market Type",
          });
        });

        it("should modal be open", () => {
          expect(result.current.isModalClosed).toBeFalsy();
        });
      });

      describe("when id is provided (pebbles layout)", () => {
        beforeEach(() => {
          result = renderUseFilters({
            filters: {
              genericFilters: [],
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultSelectionsMock,
              filtersByItem: [],
            },
          });
          act(() => result.current.onMarketTypeFilterTap("filter market", "fake:filter:market:option:urn:3"));
        });

        it("should not call dispatchFilterOpenEvent", () => {
          expect(dispatchFilterOpenEventMock).not.toHaveBeenCalled();
        });

        it("should not change the modal state", () => {
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should call the onApply function (dispatchSelectedMarketSwitcherFilterMock)", () => {
          expect(dispatchSelectedMarketSwitcherFilterMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOption: {
              marketType: "fake:filter:market:option:urn:3",
              name: "filter market option 3",
            },
          });
        });

        it("should call the onApply function (dispatchFilterApplyEvent)", () => {
          expect(dispatchFilterApplyEventMock).toHaveBeenCalledWith(["filter market option 3"], "pebbles");
        });
      });
    });

    describe("onApply", () => {
      describe("when has a currentFilter", () => {
        const setupWithCurrentFilter = () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: filtersMock,
              marketTypeFilter: {},
              filtersByItem: filtersByItemMock,
              defaultSelections: defaultSelectionsMock,
            },
          });
          act(() => {
            result.current.onFilterTap("sortFilter", "filter sort");
          });
          act(() =>
            result.current.onApply(
              ["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"],
              ["filter 2 option 1", "filter 2 option 2"],
            ),
          );

          return result;
        };

        it("should return filterByState updated", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.filterByState).toEqual([
            { id: "sortFilter", isActive: true, isSelected: false, value: "filter 2 option 1" },
            { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter date" },
          ]);

          expect(result.current.filterByState[0].isActive).not.toEqual(filtersMock[0].isActive);
        });

        it("should return currentSelections updated", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.currentSelections).toEqual({
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: "fake:filter:2:option:urn:1",
          });
        });

        it("should modal be close", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should call dispatchFetchFilteredCoupon", () => {
          setupWithCurrentFilter();
          expect(dispatchFetchFilteredCouponMock).toHaveBeenCalledWith("ppb:urn:filter:1:option:1", {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: "fake:filter:2:option:urn:1",
          });
        });

        it("should call dispatchFilterApplyEvent", () => {
          setupWithCurrentFilter();
          expect(dispatchFilterApplyEventMock).toHaveBeenCalledWith(
            ["filter 2 option 1", "filter 2 option 2"],
            "filter",
          );
        });

        describe("when the currentFilter is dateRange", () => {
          it("should call dispatchSelectedDateRangeFilterChangedMock", () => {
            const result = renderUseFilters({
              filters: {
                genericFilters: dateRangeFiltersMock,
                marketTypeFilter: {},
                filtersByItem: dateRangeByItemMock,
                defaultSelections: defaultSelectionsMock,
              },
            });
            act(() => result.current.onFilterTap("dateRangeFilter"));
            act(() =>
              result.current.onApply(["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"], ["fake1", "fake2"]),
            );

            expect(dispatchSelectedDateRangeFilterChangedMock).toHaveBeenCalledWith({
              urn: "ppb:urn:filter:1:option:1",
              selectedOption: {
                urn: "fake:filter:2:option:urn:1",
                name: "fake1",
              },
            });
          });
        });
      });

      describe("when the currentFilter is sort", () => {
        it("should call dispatchSelectedSortFilterChangedMock", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: sortFiltersMock,
              marketTypeFilter: {},
              filtersByItem: sortByItemMock,
              defaultSelections: defaultSortSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("sortFilter"));
          act(() => result.current.onApply(["TIME"], ["Time"]));

          expect(dispatchSelectedSortFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOption: "TIME",
          });
        });
      });

      describe("when the currentFilter is competition", () => {
        it("should call dispatchSelectedCompetitionsFilterChanged", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: competitionsFiltersMock,
              marketTypeFilter: {},
              filtersByItem: competitionsByItemMock,
              defaultSelections: defaultCompetitionsSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("competitionFilter"));
          act(() =>
            result.current.onApply(["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"], ["fake1", "fake2"]),
          );

          expect(dispatchSelectedCompetitionsFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [
              { name: "fake1", urn: "fake:filter:2:option:urn:1" },
              { name: "fake2", urn: "fake:filter:2:option:urn:2" },
            ],
          });
        });
      });

      describe("when the currentFilter is month", () => {
        it("should call dispatchSelectedMonthFilterChangedMock", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: monthFiltersMock,
              marketTypeFilter: {},
              filtersByItem: monthByItemMock,
              defaultSelections: defaultMonthSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("monthFilter"));
          act(() => result.current.onApply(["fake:filter:4:option:urn:4"], ["fake4"]));

          expect(dispatchSelectedMonthFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [{ date: "fake4", urn: "fake:filter:4:option:urn:4" }],
          });
        });
      });

      describe("when the currentFilter is countries", () => {
        it("should call dispatchSelectedCountriesFilterChangedMock", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: countriesFiltersMock,
              marketTypeFilter: {},
              filtersByItem: countriesByItemMock,
              defaultSelections: defaultCountriesSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("countriesFilter", "Countries"));
          act(() => result.current.onApply(["fake:filter:5:option:urn:5"], ["fake5"]));

          expect(dispatchSelectedCountriesFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [{ name: "fake5", urn: "fake:filter:5:option:urn:5" }],
          });
        });
      });

      describe("when some filters have sortPriory prop defined", () => {
        it("should return filterByState sorted by isActive and sortPriority props", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: filtersWithSortPriorityCompetitionMock,
              marketTypeFilter: {},
              filtersByItem: filtersByItemWithSortPrioryCompetitionMock,
              defaultSelections: defaultSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("competitionFilter", "competitions"));
          act(() =>
            result.current.onApply(["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"], ["fake1", "fake2"]),
          );

          expect(result.current.filterByState).toEqual([
            expect.objectContaining({
              id: "competitionFilter",
              isActive: true,
              sortPriority: 0,
            }),
            expect.objectContaining({
              id: "sortFilter",
              isActive: true,
              sortPriority: 1,
            }),
            expect.objectContaining({
              id: "dateRangeFilter",
              isActive: true,
              sortPriority: undefined,
            }),
            expect.objectContaining({
              id: "monthFilter",
              isActive: true,
              sortPriority: undefined,
            }),
          ]);
        });
      });

      describe("when doesn't have a currentFilter but has a selectedFilter", () => {
        const setupWithCurrentFilter = () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: filtersMock,
              marketTypeFilter: {},
              filtersByItem: filtersByItemMock,
              defaultSelections: defaultSelectionsMock,
            },
          });
          act(() => {
            result.current.onFilterTap("sortFilter", "filter sort");
          });
          act(() =>
            result.current.onApply(
              ["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"],
              ["filter 2 option 1", "filter 2 option 2"],
            ),
          );

          return result;
        };

        it("should return filterByState updated", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.filterByState).toEqual([
            {
              id: "sortFilter",
              isActive: true,
              isSelected: false,
              value: "filter 2 option 1",
              sortPriority: undefined,
            },
            {
              id: "dateRangeFilter",
              isActive: false,
              isSelected: false,
              value: "filter date",
              sortPriority: undefined,
            },
          ]);

          expect(result.current.filterByState[0].isActive).not.toEqual(filtersMock[0].isActive);
        });

        it("should return currentSelections updated", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.currentSelections).toEqual({
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: "fake:filter:2:option:urn:1",
          });
        });

        it("should modal be close", () => {
          const result = setupWithCurrentFilter();
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should call dispatchFetchFilteredCoupon", () => {
          setupWithCurrentFilter();
          expect(dispatchFetchFilteredCouponMock).toHaveBeenCalledWith("ppb:urn:filter:1:option:1", {
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: "fake:filter:2:option:urn:1",
          });
        });

        it("should call dispatchFilterApplyEvent", () => {
          setupWithCurrentFilter();
          expect(dispatchFilterApplyEventMock).toHaveBeenCalledWith(
            ["filter 2 option 1", "filter 2 option 2"],
            "filter",
          );
        });

        describe("when the currentFilter is dateRange", () => {
          it("should call dispatchSelectedDateRangeFilterChangedMock", () => {
            const result = renderUseFilters({
              filters: {
                genericFilters: dateRangeFiltersMock,
                marketTypeFilter: {},
                filtersByItem: dateRangeByItemMock,
                defaultSelections: defaultSelectionsMock,
              },
            });
            act(() => result.current.onFilterTap("dateRangeFilter"));
            act(() =>
              result.current.onApply(["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"], ["fake1", "fake2"]),
            );

            expect(dispatchSelectedDateRangeFilterChangedMock).toHaveBeenCalledWith({
              urn: "ppb:urn:filter:1:option:1",
              selectedOption: {
                urn: "fake:filter:2:option:urn:1",
                name: "fake1",
              },
            });
          });
        });
      });

      describe("when doesn't have a currentFilter or selectedFilter", () => {
        const setupWithoutCurrentFilter = () => {
          const result = renderUseFilters();
          act(() => {
            result.current.onApply(
              ["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"],
              ["filter 2 option 1", "filter 2 option 2"],
            );
          });

          return result;
        };

        it("should return filterByState updated", () => {
          const result = setupWithoutCurrentFilter();
          expect(result.current.filterByState).toEqual([
            { id: "sortFilter", isActive: false, isSelected: false, value: "filter sort" },
            { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter date" },
          ]);

          expect(result.current.filterByState[0].isActive).toEqual(filtersMock[0].isActive);
        });

        it("should return currentSelections updated", () => {
          const result = setupWithoutCurrentFilter();
          expect(result.current.currentSelections).toEqual({
            competitionFilter: undefined,
            countriesFilter: undefined,
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: null,
            monthFilter: undefined,
            sortFilter: undefined,
          });
        });

        it("should modal be closed", () => {
          const result = setupWithoutCurrentFilter();
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should not call dispatchFetchFilteredCoupon", () => {
          setupWithoutCurrentFilter();
          expect(dispatchFetchFilteredCouponMock).not.toHaveBeenCalled();
        });

        it("should not call dispatchFilterApplyEvent", () => {
          setupWithoutCurrentFilter();
          expect(dispatchFilterApplyEventMock).not.toHaveBeenCalled();
        });
      });

      describe("when the currentFilter is marketSwitcher", () => {
        it("should call dispatchSelectedMarketSwitcherFilter", () => {
          const result = renderUseFilters();

          act(() => result.current.onMarketTypeFilterTap("filter market"));
          act(() => {
            result.current.onApply(["fake:filter:market:option:urn:1"], ["filter market option 1"]);
          });

          expect(dispatchSelectedMarketSwitcherFilterMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOption: {
              marketType: "fake:filter:market:option:urn:1",
              name: "filter market option 1",
            },
          });
        });
      });

      describe("when the currentFilter id is whitelisted to have a numberOfSelectedOptions counter", () => {
        it("should return filterByState updated with numberOfSelectedOptions", () => {
          const result = renderUseFilters({
            filters: {
              genericFilters: filtersWithCompetitionMock,
              marketTypeFilter: {},
              filtersByItem: filtersByItemWithCompetitionMock,
              defaultSelections: defaultSelectionsMock,
            },
          });
          act(() => result.current.onFilterTap("competitionFilter", "competitions"));
          act(() =>
            result.current.onApply(["fake:filter:2:option:urn:1", "fake:filter:2:option:urn:2"], ["fake1", "fake2"]),
          );

          expect(result.current.filterByState).toEqual([
            {
              id: "competitionFilter",
              isActive: true,
              isSelected: false,
              value: "competitions",
              sortPriority: 0,
              numberOfSelectedOptions: 2,
            },
          ]);
        });
      });
    });

    describe("onReset", () => {
      const setupOnReset = ({ filters } = {}) => {
        const result = renderUseFilters({ filters });
        act(() => result.current.onReset("Reset"));

        return result;
      };

      it("should return filterByState updated", () => {
        const result = setupOnReset();
        expect(result.current.filterByState).toEqual([
          { id: "sortFilter", isActive: false, isSelected: false, value: "filter 1 option 1" },
          { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter 2 option 2" },
        ]);
      });

      it("should return currentFilter with default value", () => {
        const result = setupOnReset();
        expect(result.current.currentFilter).toEqual({
          availableOptions: [
            { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
            { id: "fake:filter:1:option:urn:2", text: "filter 1 option 2" },
          ],
          defaultOption: { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
          id: "sortFilter",
          isActive: false,
          isSelected: false,
          isSingleSelection: true,
          title: "filter title",
          value: "filter sort",
        });
      });

      it("should return currentSelections with default values", () => {
        const result = setupOnReset();
        expect(result.current.currentSelections).toEqual({
          competitionFilter: undefined,
          countriesFilter: undefined,
          dateRangeFilter: "fake:filter:2:option:urn:2",
          marketTypeFilter: null,
          monthFilter: undefined,
          sortFilter: undefined,
        });
      });

      it("should call dispatchFetchFilteredCoupon", () => {
        setupOnReset();
        expect(dispatchFetchFilteredCouponMock).toHaveBeenCalledWith("ppb:urn:filter:1:option:1", {
          competitionFilter: undefined,
          countriesFilter: undefined,
          dateRangeFilter: "fake:filter:2:option:urn:2",
          marketTypeFilter: null,
          monthFilter: undefined,
          sortFilter: undefined,
        });
      });

      it("should call dispatchFilterResetClickEvent", () => {
        setupOnReset();
        expect(dispatchFilterResetClickEventMock).toHaveBeenCalledWith("Reset");
      });

      describe("when the currentFilter is dateRange", () => {
        it("should call dispatchSelectedFilterChanged", () => {
          setupOnReset({
            filters: {
              genericFilters: dateRangeFiltersMock,
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultSelectionsMock,
              filtersByItem: dateRangeByItemMock,
            },
          });

          expect(dispatchSelectedDateRangeFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOption: {
              urn: "fake:filter:2:option:urn:2",
              name: "filter 2 option 2",
            },
          });
        });
      });

      describe("when the currentFilter is sort", () => {
        it("should call dispatchSelectedSortFilterChangedMock", () => {
          setupOnReset({
            filters: {
              genericFilters: sortFiltersMock,
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultSortSelectionsMock,
              filtersByItem: sortByItemMock,
            },
          });

          expect(dispatchSelectedSortFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOption: undefined,
          });
        });
      });

      describe("when the currentFilter is competitions", () => {
        it("should call dispatchSelectedCompetitionsFilterChangedMock", () => {
          setupOnReset({
            filters: {
              genericFilters: competitionsFiltersMock,
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultCompetitionsSelectionsMock,
              filtersByItem: competitionsByItemMock,
            },
          });

          expect(dispatchSelectedCompetitionsFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [],
          });
        });
      });

      describe("when the currentFilter is month", () => {
        it("should call dispatchSelectedMonthFilterChangedMock", () => {
          setupOnReset({
            filters: {
              genericFilters: monthFiltersMock,
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultMonthSelectionsMock,
              filtersByItem: monthByItemMock,
            },
          });

          expect(dispatchSelectedMonthFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [],
          });
        });
      });

      describe("when the currentFilter is countries", () => {
        it("should call dispatchSelectedCountriesFilterChangedMock", () => {
          setupOnReset({
            filters: {
              genericFilters: countriesFiltersMock,
              marketTypeFilter: marketFilterMock,
              defaultSelections: defaultCountriesSelectionsMock,
              filtersByItem: countriesByItemMock,
            },
          });

          expect(dispatchSelectedCountriesFilterChangedMock).toHaveBeenCalledWith({
            urn: "ppb:urn:filter:1:option:1",
            selectedOptions: [],
          });
        });
      });

      describe("and have filter with marketTypeFilter defined", () => {
        it("shouldn't dispatch any action", () => {
          setupOnReset({
            filters: {
              genericFilters: [],
              filtersByItem: [],
              defaultSelections: {
                ...defaultSelectionsMock,
                dateRangeFilter: undefined,
              },
              marketTypeFilter: {
                id: "marketTypeFilter",
                value: "filter market",
                isSelected: false,
                isActive: false,
                isSingleSelection: false,
                title: "filter title",
                availableOptions: [
                  { id: "fake:filter:2:option:urn:1", text: "filter 2 option 1" },
                  { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
                  { id: "fake:filter:2:option:urn:3", text: "filter 2 option 3" },
                ],
                defaultOption: { id: "fake:filter:2:option:urn:1", text: "filter 2 option 1" },
              },
            },
          });

          expect(dispatchFetchFilteredCouponMock).not.toHaveBeenCalled();
          expect(dispatchFilterResetClickEventMock).not.toHaveBeenCalled();
        });
      });
    });

    describe("onClose", () => {
      describe("When has currentFilter", () => {
        const setupOnCloseWithCurrentFilter = () => {
          const result = renderUseFilters();
          act(() => result.current.onFilterTap("sortFilter", "filter sort"));
          act(() => result.current.onClose());

          return result;
        };

        it("should modal be open", () => {
          const result = setupOnCloseWithCurrentFilter();
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should return filterByState updated", () => {
          const result = setupOnCloseWithCurrentFilter();
          expect(result.current.filterByState).toEqual([
            { id: "sortFilter", isActive: false, isSelected: false, value: "filter 1 option 1" },
            { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter 2 option 2" },
          ]);
        });

        it("should return currentFilter undefined", () => {
          const result = setupOnCloseWithCurrentFilter();
          expect(result.current.currentFilter).toEqual(undefined);
        });

        it("should call dispatchFilterCloseEvent", () => {
          setupOnCloseWithCurrentFilter();
          expect(dispatchFilterCloseEventMock).toHaveBeenCalled();
        });

        describe("when current filter is marketTypeFilter", () => {
          const setupOnCloseMarketTypeFilter = () => {
            const result = renderUseFilters();
            act(() => result.current.onMarketTypeFilterTap("marketTypeFilter"));
            act(() => result.current.onClose());

            return result;
          };

          it("should modal be open", () => {
            const result = setupOnCloseMarketTypeFilter();
            expect(result.current.isModalClosed).toBeTruthy();
          });

          it("should return filterByState updated", () => {
            const result = setupOnCloseMarketTypeFilter();
            expect(result.current.filterByState).toEqual([
              { id: "sortFilter", isActive: false, isSelected: false, value: "filter 1 option 1" },
              { id: "dateRangeFilter", isActive: false, isSelected: false, value: "filter 2 option 2" },
            ]);
          });

          it("should return currentFilter undefined", () => {
            const result = setupOnCloseMarketTypeFilter();
            expect(result.current.currentFilter).toEqual(undefined);
          });

          it("should call dispatchFilterCloseEvent", () => {
            setupOnCloseMarketTypeFilter();
            expect(dispatchFilterCloseEventMock).toHaveBeenCalled();
          });
        });
      });

      describe("When doesn't have a currentFilter", () => {
        const setupOnCloseWithoutCurrentFilter = () => {
          const result = renderUseFilters();
          act(() => result.current.onClose());

          return result;
        };

        it("should modal be open", () => {
          const result = setupOnCloseWithoutCurrentFilter();
          expect(result.current.isModalClosed).toBeTruthy();
        });

        it("should not call dispatchFilterCloseEvent", () => {
          setupOnCloseWithoutCurrentFilter();
          expect(dispatchFilterCloseEventMock).not.toHaveBeenCalled();
        });
      });
    });

    describe("getMarketTypeFilterLabel", () => {
      const setupGetMarketTypeFilterLabel = ({ filters } = {}) => renderUseFilters({ filters });

      describe("when marketTypeFilter.availableOptions don't have any id equals to currentSelections.marketTypeFilter", () => {
        it("should be return label value equals to defaultOption.text", () => {
          const result = setupGetMarketTypeFilterLabel();
          expect(result.current.getMarketTypeFilterLabel()).toEqual("filter market option 1");
        });

        describe("and the defaultOption is null", () => {
          it("should return empty label", () => {
            const result = setupGetMarketTypeFilterLabel({
              filters: {
                genericFilters: filtersWithSortPriorityCompetitionMock,
                filtersByItem: filtersByItemWithSortPrioryCompetitionMock,
                defaultSelections: defaultSelectionsMock,
                marketTypeFilter: {
                  ...marketFilterMock,
                  availableOptions: [{ id: "fake:filter:option:urn:0", text: "filter not available" }],
                  defaultOption: null,
                },
              },
            });

            expect(result.current.getMarketTypeFilterLabel()).toEqual("");
          });
        });
      });

      describe("when marketTypeFilter is null", () => {
        it("should return empty label", () => {
          const result = setupGetMarketTypeFilterLabel({
            filters: {
              genericFilters: filtersWithSortPriorityCompetitionMock,
              marketTypeFilter: null,
              filtersByItem: filtersByItemWithSortPrioryCompetitionMock,
              defaultSelections: defaultSelectionsMock,
            },
          });

          expect(result.current.getMarketTypeFilterLabel()).toEqual("");
        });
      });

      describe("when marketTypeFilter.availableOptions don't have text property", () => {
        it("should be return label value equals to defaultOption.text", () => {
          const result = setupGetMarketTypeFilterLabel({
            filters: {
              genericFilters: filtersWithSortPriorityCompetitionMock,
              filtersByItem: filtersByItemWithSortPrioryCompetitionMock,
              defaultSelections: defaultSelectionsMock,
              marketTypeFilter: {
                ...marketFilterMock,
                availableOptions: [{ id: "fake:filter:market:option:urn:1", text: null }],
              },
            },
          });

          expect(result.current.getMarketTypeFilterLabel()).toEqual("filter market option 1");
        });
      });
    });

    describe("for countriesFilter and monthFilter", () => {
      const setupCountriesAndMonthFilters = () => {
        const result = renderUseFilters({
          filters: {
            genericFilters: filtersWithMonthAndCountriesMock,
            filtersByItem: filtersByItemWithMonthAndCountriesMock,
            defaultSelections: defaultSelectionsMock,
            marketTypeFilter: {},
          },
        });
        act(() => result.current.onFilterTap("countriesFilter", "Countries"));
        act(() =>
          result.current.onApply(
            ["fake:filter:4:option:urn:4", "fake:filter:5:option:urn:5"],
            ["filter 4 option 4", "filter 5 option 5"],
          ),
        );

        return result;
      };

      it("should call dispatchFilterOpenEvent", () => {
        setupCountriesAndMonthFilters();
        expect(dispatchFilterOpenEventMock).toHaveBeenCalledWith("Countries");
      });

      it("should return filterByState updated", () => {
        const result = setupCountriesAndMonthFilters();
        expect(result.current.filterByState).toEqual([
          { id: "monthFilter", isActive: false, isSelected: false, value: "Months" },
          { id: "countriesFilter", isActive: true, isSelected: false, value: "Countries", availableOptions: [] },
        ]);
      });

      it("should call sortFilters", () => {
        setupCountriesAndMonthFilters();

        expect(sortFilters).toHaveBeenCalledWith([
          { id: "monthFilter", isActive: false, isSelected: false, value: "Months" },
          { id: "countriesFilter", isActive: true, isSelected: false, value: "Countries", availableOptions: [] },
        ]);
      });

      it("should return currentFilter updated with sort filter options", () => {
        const result = setupCountriesAndMonthFilters();
        expect(result.current.currentFilter).toEqual({
          defaultOptions: [
            {
              id: "fake:filter:5:option:urn:5",
            },
          ],
          availableOptions: [],
          id: "countriesFilter",
          isActive: false,
          isSelected: false,
          isSingleSelection: false,
          title: "Countries",
          value: "Countries",
        });
      });

      it("should modal be open", () => {
        const result = setupCountriesAndMonthFilters();
        expect(result.current.isModalClosed).toBeTruthy();
      });
    });
  });
});
