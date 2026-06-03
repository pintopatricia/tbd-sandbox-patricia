import { FilterBy, ActionLink, Alert, PebbleList, Card } from "@ppb/the-wall-native";
import { ActionLinkTypography, FILTER_TYPE } from "@ppb/the-wall-common/types";
import { render, act, screen } from "@testing-library/react-native";
import FilteredCouponCardGroup from "./FilteredCouponCardGroup.native";
import {
  FILTERED_COUPON_CARD_GROUP_TITLE,
  NO_RESULTS_SECTION,
  NO_RESULTS_LABEL,
  NO_RESULTS_SUGGESTION,
} from "./FilteredCouponCardGroup.native.selectors";
import styles from "./FilteredCouponCardGroup.native.styles";
import ConnectedFilteredCouponList from "./FilteredCouponList";
import FilteredCouponList from "./FilteredCouponList/FilteredCouponList.native";
import ConnectedFutureRacingCardGroup from "./FutureRacingCardGroup";
import FutureRacingCardGroup from "./FutureRacingCardGroup/FutureRacingCardGroup.native";
import ConnectedFilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList";
import FilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.native";
import SingleFilterDrawer from "./SingleFilterDrawer/SingleFilterDrawer.native";
import MultipleFilterDrawer from "./MultipleFilterDrawer/MultipleFilterDrawer.native";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer/CompetitionFilterDrawer.native";
import ConnectedNinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb";
import NinetyMinuteBlurbNative from "../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.native";
import { isCompetitionFilter, isMultipleFilter, useFilters } from "./filter-helper";
import { MarketSwitcher } from "./snowflakes/MarketSwitcher/MarketSwitcher.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  Card: jest.fn((props) => (
    <card-mock data-testid="filtered-coupon-card-group-card" {...props}>
      {props.children}
    </card-mock>
  )),
}));

jest.mock("./FilteredCouponList", () => jest.fn((props) => <connected-coupon-list-mock {...props} />));
jest.mock("./FilteredCouponList/FilteredCouponList.native", () => jest.fn((props) => <coupon-list-mock {...props} />));
jest.mock("./FutureRacingCardGroup", () => jest.fn((props) => <connected-future-racing-card-group-mock {...props} />));
jest.mock("./FutureRacingCardGroup/FutureRacingCardGroup.native", () =>
  jest.fn((props) => <future-racing-card-group-mock {...props} />),
);
jest.mock("./FilteredRacesByTimeRangeList", () =>
  jest.fn((props) => <connected-filtered-swimlane-list-mock {...props} />),
);
jest.mock("./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.native", () =>
  jest.fn((props) => <filtered-swimlane-list-mock {...props} />),
);
jest.mock("./SingleFilterDrawer/SingleFilterDrawer.native", () =>
  jest.fn((props) => <single-filter-drawer-mock {...props} />),
);
jest.mock("./MultipleFilterDrawer/MultipleFilterDrawer.native", () =>
  jest.fn((props) => <multiple-filter-drawer-mock {...props} />),
);
jest.mock("./CompetitionFilterDrawer/CompetitionFilterDrawer.native", () =>
  jest.fn((props) => <competition-filter-drawer-mock {...props} data-testid="filter-drawer" />),
);

jest.mock("@ppb/the-wall-native", () => ({
  FilterBy: jest.fn((props) => <filter-by {...props} />),
  ActionLink: jest.fn((props) => <action-link-mock {...props} data-testid="action-link" />),
  Alert: jest.fn((args) => <alert-mock {...args} />),
  PebbleList: jest.fn((props) => <pebble-list-mock {...props} />),
  Card: jest.fn((props) => <card-mock testID="filtered-coupon-card-group-card" {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./snowflakes/MarketSwitcher/MarketSwitcher.native", () => ({
  MarketSwitcher: jest.fn((props) => <market-switcher-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {},
  spacings: {},
  typography: {},
  tokens: {
    CardGroupVerticalGap: { gap: 12 },
    CardGroupPadding: { paddingLeft: 12, paddingRight: 12 },
    CardGroupTitleTypography: {},
    CardGroupTitleColour: "#1A1A1A",
    FilterByPadding: { paddingLeft: 12, paddingRight: 12 },
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.native", () =>
  jest.fn((props) => <ninety-minute-blurb-mock {...props} />),
);

jest.mock("../SportsbookMarket/NinetyMinuteBlurb", () =>
  jest.fn((props) => <connected-ninety-minute-blurb-mock {...props} />),
);

const onResetMock = jest.fn();

const genericFiltersMock = [
  {
    id: FILTER_TYPE.SORT,
    value: "filter sort",
    isSelected: false,
    isActive: true,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
      { id: "fake:filter:1:option:urn:2", text: "filter 1 option 2" },
    ],
    defaultOption: { id: "fake:filter:1:option:urn:1", text: "filter 1 option 1" },
  },
  {
    id: FILTER_TYPE.DATE_RANGE,
    value: "filter date",
    isSelected: true,
    isActive: true,
    isSingleSelection: true,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:2:option:urn:1", text: "filter 2 option 1" },
      { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
    ],
    defaultOption: { id: "fake:filter:2:option:urn:2", text: "filter 2 option 2" },
  },
  {
    id: FILTER_TYPE.COMPETITION,
    value: "filter competitions",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "Set Competitions",
    topCompetitions: {
      id: "topCompetitions",
      title: "Top Competitions",
      items: [{ id: "ppb:competition:10932509", text: "English Premier League", isSelected: false }],
    },
    allCompetitions: [
      {
        id: "ITA",
        title: "Italy",
        items: [{ id: "ppb:competition:81", text: "Italian Serie A", isSelected: false }],
      },
    ],
    defaultOptions: [
      { id: "filter:uefa2020", text: "UEFA Euro 2020" },
      { id: "filter:primeira", text: "Primeira Liga" },
    ],
  },
  {
    id: FILTER_TYPE.MONTHS,
    value: "filter months",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    title: "filter title",
    availableOptions: [
      { id: "fake:filter:3:option:urn:1", text: "filter 3 option 1" },
      { id: "fake:filter:3:option:urn:2", text: "filter 3 option 2" },
    ],
    defaultOptions: undefined,
  },
  {
    id: FILTER_TYPE.COUNTRIES,
    value: "filter countries",
    isSelected: false,
    isActive: false,
    isSingleSelection: false,
    availableOptions: [
      { id: "fake:filter:4:option:urn:1", text: "filter 4 option 1" },
      { id: "fake:filter:4:option:urn:2", text: "filter 4 option 2" },
    ],
    defaultOptions: undefined,
  },
];

const marketTypeFilterMock = {
  id: FILTER_TYPE.MARKET_TYPE,
  value: "filter market",
  isSelected: true,
  isActive: true,
  isSingleSelection: true,
  title: "filter title",
  availableOptions: [
    { id: "fake:filter3:option:urn:1", text: "filter 2 option 1" },
    { id: "fake:filter:2:option:urn:1", text: "filter 2 option 2" },
    { id: "fake:filter:2:option:urn:2", text: "filter 2 option 3" },
  ],
  defaultOption: { id: "fake:filter3:option:urn:1", text: "filter 2 option 1" },
};

const filterByStateMock = [
  {
    id: "sortFilter",
    isActive: true,
    isSelected: false,
    value: "filter sort",
  },
  {
    id: "dateRangeFilter",
    isActive: true,
    isSelected: true,
    value: "filter date",
  },
  {
    id: "competitionFilter",
    isActive: false,
    isSelected: false,
    value: "filter competition",
  },
  {
    id: "monthFilter",
    isActive: false,
    isSelected: false,
    value: "filter months",
  },
  {
    id: "countriesFilter",
    isActive: false,
    isSelected: false,
    value: "filter countries",
  },
];

const currentSelectionsMock = {
  dateRangeFilter: "fake:filter:2:option:urn:2",
  marketTypeFilter: "fake:filter:3:option:urn:1",
  sortFilter: "fake:filter:1:option:urn:1",
};

const useFiltersMock = {
  onFilterTap: jest.fn(),
  onTap: jest.fn(),
  onReset: onResetMock,
  filterByState: filterByStateMock,
  currentFilter: genericFiltersMock[0],
  currentSelections: currentSelectionsMock,
  isModalClosed: false,
  onApply: jest.fn(),
  onClose: jest.fn(),
  onMarketTypeFilterTap: jest.fn(),
  getMarketTypeFilterLabel: jest.fn(() => "market-type-filter-label-fake"),
};

jest.mock("./filter-helper", () => ({
  useFilters: jest.fn(() => {}),
  isSingleFilter: jest.fn().mockReturnValue(true),
  isMultipleFilter: jest.fn().mockReturnValue(false),
  isCompetitionFilter: jest.fn().mockReturnValue(false),
}));

useFilters.mockImplementation(() => useFiltersMock);

function renderFilteredCouponCardGroup({
  urn = "urn",
  typename = "FilteredCouponCardGroup",
  title = "fake title",
  filters = {
    genericFilters: genericFiltersMock,
    marketTypeFilter: marketTypeFilterMock,
  },
  viewAll = { label: "View All" },
  hasResults = true,
  noResultsLabel = "No results",
  noResultsSuggestionLabel = "Suggestion",
  noResultsResetLabel = "mocked message",
  hasMaxNumberOfEvents = false,
  resetText = "fake filtered-by",
  marketSwitcherTitle = "fake market title",
  notificationMessageLabel = "fake notification message",
  notificationDetailLabel = "fake notification detail",
  has90Min = false,
  refreshFilters = {
    marketType: null,
    competitions: null,
    dateRange: null,
  },
}) {
  return render(
    <FilteredCouponCardGroup
      urn={urn}
      typename={typename}
      title={title}
      filters={filters}
      viewAll={viewAll}
      hasResults={hasResults}
      noResultsLabel={noResultsLabel}
      noResultsSuggestionLabel={noResultsSuggestionLabel}
      noResultsResetLabel={noResultsResetLabel}
      hasMaxNumberOfEvents={hasMaxNumberOfEvents}
      dispatchFilterOpenEvent={jest.fn}
      dispatchFilterCloseEvent={jest.fn}
      dispatchFilterApplyEvent={jest.fn}
      dispatchFilterResetClickEvent={jest.fn}
      dispatchFetchFilteredCoupon={jest.fn}
      dispatchViewAllTap={jest.fn}
      dispatchPushAction={jest.fn}
      dispatchSelectedMarketSwitcherFilter={jest.fn}
      dispatchSelectedDateRangeFilterChanged={jest.fn}
      dispatchSelectedSortFilterChanged={jest.fn}
      dispatchSelectedCompetitionsFilterChanged={jest.fn}
      dispatchSelectedMonthFilterChanged={jest.fn}
      dispatchSelectedCountriesFilterChanged={jest.fn}
      resetText={resetText}
      marketSwitcherTitle={marketSwitcherTitle}
      notificationMessageLabel={notificationMessageLabel}
      notificationDetailLabel={notificationDetailLabel}
      has90Min={has90Min}
      refreshFilters={refreshFilters}
    />,
  );
}

describe("FilteredCouponCardGroup component", () => {
  let container;
  afterEach(jest.clearAllMocks);

  it("should call useFilters with correct parameters", () => {
    renderFilteredCouponCardGroup({ urn: "filteredCouponUrn" });
    expect(useFilters).toHaveBeenCalledWith(
      { genericFilters: genericFiltersMock, marketTypeFilter: marketTypeFilterMock },
      "filteredCouponUrn",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );
  });

  describe("When there is a title", () => {
    it("should render title", () => {
      container = renderFilteredCouponCardGroup({});
      expect(container.getByTestId(FILTERED_COUPON_CARD_GROUP_TITLE)).toBeDefined();
      expect(container.getByTestId(FILTERED_COUPON_CARD_GROUP_TITLE)).toHaveStyle(styles.title);
      expect(container.getByTestId(FILTERED_COUPON_CARD_GROUP_TITLE)).toHaveTextContent("fake title");
    });

    describe("When there is a viewAll.label", () => {
      it("should call an action link", () => {
        renderFilteredCouponCardGroup({});
        expect(ActionLink).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            text: "View All",
            color: "default",
            typography: ActionLinkTypography.Regular,
          },
          undefined,
        );
      });
    });

    describe("When there is no viewAll.label", () => {
      it("should not call an action link", () => {
        renderFilteredCouponCardGroup({ viewAll: null });
        expect(ActionLink).not.toHaveBeenCalled();
      });
    });
  });

  describe("when there is filters", () => {
    beforeEach(() => {
      container = renderFilteredCouponCardGroup({});
    });

    it("should render the filterBy component", () => {
      expect(FilterBy).toHaveBeenCalledWith(
        {
          filters: [
            { id: "sortFilter", value: "filter sort", isSelected: false, isActive: true },
            { id: "dateRangeFilter", value: "filter date", isSelected: true, isActive: true },
            {
              id: "competitionFilter",
              isActive: false,
              isSelected: false,
              value: "filter competition",
            },
            {
              id: "monthFilter",
              isActive: false,
              isSelected: false,
              value: "filter months",
            },
            {
              id: "countriesFilter",
              isActive: false,
              isSelected: false,
              value: "filter countries",
            },
          ],
          onFilterTap: expect.any(Function),
          onResetTap: expect.any(Function),
          resetText: "fake filtered-by",
        },
        undefined,
      );
    });
  });

  describe("when there is no filters", () => {
    beforeEach(() => {
      container = renderFilteredCouponCardGroup({
        filters: { genericFilters: [], marketTypeFilter: {} },
      });
    });

    it("should not render the filterBy component", () => {
      expect(FilterBy).not.toHaveBeenCalled();
    });
  });

  describe("if it's a FilteredCouponCardGroup and has results", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "FilteredCouponCardGroup" });
    });

    it("should call ConnectedFilteredCouponList", () => {
      expect(ConnectedFilteredCouponList).toHaveBeenCalledTimes(1);
      expect(ConnectedFilteredCouponList).toHaveBeenCalledWith(
        {
          urn: "urn",
          component: FilteredCouponList,
        },
        undefined,
      );
    });

    it("should not render notification component", () => {
      expect(Alert).not.toHaveBeenCalledWith(
        { detail: "fake notification detail", message: "fake notification message", type: "INFO" },
        undefined,
      );
    });

    describe("and it has exceeded the maximum number of results", () => {
      beforeEach(() => {
        renderFilteredCouponCardGroup({ typename: "FilteredCouponCardGroup", hasMaxNumberOfEvents: true });
      });

      it("should render notification component", () => {
        expect(Alert).toHaveBeenCalledWith(
          { detail: "fake notification detail", message: "fake notification message", type: "INFO" },
          undefined,
        );
      });
    });

    it("should render the Card component with the correct properties", () => {
      renderFilteredCouponCardGroup({
        typename: "FilteredCouponCardGroup",
        urn: "urn:test:1",
      });

      const card = screen.getByTestId("filtered-coupon-card-group-card");

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          showShadow: true,
          fullWidthContent: true,
        }),
        undefined,
      );

      expect(card).toBeTruthy();
    });
  });

  describe("if it's a FutureRacingCardGroup and has results", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "FutureRacingCardGroup" });
    });

    it("should call ConnectedFutureRacingCardGroup", () => {
      expect(ConnectedFutureRacingCardGroup).toHaveBeenCalledTimes(1);
      expect(ConnectedFutureRacingCardGroup).toHaveBeenCalledWith(
        {
          urn: "urn",
          component: FutureRacingCardGroup,
        },
        undefined,
      );
    });

    it("should render the Card component with the correct properties", () => {
      renderFilteredCouponCardGroup({
        typename: "FilteredCouponCardGroup",
        urn: "urn:test:1",
      });

      const card = screen.getByTestId("filtered-coupon-card-group-card");

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          showShadow: true,
          fullWidthContent: true,
        }),
        undefined,
      );

      expect(card).toBeTruthy();
    });
  });

  describe("if it's a RacesByTimeRangeCardGroup and has results", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "RacesByTimeRangeCardGroup" });
    });

    it("should call ConnectedFilteredRacesByTimeRangeList", () => {
      expect(ConnectedFilteredRacesByTimeRangeList).toHaveBeenCalledTimes(1);
      expect(ConnectedFilteredRacesByTimeRangeList).toHaveBeenCalledWith(
        {
          urn: "urn",
          component: FilteredRacesByTimeRangeList,
        },
        undefined,
      );
    });
  });

  describe("when coupon typename is a not supported one", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "fake-typename" });
    });

    it("shouldn't call ConnectedFilteredRacesByTimeRangeList", () => {
      expect(ConnectedFilteredRacesByTimeRangeList).not.toHaveBeenCalled();
    });
  });

  describe("when it has no results to show", () => {
    beforeEach(() => {
      container = renderFilteredCouponCardGroup({ hasResults: false, viewAll: { label: null } });
    });

    it("should render no results section", () => {
      expect(container.getByTestId(NO_RESULTS_SECTION)).toBeDefined();
    });

    it("should render correct no results label", () => {
      expect(container.getByTestId(NO_RESULTS_LABEL)).toHaveTextContent("No results");
    });

    it("should render correct no results suggestion label", () => {
      expect(container.getByTestId(NO_RESULTS_SUGGESTION)).toHaveTextContent("Suggestion");
    });

    it("should render no results reset button", () => {
      expect(ActionLink).toHaveBeenCalledWith(
        { color: "default", text: "mocked message", onClick: expect.any(Function) },
        undefined,
      );

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(onResetMock).toHaveBeenCalled();
    });

    it("should dispatchFilterResetClickEvent with correct data", () => {
      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(onResetMock).toHaveBeenCalledWith("mocked message");
    });
  });

  describe("when a single selection filter is the current filter", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
        },
      });
    });

    it("should open the single filter drawer", () => {
      expect(SingleFilterDrawer).toHaveBeenCalledWith(
        {
          filter: genericFiltersMock[0],
          selections: {
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: "fake:filter:3:option:urn:1",
            sortFilter: "fake:filter:1:option:urn:1",
          },
          onApply: expect.any(Function),
          onClose: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when a multiple selection filter is the current filter", () => {
    beforeEach(() => {
      isMultipleFilter.mockReturnValue(true);
      useFilters.mockImplementation(() => ({ ...useFiltersMock, currentFilter: genericFiltersMock[4] }));
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      });
    });

    it("should open the multiple filter drawer", () => {
      expect(MultipleFilterDrawer).toHaveBeenCalledWith(
        {
          filter: genericFiltersMock[4],
          selections: {
            dateRangeFilter: "fake:filter:2:option:urn:2",
            marketTypeFilter: "fake:filter:3:option:urn:1",
            sortFilter: "fake:filter:1:option:urn:1",
          },
          onApply: expect.any(Function),
          onClose: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when competitions filter is the current filter", () => {
    beforeEach(() => {
      isCompetitionFilter.mockReturnValue(true);
      useFilters.mockImplementation(() => ({ ...useFiltersMock, currentFilter: genericFiltersMock[2] }));
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      });
    });

    it("should open the competitions filter drawer", () => {
      expect(CompetitionFilterDrawer).toHaveBeenCalledWith(
        {
          urn: "urn",
          title: genericFiltersMock[2].title,
          topCompetitions: genericFiltersMock[2].topCompetitions,
          currentSelections: currentSelectionsMock,
          onApply: expect.any(Function),
          onClose: expect.any(Function),
          resetText: "fake filtered-by",
        },
        undefined,
      );
    });
  });

  describe("when marketSwitcher is pressed", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: [],
          marketTypeFilter: marketTypeFilterMock,
        },
      });

      act(() => {
        MarketSwitcher.mock.calls[0][0].onTap("onPress", marketTypeFilterMock.value);
      });
    });

    it("should call the market list filter drawer", () => {
      expect(MarketSwitcher).toHaveBeenCalledWith(
        {
          value: "filter market",
          label: "market-type-filter-label-fake",
          onTap: expect.any(Function),
          title: "fake market title",
        },
        undefined,
      );
    });
  });

  describe("when the marketTypeFilter layout is PEBBLES", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: [],
          marketTypeFilter: { ...marketTypeFilterMock, layout: "PEBBLES" },
        },
      });
    });

    it("should render the PebbleList component", () => {
      expect(PebbleList).toHaveBeenCalledWith(
        {
          defaultSelectedPebble: "fake:filter3:option:urn:1",
          items: [
            {
              id: "fake:filter3:option:urn:1",
              text: "filter 2 option 1",
            },
            {
              id: "fake:filter:2:option:urn:1",
              text: "filter 2 option 2",
            },
            {
              id: "fake:filter:2:option:urn:2",
              text: "filter 2 option 3",
            },
          ],
          onPebblePress: expect.any(Function),
        },
        undefined,
      );
    });

    it("should not render the MarketSwitcher component", () => {
      expect(MarketSwitcher).not.toHaveBeenCalled();
    });
  });

  describe("when marketTypeFilter is empty", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: {},
        },
      });
    });

    it("shouldn't render MarketSwitcher", () => {
      expect(MarketSwitcher).not.toHaveBeenCalled();
    });
  });

  describe("when has 90min", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        typename: "FilteredCouponCardGroup",
        urn: "urn:test:1",
        has90Min: true,
      });
    });

    it("should call ConnectedCouponList component", () => {
      expect(ConnectedFilteredCouponList).toHaveBeenCalledWith(
        {
          urn: "urn:test:1",
          component: FilteredCouponList,
        },
        undefined,
      );
    });

    it("should call ConnectedNinetyMinuteBlurbs component", () => {
      expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
        {
          component: NinetyMinuteBlurbNative,
          hasSpacing: true,
        },
        undefined,
      );
    });
  });
});
