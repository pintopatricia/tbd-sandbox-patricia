import { render, act, screen } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FilterBy, Alert, ActionLink, PebbleList, Card } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography, FILTER_TYPE } from "@ppb/the-wall-common/types";
import ConnectedNinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb";
import NinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.web";
import ConnectedCouponList from "./FilteredCouponList";
import CouponList from "./FilteredCouponList/FilteredCouponList.web";
import ConnectedFutureRacingCardGroup from "./FutureRacingCardGroup";
import FutureRacingCardGroup from "./FutureRacingCardGroup/FutureRacingCardGroup.web";
import FilteredCouponCardGroup from "./FilteredCouponCardGroup.web";
import FilteredSwimlaneList from "./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.web";
import FilteredRacesByTimeRangeListComponent from "./FilteredRacesByTimeRangeList";
import SingleFilterDrawer from "./SingleFilterDrawer/SingleFilterDrawer.web";
import MultipleFilterDrawer from "./MultipleFilterDrawer/MultipleFilterDrawer.web";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer/CompetitionFilterDrawer.web";
import { MarketSwitcher } from "./snowflakes/MarketSwitcher/MarketSwitcher.web";
import {
  CARD_COUPON_HEADER,
  TITLE,
  NO_RESULTS,
  NO_RESULTS_LABEL,
  NO_RESULTS_SUGGESTION_LABEL,
} from "./FilteredCouponCardGroup.web.selectors";
import { useFilters } from "./filter-helper";

jest.mock("@ppb/the-wall-web", () => ({
  FilterBy: jest.fn((props) => <filter-by {...props} />),
  Alert: jest.fn(() => <notification-mock />),
  ActionLink: jest.fn(() => <action-link-mock />),
  PebbleList: jest.fn((props) => <pebble-list-mock {...props} />),
  Card: jest.fn((props) => (
    <card-mock data-testid="filtered-coupon-card-group-card" {...props}>
      {props.children}
    </card-mock>
  )),
}));

jest.mock("./snowflakes/MarketSwitcher/MarketSwitcher.web", () => ({
  MarketSwitcher: jest.fn((props) => <market-switcher-mock {...props} />),
}));

jest.mock("../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.web", () =>
  jest.fn((props) => <ninety-minute-blurb-mock {...props} />),
);
jest.mock("../SportsbookMarket/NinetyMinuteBlurb", () =>
  jest.fn((props) => <connected-ninety-minute-blurb-mock {...props} />),
);
jest.mock("./FilteredCouponList", () => jest.fn((props) => <connected-coupon-list-mock {...props} />));
jest.mock("./FilteredCouponList/FilteredCouponList.web", () => jest.fn((props) => <coupon-list-mock {...props} />));
jest.mock("./FutureRacingCardGroup", () => jest.fn((props) => <connected-quick-link-list-mock {...props} />));
jest.mock("./FutureRacingCardGroup/FutureRacingCardGroup.web", () =>
  jest.fn((props) => <coupon-quick-link-list-mock {...props} />),
);
jest.mock("./FilteredRacesByTimeRangeList", () =>
  jest.fn((props) => <connected-races-by-time-range-list-mock {...props} />),
);
jest.mock("./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.web", () =>
  jest.fn((props) => <coupon-races-by-time-range-list-mock {...props} />),
);
jest.mock("./SingleFilterDrawer/SingleFilterDrawer.web", () =>
  jest.fn((props) => <single-filter-drawer-mock {...props} data-testid="filter-drawer" />),
);
jest.mock("./MultipleFilterDrawer/MultipleFilterDrawer.web", () =>
  jest.fn((props) => <multiple-filter-drawer-mock {...props} data-testid="filter-drawer" />),
);
jest.mock("./CompetitionFilterDrawer/CompetitionFilterDrawer.web", () =>
  jest.fn((props) => <competition-filter-drawer-mock {...props} data-testid="filter-drawer" />),
);

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
    value: "filter competitions",
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
  marketTypeFilter: "fake:filter3:option:urn:1",
  sortFilter: "fake:filter:1:option:urn:1",
  competitionFilter: ["filter:uefa2020", "filter:primeira"],
};

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

const onResetMock = jest.fn();
const dispatchViewAllTap = jest.fn();
const dispatchPushAction = jest.fn();

const helperMock = {
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
let single = false;
let multiple = false;
let competition = false;

jest.mock("./filter-helper", () => ({
  useFilters: jest.fn(() => helperMock),
  isSingleFilter: jest.fn(() => single),
  isMultipleFilter: jest.fn(() => multiple),
  isCompetitionFilter: jest.fn(() => competition),
}));

function renderFilteredCouponCardGroup({
  urn,
  typename = "FilteredCouponCardGroup",
  title,
  filters = {
    genericFilters: [],
    marketTypeFilter: {},
  },
  refreshFilters = {
    marketType: null,
    competitions: null,
    dateRange: null,
  },
  hasMaxNumberOfEvents = false,
  hasResults = true,
  noResultsLabel = "No results",
  noResultsSuggestionLabel = "Suggestion",
  noResultsResetLabel = "Reset",
  viewAll = { label: "View All", viewLink: { viewUrn: "urn", viewUrl: "url", viewDisplayMode: "BLANK_BROWSER" } },
  resetText = "fake filtered-by",
  marketSwitcherTitle = "fake market title",
  notificationMessageLabel = "fake notification message",
  notificationDetailLabel = "fake notification detail",
  has90Min = false,
}) {
  return render(
    <FilteredCouponCardGroup
      urn={urn}
      typename={typename}
      dispatchFilterOpenEvent={jest.fn}
      dispatchFilterCloseEvent={jest.fn}
      dispatchFilterApplyEvent={jest.fn}
      dispatchFilterResetClickEvent={jest.fn}
      dispatchFetchFilteredCoupon={jest.fn}
      dispatchViewAllTap={dispatchViewAllTap}
      dispatchPushAction={dispatchPushAction}
      dispatchSelectedMarketSwitcherFilter={jest.fn}
      dispatchSelectedDateRangeFilterChanged={jest.fn}
      dispatchSelectedSortFilterChanged={jest.fn}
      dispatchSelectedCompetitionsFilterChanged={jest.fn}
      dispatchSelectedMonthFilterChanged={jest.fn}
      dispatchSelectedCountriesFilterChanged={jest.fn}
      title={title}
      filters={filters}
      refreshFilters={refreshFilters}
      hasMaxNumberOfEvents={hasMaxNumberOfEvents}
      viewAll={viewAll}
      hasResults={hasResults}
      noResultsLabel={noResultsLabel}
      noResultsSuggestionLabel={noResultsSuggestionLabel}
      noResultsResetLabel={noResultsResetLabel}
      resetText={resetText}
      marketSwitcherTitle={marketSwitcherTitle}
      notificationMessageLabel={notificationMessageLabel}
      notificationDetailLabel={notificationDetailLabel}
      has90Min={has90Min}
    />,
  );
}

describe("FilteredCouponCardGroup component", () => {
  let container;

  afterEach(jest.clearAllMocks);

  it("should call useFilters with correct parameters", () => {
    renderFilteredCouponCardGroup({ urn: "filteredCouponUrn" });
    expect(useFilters).toHaveBeenCalledWith(
      { genericFilters: [], marketTypeFilter: {} },
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

  describe("when there is no title and no viewAll", () => {
    it("should not render header", () => {
      ({ container } = renderFilteredCouponCardGroup({ title: undefined, viewAll: null }));
      expect(container.querySelector(CARD_COUPON_HEADER)).toBeNull();
    });
  });

  describe("when there is title and no viewAll", () => {
    it("shouldn't render header without view all button", () => {
      ({ container } = renderFilteredCouponCardGroup({
        title: "Title Test",
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
        viewAll: null,
      }));
      expect(container.querySelector(TITLE)).toHaveTextContent("Title Test");
      expect(ActionLink).not.toHaveBeenCalled();
    });
  });

  describe("when there is a title", () => {
    it("should render correct title", () => {
      ({ container } = renderFilteredCouponCardGroup({
        title: "Title Test",
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      }));
      expect(container.querySelector(TITLE)).toHaveTextContent("Title Test");
    });
  });

  describe("when there is a viewAll", () => {
    it("should render correct button", () => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      });
      expect(ActionLink).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          text: "View All",
          color: ActionLinkColor.Default,
          typography: ActionLinkTypography.Regular,
        },
        undefined,
      );
    });
  });

  describe("when viewAll is clicked", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      });

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });
    });

    it("should dispatchViewAllTap with correct data", () => {
      expect(dispatchViewAllTap).toHaveBeenCalledWith(
        "View All",
        { label: "View All", viewLink: { viewDisplayMode: "BLANK_BROWSER", viewUrl: "url", viewUrn: "urn" } },
        undefined,
      );
    });

    it("should dispatchPushAction with correct data", () => {
      expect(dispatchPushAction).toHaveBeenCalledWith({
        viewDisplayMode: "BLANK_BROWSER",
        viewUrl: "url",
        viewUrn: "urn",
      });
    });
  });

  describe("when there are no filters", () => {
    beforeEach(() => {
      ({ container } = renderFilteredCouponCardGroup({
        filters: {
          genericFilters: [],
          marketTypeFilter: [],
        },
      }));
    });

    it("should not call filteryBy component", () => {
      renderFilteredCouponCardGroup({
        filters: {
          genericFilters: [],
          marketTypeFilter: [],
        },
      });
      expect(FilterBy).not.toHaveBeenCalled();
    });
  });

  describe("when filters are available", () => {
    beforeEach(() => {
      ({ container } = renderFilteredCouponCardGroup({
        urn: "filteredCouponUrn",
        filters: {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
      }));
    });

    it("should call useFilters with correct parameters", () => {
      expect(useFilters).toHaveBeenCalledWith(
        {
          genericFilters: genericFiltersMock,
          marketTypeFilter: marketTypeFilterMock,
        },
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

    it("should call FilterBy with the correct arguments", () => {
      expect(FilterBy.mock.calls[0][0]).toEqual(
        {
          filters: filterByStateMock,
          onFilterTap: expect.any(Function),
          onResetTap: expect.any(Function),
          resetText: "fake filtered-by",
        },
        undefined,
      );
    });

    describe("when single selection FilterBy pebble is clicked", () => {
      beforeEach(() => {
        single = true;
        ({ container } = renderFilteredCouponCardGroup({
          filters: {
            genericFilters: genericFiltersMock,
            marketTypeFilter: marketTypeFilterMock,
          },
        }));

        act(() => {
          FilterBy.mock.calls[0][0].onFilterTap("sortFilter", genericFiltersMock[0].title);
        });
      });

      it("should open the single filter drawer", () => {
        expect(SingleFilterDrawer).toHaveBeenCalledWith(
          {
            filter: genericFiltersMock[0], // Sort filter
            selections: currentSelectionsMock,
            onApply: expect.any(Function),
            onClose: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when multiple selection FilterBy pebble is clicked", () => {
      beforeEach(() => {
        helperMock.currentFilter = genericFiltersMock[4];
        multiple = true;
        ({ container } = renderFilteredCouponCardGroup({
          filters: {
            genericFilters: genericFiltersMock,
            marketTypeFilter: marketTypeFilterMock,
          },
        }));

        act(() => {
          FilterBy.mock.calls[0][0].onFilterTap("monthFilter", genericFiltersMock[4].title);
        });
      });

      it("should open the multiple filter drawer", () => {
        expect(MultipleFilterDrawer).toHaveBeenCalledWith(
          {
            filter: genericFiltersMock[4], // Month filter
            selections: {
              dateRangeFilter: "fake:filter:2:option:urn:2",
              marketTypeFilter: "fake:filter3:option:urn:1",
              sortFilter: "fake:filter:1:option:urn:1",
              competitionFilter: ["filter:uefa2020", "filter:primeira"],
            },
            onApply: expect.any(Function),
            onClose: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when competitions filter FilterBy pebble is clicked", () => {
      beforeEach(() => {
        helperMock.currentFilter = genericFiltersMock[2];
        competition = true;
        renderFilteredCouponCardGroup({
          filters: {
            genericFilters: genericFiltersMock,
            marketTypeFilter: marketTypeFilterMock,
          },
        });

        act(() => {
          FilterBy.mock.calls[0][0].onFilterTap("competitionFilter", genericFiltersMock[2].title);
        });
      });

      it("should open the competitions filter drawer", () => {
        expect(CompetitionFilterDrawer).toHaveBeenCalledWith(
          {
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

    describe("when marketSwitcher is clicked", () => {
      beforeEach(() => {
        renderFilteredCouponCardGroup({
          filters: {
            genericFilters: [],
            marketTypeFilter: marketTypeFilterMock,
          },
        });

        act(() => {
          MarketSwitcher.mock.calls[0][0].onTap("onClick", marketTypeFilterMock.value);
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
            showDesktopArrows: false,
            isDesktopLayout: false,
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
            onPebbleClick: expect.any(Function),
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
        jest.clearAllMocks();
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

    describe("when Reset is clicked", () => {
      beforeEach(() => {
        act(() => {
          FilterBy.mock.calls[0][0].onResetTap("Label");
        });
      });

      it("should call FilterBy with the default state", () => {
        expect(FilterBy.mock.calls[0][0]).toEqual({
          filters: [
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
              value: "filter competitions",
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
        });
      });
    });
  });

  describe("when typename is FilteredCouponCardGroup and has results", () => {
    describe("when has not got 90 min", () => {
      beforeEach(() => {
        renderFilteredCouponCardGroup({
          typename: "FilteredCouponCardGroup",
          urn: "urn:test:1",
        });
      });

      it("should call ConnectedCouponList component", () => {
        expect(ConnectedCouponList).toHaveBeenCalledWith(
          {
            urn: "urn:test:1",
            component: CouponList,
          },
          undefined,
        );
      });

      it("should not call ConnectedNinetyMinuteBlurbs component", () => {
        expect(ConnectedNinetyMinuteBlurb).not.toHaveBeenCalled();
      });
    });

    describe("when has 90 min", () => {
      beforeEach(() => {
        renderFilteredCouponCardGroup({
          typename: "FilteredCouponCardGroup",
          urn: "urn:test:1",
          has90Min: true,
        });
      });

      it("should call ConnectedCouponList component", () => {
        expect(ConnectedCouponList).toHaveBeenCalledWith(
          {
            urn: "urn:test:1",
            component: CouponList,
          },
          undefined,
        );
      });

      it("should call ConnectedNinetyMinuteBlurbs component", () => {
        expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
          {
            component: NinetyMinuteBlurb,
            hasSpacing: true,
          },
          undefined,
        );
      });
    });

    describe("Card component wrapping", () => {
      beforeEach(() => {
        renderFilteredCouponCardGroup({
          typename: "FilteredCouponCardGroup",
          urn: "urn:test:1",
        });
      });

      it("should render Card component with 'showShadow' prop", () => {
        const card = screen.getByTestId("filtered-coupon-card-group-card");

        expect(Card).toHaveBeenCalledWith(
          expect.objectContaining({
            showShadow: true,
          }),
          undefined,
        );

        expect(card).toBeInTheDocument();
      });

      it("should render Card component with 'fullWidthContent' prop", () => {
        const card = screen.getByTestId("filtered-coupon-card-group-card");

        expect(Card).toHaveBeenCalledWith(
          expect.objectContaining({
            fullWidthContent: true,
          }),
          undefined,
        );

        expect(card).toBeInTheDocument();
      });
    });
  });

  describe("when typename is FutureRacingCardGroup and has results", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "FutureRacingCardGroup", urn: "urn:test:1" });
    });

    it("should call ConnectedFutureRacingCardGroup component", () => {
      expect(ConnectedFutureRacingCardGroup).toHaveBeenCalledWith(
        {
          urn: "urn:test:1",
          component: FutureRacingCardGroup,
        },
        undefined,
      );
    });

    it("should render Card component with 'showShadow' prop", () => {
      const card = screen.getByTestId("filtered-coupon-card-group-card");

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          showShadow: true,
        }),
        undefined,
      );

      expect(card).toBeInTheDocument();
    });

    it("should render Card component with 'fullWidthContent' prop", () => {
      const card = screen.getByTestId("filtered-coupon-card-group-card");

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidthContent: true,
        }),
        undefined,
      );

      expect(card).toBeInTheDocument();
    });
  });

  describe("when typename is RacesByTimeRangeCardGroup and has results", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({ typename: "RacesByTimeRangeCardGroup", urn: "urn:test:1" });
    });
    it("should call FilteredRacesByTimeRangeListComponent component", () => {
      expect(FilteredRacesByTimeRangeListComponent).toHaveBeenCalledWith(
        {
          urn: "urn:test:1",
          component: FilteredSwimlaneList,
        },
        undefined,
      );
    });
  });

  describe("when coupon typename is a not supported one", () => {
    beforeEach(() => {
      renderFilteredCouponCardGroup({
        typename: "fake-typename",
      });
    });
    it("shouldn't call ConnectedCouponList component", () => {
      expect(ConnectedCouponList).not.toHaveBeenCalled();
    });
  });

  describe("when max number of events is reached", () => {
    it("should render notification info", () => {
      renderFilteredCouponCardGroup({
        filters: { genericFilters: [], marketTypeFilter: [] },
        hasMaxNumberOfEvents: true,
      });
      expect(Alert).toHaveBeenCalledWith(
        {
          detail: "fake notification detail",
          message: "fake notification message",
          type: "INFO",
        },
        undefined,
      );
    });
  });

  describe("when it doesn't have results", () => {
    beforeEach(() => {
      ({ container } = renderFilteredCouponCardGroup({ hasResults: false, viewAll: {} }));

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });
    });

    it("should render no results section", () => {
      expect(container.querySelector(NO_RESULTS)).toBeVisible();
    });

    it("should render correct no results label", () => {
      expect(container.querySelector(NO_RESULTS_LABEL)).toHaveTextContent("No results");
    });

    it("should render correct no results suggestion label", () => {
      expect(container.querySelector(NO_RESULTS_SUGGESTION_LABEL)).toHaveTextContent("Suggestion");
    });

    it("should render no results reset button", () => {
      expect(ActionLink).toHaveBeenCalledWith(
        { color: ActionLinkColor.Default, text: "Reset", onClick: expect.any(Function) },
        undefined,
      );
    });

    it("should dispatchFilterResetClickEvent with correct data", () => {
      expect(onResetMock).toHaveBeenCalledWith("Reset");
    });

    it("should not render Card component", () => {
      const card = screen.queryByTestId("filtered-coupon-card-group-card");

      expect(Card).not.toHaveBeenCalled();
      expect(card).not.toBeInTheDocument();
    });
  });
});
