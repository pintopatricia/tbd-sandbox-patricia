import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { SearchBarCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  SearchBarInputChangeAction,
  UI__SEARCH_BAR_INPUT_CHANGE,
  UI__SEARCH_BAR_INPUT_FOCUS,
  SearchBarInputFocusAction,
  UI__SEARCH_BAR_INPUT_CHANGE_CLEAR,
  SearchBarInputChangeClearAction,
  SearchBarResultsLinkClickAction,
  SearchBarCancelAction,
  UI__SEARCH_BAR_LINK_CLICK,
  UI__SEARCH_LINK_CLICK,
  UI__SEARCH_BAR_CANCEL_CLICK,
  UI__SPORTS_FILTER_CLICK,
  SportsFilterClickAction,
  UI__SEARCH_HISTORY_CLICK,
  SearchHistoryClickAction,
} from "@ppb/tbd-store/actions/search-bar-state";
import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createSearchBarStateInterfaceSelector } from "@ppb/tbd-store/state/layout/search-bar-state/search-bar-state-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { SearchBarStateResultItem } from "@ppb/tbd-store/state/layout/search-bar-state/SearchBarState.types";

import { formatDateWithToday, formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { PebbleListItem } from "@ppb/the-wall-common/types";
import { createSportFiltersSelector } from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";

export type ContainerProps = { urn: URN };

export type CardProps = {
  title?: string;
  placeholder?: string;
  searchResults: SearchBarResultsListResult[];
  query: string;
  shouldHandleOnBlur: boolean;
  cancel: string;
  searchPlaceholder: string;
  numberOfResultsLabel?: string;
  didYouMeanLabel?: string;
  noResultsLabel?: string;
  searchHistoryLabel?: string;
  inputSearchTerm: string;
  sportFilters?: PebbleListItem[];
};

export type StateProps = CardProps | Record<string, never>;

type SearchBarResultItemProps = {
  name: string;
  context: string;
  logo?: boolean;
  imageURL?: string;
  sportId?: number;
  sportName?: string;
};

type SearchBarResultsListResult = {
  viewLink: ViewLink;
} & SearchBarResultItemProps;

type SearchResultData = { formattedResults: SearchBarStateResultItem[]; userDetails: UserDetails };

type ResultsLabel = { numberOfResultsLabel?: string; didYouMeanLabel?: string; noResultsLabel?: string };

type SearchResultListData = {
  query: string;
  numberOfResults: number;
  didYouMean?: string | null;
  localeCode: string | undefined;
};

const createSearchBarStateSelector = createSelectorCreator(
  defaultMemoize,
  (previousStats: SearchBarStateResultItem[], newStats: SearchBarStateResultItem[]) =>
    JSON.stringify(previousStats) === JSON.stringify(newStats),
);

export const createSearchResultsSelector = () =>
  createSearchBarStateSelector(
    [(res: SearchResultData) => res.formattedResults, (res) => res.userDetails],
    (results, { userDetails }): SearchBarResultsListResult[] => {
      const { localeCodeBcp47, timezone } = userDetails || {};
      return results.map((result) => {
        const viewLink = { viewUrn: result.urn, viewUrl: result?.url || "" };
        const sport = { sportId: result.sportId, sportName: result.sportName };

        let searchResultsData = {};
        if (result.type === "RACE_SEARCH_RESULT_ITEM" || result.type === "EVENT_SEARCH_RESULT_ITEM") {
          const time = formatTime(result.date, localeCodeBcp47, timezone);
          const eventDate = `${formatDateWithToday(result.date, localeCodeBcp47, timezone)}, ${time}`;

          searchResultsData = {
            context: `${
              result.type === "RACE_SEARCH_RESULT_ITEM" ? result.meetingName : result.competition
            }-${eventDate}`,
          };
        } else if (result.type === "COMPETITION_SEARCH_RESULT_ITEM") {
          searchResultsData = { context: result.sportName, logo: true, imageURL: result.logo };
        }

        return {
          name: result.name || "",
          context: "",
          viewLink,
          ...sport,
          ...searchResultsData,
        };
      });
    },
  );

export const createSearchResultListLabels = () =>
  createSelector(
    [
      (res: SearchResultListData) => res.query,
      (res: SearchResultListData) => res.numberOfResults,
      (res: SearchResultListData) => res.didYouMean,
      (res: SearchResultListData) => res.localeCode,
    ],
    (query, numberOfResults, didYouMean): ResultsLabel => {
      const searchTerm = didYouMean || query;

      let numberOfResultsLabel;
      let didYouMeanLabel;
      let noResultsLabel;

      if (query && query.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
        numberOfResultsLabel = i18n({
          key: "I18N.SEARCH.RESULTS",
          interpolationValues: { numberOfResults: numberOfResults.toString(), searchTerm },
        });

        if (didYouMean) {
          didYouMeanLabel = i18n({ key: "I18N.SEARCH.DID_YOU_MEAN", interpolationValues: { didYouMean } });
          noResultsLabel = i18n({ key: "I18N.SEARCH.YOUR_SEARCH", interpolationValues: { searchTerm: query } });
        }
      }

      return {
        numberOfResultsLabel,
        didYouMeanLabel,
        noResultsLabel,
      };
    },
  );
const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    cancel: i18n({ key: "I18N.SEARCH.CANCEL" }),
    searchHistoryLabel: i18n({ key: "I18N.SEARCH.HISTORY.LABEL" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSearchBarCardByURN = createCardByURNSelector<SearchBarCards, URN>();
  const getSearchResultsList = createSearchResultsSelector();
  const getSearchResultListLabels = createSearchResultListLabels();
  const getSearchBarInterfaceSearch = createSearchBarStateInterfaceSelector();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getSportFilters = createSportFiltersSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const searchBar = getSearchBarCardByURN(state.layouts.cards.searchBar, urn);
    const { formattedResults, query, didYouMean, inputSearchTerm } = getSearchBarInterfaceSearch(state, urn);

    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);

    if (!searchBar) {
      return {};
    }

    const translations = {
      searchBar: searchBar.placeholder ?? "",
      ...getStaticLabels(userDetails.localeCode),
      ...getSearchResultListLabels({
        query,
        numberOfResults: formattedResults.length,
        didYouMean: didYouMean || undefined,
        localeCode: userDetails.localeCode,
      }),
    };

    return {
      title: searchBar.title ?? "",
      searchPlaceholder: searchBar.placeholder ?? "",
      searchResults: getSearchResultsList({ formattedResults, userDetails }),
      sportFilters: getSportFilters({ formattedResults }),
      inputSearchTerm,
      query,
      shouldHandleOnBlur: true,
      ...translations,
    };
  };
};

const dispatchSearchResultsLinkClick = (
  query: string,
  viewLink: ViewLink,
  index: number,
  name: string,
  numberOfResults: number,
  isDesktop?: boolean,
): SearchBarResultsLinkClickAction => ({
  type: isDesktop ? UI__SEARCH_BAR_LINK_CLICK : UI__SEARCH_LINK_CLICK,
  payload: {
    text: query,
    url: viewLink.viewUrl,
    order: index,
    name,
    numberOfResults,
  },
});

const dispatchSearchInputChangeAction = (text: string, urn: string): SearchBarInputChangeAction => ({
  type: UI__SEARCH_BAR_INPUT_CHANGE,
  payload: { text, urn },
});

const dispatchSearchBarCancelAction = (text: string, urn: string): SearchBarCancelAction => ({
  type: UI__SEARCH_BAR_CANCEL_CLICK,
  payload: { text, urn },
});

const dispatchSearchInputChangeClearAction = (text: string, urn: string): SearchBarInputChangeClearAction => ({
  type: UI__SEARCH_BAR_INPUT_CHANGE_CLEAR,
  payload: { text, urn },
});

const dispatchSearchBarFocusAction = (): SearchBarInputFocusAction => ({
  type: UI__SEARCH_BAR_INPUT_FOCUS,
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchSportsFilterClickAction = (sportFilter: string, searchTerm: string): SportsFilterClickAction => ({
  type: UI__SPORTS_FILTER_CLICK,
  payload: { sportFilter, searchTerm },
});

const dispatchHistoryClickAction = (text: string): SearchHistoryClickAction => ({
  type: UI__SEARCH_HISTORY_CLICK,
  payload: { text },
});

export type DispatchProps = {
  dispatchSearchInputChangeAction: typeof dispatchSearchInputChangeAction;
  dispatchSearchBarFocusAction: typeof dispatchSearchBarFocusAction;
  dispatchSearchInputChangeClearAction: typeof dispatchSearchInputChangeClearAction;
  dispatchSearchBarCancelAction: typeof dispatchSearchBarCancelAction;
  dispatchSearchResultsLinkClick: typeof dispatchSearchResultsLinkClick;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchSportsFilterClickAction: typeof dispatchSportsFilterClickAction;
  dispatchHistoryClickAction: typeof dispatchHistoryClickAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSearchInputChangeAction,
  dispatchSearchBarFocusAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchResultsLinkClick,
  dispatchSearchBarCancelAction,
  dispatchPushAction,
  dispatchSportsFilterClickAction,
  dispatchHistoryClickAction,
};
