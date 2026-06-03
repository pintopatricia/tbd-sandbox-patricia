import { createBrowseInterfaceSearchSelector } from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import {
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_LINK_CLICK,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_BAR_FOCUS,
  UI__SPORTS_FILTER_CLICK,
  UI__SEARCH_HISTORY_CLICK,
} from "@ppb/tbd-store/actions/browse";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { formatDateWithToday } from "../../helpers/dates";

const STATE = {
  layouts: {
    cards: {
      search: {
        isOpen: false,
        result: {
          items: [],
        },
      },
    },
  },
};

const STATE_WITH_ONE_RESULT = {
  layouts: {
    cards: {
      search: {
        isOpen: true,
        result: {
          items: [{ name: "Porto v Gil Vicente", sportId: 1, sportName: "Football" }],
          query: "Port",
        },
        inputSearchTerm: "search term",
      },
    },
  },
};
const SPORTS_BROWSE_URN = "ppb:tbd:view:browse:sports";

const sportsFiltersMock = [
  { id: "1", text: "Football" },
  { id: "7", text: "Horse Racing" },
];

const getBrowseInterfaceSearch = jest.fn();
const getSearchBarInterfaceSearch = jest.fn();
const getSportFilters = jest.fn();
const getCountryLocalCurrencyCodeSelector = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors", () => ({
  createBrowseInterfaceSearchSelector: jest.fn(() => getBrowseInterfaceSearch),
  createSearchBarInterfaceSelector: jest.fn(() => getSearchBarInterfaceSearch),
  getBrowseInterfaceOpenState: jest.fn().mockReturnValue(true),
  createSportFiltersSelector: jest.fn(() => getSportFilters),
}));

const getViewByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() => getViewByURN),
}));

getViewByURN.mockReturnValue({
  urn: "ppb:tbd:view:browse:sports",
  items: [{ urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse", typename: "QuickLinksCard" }],
});

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const TIME_FORMAT_MOCK = "TIME FORMAT";

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => TIME_FORMAT_MOCK),
  utcTime: jest.fn(() => 1622026846690),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

global.Date.now = jest.fn(() => new Date("2020-01-11T15:15:00Z"));

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create selector for browser view", () => {
    // Act
    makeMapStateToProps();

    // Assert
    expect(createBrowseInterfaceSearchSelector).toHaveBeenCalledTimes(1);
    expect(createBrowseInterfaceSearchSelector).toHaveBeenCalledWith();
    expect(createFindViewByURNSelector).toHaveBeenCalledTimes(1);
    expect(createFindViewByURNSelector).toHaveBeenCalledWith();
  });

  describe("getStaticLabels", () => {
    let mapStateToProps;
    beforeEach(() => {
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: null,
        query: "",
        formattedResults: [],
      });
      mapStateToProps = makeMapStateToProps();
    });

    it("should invoke i18n for page on mapStateToProps call", () => {
      mapStateToProps(STATE, { urn: SPORTS_BROWSE_URN });

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.SEARCH.INPUT_PLACEHOLDER" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.SEARCH.CANCEL" });
    });

    it("should not call i18n again when locale code is the same", () => {
      getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
      mapStateToProps(STATE, { urn: SPORTS_BROWSE_URN });

      expect(i18n).toHaveBeenCalledTimes(3);
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.SEARCH.INPUT_PLACEHOLDER" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.SEARCH.CANCEL" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.SEARCH.HISTORY.LABEL" });

      mapStateToProps(STATE, { urn: SPORTS_BROWSE_URN });
      expect(i18n).toHaveBeenCalledTimes(3);
    });

    it("should call i18n again when locale code is not the same", () => {
      getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
      mapStateToProps(STATE, { urn: SPORTS_BROWSE_URN });

      expect(i18n).toHaveBeenCalledTimes(3);
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.SEARCH.INPUT_PLACEHOLDER" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.SEARCH.CANCEL" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.SEARCH.HISTORY.LABEL" });

      getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "en" });
      mapStateToProps(STATE, { urn: SPORTS_BROWSE_URN });

      expect(i18n).toHaveBeenCalledTimes(6);
      expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.SEARCH.INPUT_PLACEHOLDER" });
      expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.SEARCH.CANCEL" });
      expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.SEARCH.HISTORY.LABEL" });
    });
  });

  describe("when it has results", () => {
    it("should return a model with search interface", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: undefined,
        query: "Sport",
        formattedResults: [{ name: "Sporting v Porto" }],
      });

      makeMapStateToProps()(STATE, { urn: SPORTS_BROWSE_URN });

      // Assert
      expect(getBrowseInterfaceSearch).toHaveBeenCalledWith(STATE, SPORTS_BROWSE_URN);
      expect(getBrowseInterfaceSearch).toHaveBeenCalledTimes(1);
    });

    it("should map the search resulsts correctly", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: undefined,
        query: "Sport",
        formattedResults: [
          {
            type: "COMPETITION_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:competition:59",
            url: "football/dutch-eerste-divise/competition:59",
            name: "Sporting v Porto",
            sportName: "Football",
            sportId: "1",
          },
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:event:29662647",
            url: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
            name: "Helmond Sport v Den Bosch",
            competition: "Dutch Eerste Divisie",
            date: new Date("2020-01-24T19:00:00.000Z"),
            sportId: "1",
            sportName: "Football",
          },
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:event:29662645",
            url: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
            name: "Helmond Sport v Den Bosch",
            competition: "Dutch Eerste Divisie",
            date: new Date("2020-01-11T15:15:00Z"),
            sportId: "1",
            sportName: "Football",
          },
          {
            type: "RACE_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:race:29662645",
            url: "raceURL",
            name: "1k GME",
            meetingName: "Maybe 2k GME",
            date: new Date("2020-01-11T15:15:00Z"),
            sportId: "7",
            sportName: "Horse Racing",
          },
        ],
        inputSearchTerm: "search term",
      });

      formatDateWithToday.mockReturnValueOnce("DATE FORMAT").mockReturnValue("I18N.DATE.TODAY");

      const result = makeMapStateToProps()(STATE_WITH_ONE_RESULT, { urn: SPORTS_BROWSE_URN });

      expect(result.searchResults).toStrictEqual([
        {
          context: "Football",
          logo: true,
          imageURL: undefined,
          name: "Sporting v Porto",
          viewLink: {
            viewUrl: "football/dutch-eerste-divise/competition:59",
            viewUrn: "ppb:tbd:view:competition:59",
          },
          sportId: "1",
          sportName: "Football",
        },
        {
          context: `Dutch Eerste Divisie - DATE FORMAT, TIME FORMAT`,
          viewLink: {
            viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
            viewUrn: "ppb:tbd:view:event:29662647",
          },
          name: "Helmond Sport v Den Bosch",
          sportId: "1",
          sportName: "Football",
        },
        {
          context: `Dutch Eerste Divisie - I18N.DATE.TODAY, TIME FORMAT`,
          viewLink: {
            viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
            viewUrn: "ppb:tbd:view:event:29662645",
          },
          name: "Helmond Sport v Den Bosch",
          sportId: "1",
          sportName: "Football",
        },
        {
          context: `Maybe 2k GME - I18N.DATE.TODAY, TIME FORMAT`,
          name: "1k GME",
          viewLink: {
            viewUrl: "raceURL",
            viewUrn: "ppb:tbd:view:race:29662645",
          },
          sportId: "7",
          sportName: "Horse Racing",
        },
      ]);
    });

    it("should not add numberOfResults, didYouMeanLabel, noResultsLabel if the length of query is less than 3", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        query: "Sp",
        formattedResults: [],
        inputSearchTerm: "search term",
      });

      const result = makeMapStateToProps()(STATE_WITH_ONE_RESULT, { urn: SPORTS_BROWSE_URN });

      expect(result).toStrictEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          didYouMeanLabel: undefined,
          noResultsLabel: undefined,
          numberOfResultsLabel: undefined,
          searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should create the results labels correctly when query and didYouMean is defined", () => {
      // Arrange
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: "teste",
        query: "test",
        formattedResults: [
          {
            type: "COMPETITION_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:competition:59",
            url: "football/dutch-eerste-divise/competition:59",
            name: "Sporting v Porto",
            sportName: "Football",
          },
        ],
        inputSearchTerm: "search term",
      });

      // Act
      makeMapStateToProps()(STATE, { urn: "urn:browse" });

      // Assert
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.SEARCH.RESULTS",
        interpolationValues: { numberOfResults: "1", searchTerm: "teste" },
      });
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.SEARCH.DID_YOU_MEAN",
        interpolationValues: { didYouMean: "teste" },
      });
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.SEARCH.YOUR_SEARCH",
        interpolationValues: { searchTerm: "test" },
      });
    });

    it("should create the results labels correctly when query is not greater than the search input limit", () => {
      // Arrange
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: "teste",
        query: "te",
        formattedResults: [
          {
            type: "COMPETITION_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:competition:59",
            url: "football/dutch-eerste-divise/competition:59",
            name: "Sporting v Porto",
            sportName: "Football",
          },
        ],
        inputSearchTerm: "search term",
      });

      // Act
      const results = makeMapStateToProps()(STATE, { urn: "urn:browse" });

      expect(results).toEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          didYouMeanLabel: undefined,
          noResultsLabel: undefined,
          numberOfResultsLabel: undefined,
          searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should create the results labels correctly when numberOfResults is equal to 0", () => {
      // Arrange
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: undefined,
        query: "Sport",
        formattedResults: [],
        inputSearchTerm: "search term",
      });

      // Act
      const results = makeMapStateToProps()(STATE, { urn: "urn:browse" });

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.SEARCH.RESULTS",
        interpolationValues: { numberOfResults: "0", searchTerm: "Sport" },
      });
      expect(results).toEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          didYouMeanLabel: undefined,
          noResultsLabel: undefined,
          numberOfResultsLabel: "I18N.SEARCH.RESULTS",
          searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should initialize Browse component with the correct props", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: "aaaa",
        query: "Sport",
        formattedResults: [
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:event:29662647",
            url: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
            name: "Helmond Sport v Den Bosch",
            competition: "Dutch Eerste Divisie",
            date: new Date("2020-01-24T19:00:00.000Z"),
            sportId: "1",
            sportName: "Football",
          },
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:event:29662645",
            url: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
            name: "Helmond Sport v Den Bosch",
            competition: "Dutch Eerste Divisie",
            date: new Date("2020-01-11T15:15:00Z"),
            sportId: "1",
            sportName: "Football",
          },
          {
            name: "German Bundesliga",
            logo: "logoUrl",
            sportName: "Football",
            type: "COMPETITION_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:competition:59",
            url: "football/dutch-eerste-divise/competition:59",
            sportId: "1",
          },
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:event:29662647",
            url: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
            name: "Helmond Sport v Den Bosch",
            competition: "Dutch Eerste Divisie",
            date: new Date("2020-01-24T19:00:00.000Z"),
            sportId: "7",
            sportName: "Horse Racing",
          },
        ],
        inputSearchTerm: "search term",
      });

      getSportFilters.mockReturnValue(sportsFiltersMock);

      formatDateWithToday.mockReturnValueOnce("DATE FORMAT").mockReturnValue("I18N.DATE.TODAY");

      const result = makeMapStateToProps()(STATE, { urn: SPORTS_BROWSE_URN, isDesktop: false });
      expect(result).toStrictEqual({
        query: "Sport",
        searchResults: [
          {
            context: `Dutch Eerste Divisie - DATE FORMAT, TIME FORMAT`,
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
              viewUrn: "ppb:tbd:view:event:29662647",
            },
            name: "Helmond Sport v Den Bosch",
            sportId: "1",
            sportName: "Football",
          },
          {
            context: `Dutch Eerste Divisie - I18N.DATE.TODAY, TIME FORMAT`,
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
              viewUrn: "ppb:tbd:view:event:29662645",
            },
            name: "Helmond Sport v Den Bosch",
            sportId: "1",
            sportName: "Football",
          },
          {
            context: "Football",
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/competition:59",
              viewUrn: "ppb:tbd:view:competition:59",
            },
            logo: true,
            imageURL: "logoUrl",
            name: "German Bundesliga",
            sportId: "1",
            sportName: "Football",
          },
          {
            context: "Dutch Eerste Divisie - I18N.DATE.TODAY, TIME FORMAT",
            name: "Helmond Sport v Den Bosch",
            sportId: "7",
            sportName: "Horse Racing",
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
              viewUrn: "ppb:tbd:view:event:29662647",
            },
          },
        ],
        isDesktop: false,
        inputSearchTerm: "search term",
        cancel: "I18N.SEARCH.CANCEL",
        didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
        noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
        numberOfResultsLabel: "I18N.SEARCH.RESULTS",
        searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        searchHistoryLabel: "I18N.SEARCH.HISTORY.LABEL",
        items: [
          {
            typename: "QuickLinksCard",
            urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
          },
        ],
        shouldHandleOnBlur: true,
        sportFilters: sportsFiltersMock,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchPushAction", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

      expect(dispatchPushAction(viewLinkMock)).toEqual({
        payload: viewLinkMock,
        type: PUSH,
      });
    });
  });

  describe("dispatchSearchInputChangeAction", () => {
    it("should dispatch search input change action", () => {
      const { dispatchSearchInputChangeAction } = mapDispatchToProps;

      expect(dispatchSearchInputChangeAction("text")).toEqual({
        payload: { text: "text" },
        type: UI__SEARCH_INPUT_CHANGE,
      });
    });
  });

  describe("dispatchSearchInputChangeClearAction", () => {
    it("should dispatch search input change clear action", () => {
      const { dispatchSearchInputChangeClearAction } = mapDispatchToProps;

      expect(dispatchSearchInputChangeClearAction(SPORTS_BROWSE_URN)).toEqual({
        type: UI__SEARCH_INPUT_CHANGE_CLEAR,
        payload: { urn: SPORTS_BROWSE_URN },
      });
    });
  });

  describe("dispatchSearchClearResultsAction", () => {
    it("should dispatch search clear results action", () => {
      const { dispatchSearchClearResultsAction } = mapDispatchToProps;

      expect(dispatchSearchClearResultsAction("text", SPORTS_BROWSE_URN)).toEqual({
        payload: { text: "text", urn: SPORTS_BROWSE_URN },
        type: UI__CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe("dispatchSearchLinkClick", () => {
    it("should dispatch search link click action", () => {
      const { dispatchSearchLinkClick } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      const indexMock = 1;
      const nameMock = "name";
      const numberOfResultsMock = 5;

      expect(dispatchSearchLinkClick("text", viewLinkMock, indexMock, nameMock, numberOfResultsMock)).toEqual({
        payload: {
          text: "text",
          url: viewLinkMock.viewUrl,
          order: indexMock,
          name: nameMock,
          numberOfResults: numberOfResultsMock,
        },
        type: UI__SEARCH_LINK_CLICK,
      });
    });
  });

  describe("dispatchSearchCancelAction", () => {
    it("should dispatch search cancel action", () => {
      const { dispatchSearchCancelAction } = mapDispatchToProps;

      expect(dispatchSearchCancelAction("text", SPORTS_BROWSE_URN)).toEqual({
        payload: { text: "text", urn: SPORTS_BROWSE_URN },
        type: UI__SEARCH_CANCEL_CLICK,
      });
    });
  });

  describe("dispatchSearchBarFocusAction", () => {
    it("should dispatch searchbar focus action", () => {
      const { dispatchSearchBarFocusAction } = mapDispatchToProps;

      expect(dispatchSearchBarFocusAction()).toEqual({
        type: UI__SEARCH_BAR_FOCUS,
      });
    });
  });

  describe("dispatchSportsFilterClickAction", () => {
    it("should dispatch sports filter click action", () => {
      const { dispatchSportsFilterClickAction } = mapDispatchToProps;

      expect(dispatchSportsFilterClickAction("football", "real")).toEqual({
        type: UI__SPORTS_FILTER_CLICK,
        payload: {
          sportFilter: "football",
          searchTerm: "real",
        },
      });
    });
  });

  describe("dispatchHistoryClickAction", () => {
    it("should dispatch search history click action", () => {
      const { dispatchHistoryClickAction } = mapDispatchToProps;

      expect(dispatchHistoryClickAction("text")).toEqual({
        payload: { text: "text" },
        type: UI__SEARCH_HISTORY_CLICK,
      });
    });
  });
});
