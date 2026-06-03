import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSearchBarStateInterfaceSelector } from "@ppb/tbd-store/state/layout/search-bar-state/search-bar-state-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import {
  UI__SEARCH_BAR_INPUT_CHANGE,
  UI__SEARCH_BAR_INPUT_CHANGE_CLEAR,
  UI__SEARCH_BAR_INPUT_FOCUS,
  UI__SPORTS_FILTER_CLICK,
  UI__SEARCH_HISTORY_CLICK,
} from "@ppb/tbd-store/actions/search-bar-state";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { formatDateWithToday } from "../../helpers/dates";

const SEARCHBAR_URN = "uniqueSearchBarURN";

const getSearchBarStateInterface = jest.fn(() => ({
  formattedResults: [{ name: "Porto v Gil Vicente" }],
  query: "foot",
  didYouMean: null,
  inputSearchTerm: "foot",
}));

const getSearchBarCardByURN = jest.fn(() => ({
  placeholder: "Search Text",
  urn: SEARCHBAR_URN,
  title: "Search",
  typename: "SearchBarCard",
}));

const getCountryLocalCurrencyCodeSelector = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getSearchBarCardByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/search-bar-state/search-bar-state-selectors", () => ({
  createSearchBarStateInterfaceSelector: jest.fn(() => getSearchBarStateInterface),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "TIME FORMAT"),
  utcTime: jest.fn(() => 1622026846690),
}));

global.Date.now = jest.fn(() => new Date("2020-01-11T15:15:00Z"));

const STATE = {
  layouts: {
    cards: {
      searchBar: {
        uniqueSearchBarURN: {
          placeholder: "Placeholder",
          title: "Title",
          type: "SearchBarCard",
          urn: "uniqueSearchBarURN",
        },
      },
    },
  },
  entities: { races: {} },
};

const STATE_WITH_ONE_RESULT = {
  layouts: {
    cards: {
      searchBar: {
        uniqueSearchBarURN: {
          placeholder: "Placeholder",
          title: "Title",
          type: "SearchBarCard",
          urn: "uniqueSearchBarURN",
        },
      },
    },
    searchBarState: {
      searchBar: {
        search: {
          uniqueSearchBarURN: {
            result: {
              items: [{ name: "Porto v Gil Vicente" }],
              query: "Port",
            },
            inputSearchTerm: "search term",
          },
        },
      },
    },
  },
};

describe("SearchBarCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("getStaticLabels", () => {
      let mapStateToProps;
      beforeEach(() => {
        getSearchBarStateInterface.mockReturnValue({
          formattedResults: [],
          query: "",
          didYouMean: null,
          inputSearchTerm: "",
        });
        mapStateToProps = makeMapStateToProps();
      });

      it("should invoke i18n for page on mapStateToProps call", () => {
        mapStateToProps(STATE, { urn: SEARCHBAR_URN });

        expect(i18n).toHaveBeenCalledWith({ key: "I18N.SEARCH.CANCEL" });
      });

      it("should not call i18n again when locale code is the same", () => {
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
        mapStateToProps(STATE, { urn: SEARCHBAR_URN });

        expect(i18n).toHaveBeenCalledTimes(2);
        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.SEARCH.CANCEL" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.SEARCH.HISTORY.LABEL" });

        mapStateToProps(STATE, { urn: SEARCHBAR_URN });
        expect(i18n).toHaveBeenCalledTimes(2);
      });

      it("should call i18n again when locale code is not the same", () => {
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
        mapStateToProps(STATE, { urn: SEARCHBAR_URN });

        expect(i18n).toHaveBeenCalledTimes(2);
        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.SEARCH.CANCEL" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.SEARCH.HISTORY.LABEL" });

        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "en" });

        mapStateToProps(STATE, { urn: SEARCHBAR_URN });
        expect(i18n).toHaveBeenCalledTimes(4);
        expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.SEARCH.CANCEL" });
        expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.SEARCH.HISTORY.LABEL" });
      });
    });

    describe("when it has results", () => {
      it("should return a model with search interface", () => {
        getSearchBarStateInterface.mockReturnValue({
          formattedResults: [{ name: "Sporting v Porto" }],
          query: "Sport",
          didYouMean: undefined,
          inputSearchTerm: "Sport",
        });
        makeMapStateToProps()(STATE, { urn: SEARCHBAR_URN });
        expect(getSearchBarStateInterface).toHaveBeenCalledWith(STATE, SEARCHBAR_URN);
        expect(getSearchBarStateInterface).toHaveBeenCalledTimes(1);
      });

      it("should map the search results correctly", () => {
        getSearchBarStateInterface.mockReturnValue({
          query: "Sport",
          didYouMean: undefined,
          inputSearchTerm: "Sport",
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
        });
        formatDateWithToday.mockReturnValueOnce("DATE FORMAT").mockReturnValue("I18N.DATE.TODAY");
        const result = makeMapStateToProps()(STATE_WITH_ONE_RESULT, { urn: SEARCHBAR_URN });
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
            context: `Dutch Eerste Divisie-DATE FORMAT, TIME FORMAT`,
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
              viewUrn: "ppb:tbd:view:event:29662647",
            },
            name: "Helmond Sport v Den Bosch",
            sportId: "1",
            sportName: "Football",
          },
          {
            context: `Dutch Eerste Divisie-I18N.DATE.TODAY, TIME FORMAT`,
            viewLink: {
              viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
              viewUrn: "ppb:tbd:view:event:29662645",
            },
            name: "Helmond Sport v Den Bosch",
            sportId: "1",
            sportName: "Football",
          },
          {
            context: `Maybe 2k GME-I18N.DATE.TODAY, TIME FORMAT`,
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
    });

    describe("mapDispatchToProps", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it("should create selector for searchbar card", () => {
        makeMapStateToProps();
        expect(createSearchBarStateInterfaceSelector).toHaveBeenCalledTimes(1);
        expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
      });

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
            type: UI__SEARCH_BAR_INPUT_CHANGE,
          });
        });
      });

      describe("dispatchSearchInputChangeClearAction", () => {
        it("should dispatch search input change clear action", () => {
          const { dispatchSearchInputChangeClearAction } = mapDispatchToProps;

          expect(dispatchSearchInputChangeClearAction("searchedTerm", SEARCHBAR_URN)).toEqual({
            type: UI__SEARCH_BAR_INPUT_CHANGE_CLEAR,
            payload: { urn: SEARCHBAR_URN, text: "searchedTerm" },
          });
        });
      });

      describe("dispatchSearchBarFocusAction", () => {
        it("should dispatch searchbar focus action", () => {
          const { dispatchSearchBarFocusAction } = mapDispatchToProps;

          expect(dispatchSearchBarFocusAction()).toEqual({
            type: UI__SEARCH_BAR_INPUT_FOCUS,
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
  });
});
