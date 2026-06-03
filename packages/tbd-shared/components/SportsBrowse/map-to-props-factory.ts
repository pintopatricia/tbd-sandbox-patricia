import {
  SearchBarFocusAction,
  SearchCancelAction,
  SearchClearResultsAction,
  SearchHistoryClickAction,
  SearchInputChangeAction,
  SearchInputChangeClearAction,
  SearchLinkClickAction,
  SportsFilterClickAction,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_BAR_FOCUS,
  UI__SEARCH_BAR_LINK_CLICK,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__SEARCH_LINK_CLICK,
  UI__SEARCH_HISTORY_CLICK,
} from "@ppb/tbd-store/actions/browse";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import {
  createBrowseInterfaceSearchSelector,
  createSearchBarInterfaceSelector,
  createSportFiltersSelector,
} from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";
import { SearchResultItem } from "@ppb/tbd-store/state/layout/views/browse-view/Browse.types";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";

import { formatDateWithToday, formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { PebbleListItem } from "@ppb/the-wall-common/types";
import { UI__SPORTS_FILTER_CLICK } from "@ppb/tbd-store/actions/search-bar-state";

export type SearchResultItemProps = {
  name: string;
  context: string;
  logo?: boolean;
  imageURL?: string;
  sportId?: number;
  sportName?: string;
};

export type SearchResultsListResult = {
  viewLink: ViewLink;
} & SearchResultItemProps;

export type ContainerProps = {
  urn?: URN;
  isDesktop?: boolean;
};

export type StateProps = {
  items?: PartialItem[];
  searchResults: SearchResultsListResult[];
  query: string;
  inputSearchTerm: string;
  searchPlaceholder: string;
  cancel: string;
  didYouMeanLabel?: string;
  numberOfResultsLabel?: string;
  noResultsLabel?: string;
  searchHistoryLabel?: string;
  shouldHandleOnBlur: boolean;
  isDesktop?: boolean;
  sportFilters?: PebbleListItem[];
};

type ResultsLabel = { numberOfResultsLabel?: string; didYouMeanLabel?: string; noResultsLabel?: string };

type SearchResultListData = {
  query: string;
  numberOfResults: number;
  didYouMean?: string | null;
  localeCode: string | undefined;
};

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

      if (query.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
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

const createSearchSelector = createSelectorCreator(
  defaultMemoize,
  (previousStats: SearchResultItem[], newStats: SearchResultItem[]) =>
    JSON.stringify(previousStats) === JSON.stringify(newStats),
);

type SearchResultData = { formattedResults: SearchResultItem[]; userDetails: UserDetails };

export const createSearchResultsSelector = () =>
  createSearchSelector(
    [(res: SearchResultData) => res.formattedResults, (res) => res.userDetails],
    (results, userDetails): SearchResultsListResult[] => {
      const { localeCodeBcp47, timezone } = userDetails;
      return results.map((result) => {
        const viewLink = { viewUrn: result.urn, viewUrl: result.url ? result.url : "" };
        const sport = { sportId: result.sportId, sportName: result.sportName };

        if (result.type === "RACE_SEARCH_RESULT_ITEM") {
          const time = formatTime(result.date, localeCodeBcp47, timezone);
          const eventDate = `${formatDateWithToday(result.date, localeCodeBcp47, timezone)}, ${time}`;

          return { name: result.name, context: `${result.meetingName} - ${eventDate}`, viewLink, ...sport };
        }

        if (result.type === "EVENT_SEARCH_RESULT_ITEM") {
          const time = formatTime(result.date, localeCodeBcp47, timezone);
          const eventDate = `${formatDateWithToday(result.date, localeCodeBcp47, timezone)}, ${time}`;

          return { name: result.name, context: `${result.competition} - ${eventDate}`, viewLink, ...sport };
        }

        if (result.type === "COMPETITION_SEARCH_RESULT_ITEM") {
          return {
            name: result.name,
            context: result.sportName,
            viewLink,
            logo: true,
            imageURL: result.logo,
            ...sport,
          };
        }

        return { ...sport, name: "", context: "", viewLink };
      });
    },
  );

const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    searchPlaceholder: i18n({ key: "I18N.SEARCH.INPUT_PLACEHOLDER" }),
    cancel: i18n({ key: "I18N.SEARCH.CANCEL" }),
    searchHistoryLabel: i18n({ key: "I18N.SEARCH.HISTORY.LABEL" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewByURN = createFindViewByURNSelector();
  const getSearchBarInterfaceSearch = createSearchBarInterfaceSelector();
  const getBrowseInterfaceSearch = createBrowseInterfaceSearchSelector();
  const getSearchResultListLabels = createSearchResultListLabels();
  const getSearchResultsList = createSearchResultsSelector();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getSportFilters = createSportFiltersSelector();

  return (state: ApplicationState, { urn, isDesktop }: ContainerProps): StateProps => {
    const { formattedResults, query, didYouMean, inputSearchTerm } = !urn
      ? getSearchBarInterfaceSearch(state)
      : getBrowseInterfaceSearch(state, urn);
    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);

    const items = urn ? getViewByURN(state.layouts.views, urn)?.items ?? [] : [];
    // Filtering the Regulatory Card from the items. Note this component would be decommissioned soon after the new Browse Page Throttle `BROWSE_PAGE_PRISMIC` is turned on
    const filteredItems = items.filter(({ typename }) => typename !== "RegulatoryCard");

    return {
      searchResults: getSearchResultsList({ formattedResults, userDetails }),
      query,
      inputSearchTerm,
      items: filteredItems,
      shouldHandleOnBlur: true,
      sportFilters: getSportFilters({ formattedResults }),
      ...getStaticLabels(userDetails.localeCode),
      ...getSearchResultListLabels({
        query,
        numberOfResults: formattedResults.length,
        didYouMean: didYouMean || undefined,
        localeCode: userDetails.localeCode,
      }),
      isDesktop,
    };
  };
};

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchSearchInputChangeAction = (text: string, urn?: string): SearchInputChangeAction => ({
  type: UI__SEARCH_INPUT_CHANGE,
  payload: { text, urn },
});

const dispatchSearchInputChangeClearAction = (urn?: string): SearchInputChangeClearAction => ({
  type: UI__SEARCH_INPUT_CHANGE_CLEAR,
  payload: { urn },
});

const dispatchSearchClearResultsAction = (text: string, urn?: string): SearchClearResultsAction => ({
  type: UI__CLEAR_SEARCH_RESULTS,
  payload: { text, urn },
});

const dispatchSearchLinkClick = (
  query: string,
  viewLink: ViewLink,
  index: number,
  name: string,
  numberOfResults: number,
  isDesktop?: boolean,
): SearchLinkClickAction => ({
  type: isDesktop ? UI__SEARCH_BAR_LINK_CLICK : UI__SEARCH_LINK_CLICK,
  payload: {
    text: query,
    url: viewLink.viewUrl,
    order: index,
    name,
    numberOfResults,
  },
});

const dispatchSearchCancelAction = (text: string, urn: string): SearchCancelAction => ({
  type: UI__SEARCH_CANCEL_CLICK,
  payload: { text, urn },
});

const dispatchSearchBarFocusAction = (): SearchBarFocusAction => ({
  type: UI__SEARCH_BAR_FOCUS,
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
  dispatchPushAction: typeof dispatchPushAction;
  dispatchSearchInputChangeAction: typeof dispatchSearchInputChangeAction;
  dispatchSearchInputChangeClearAction: typeof dispatchSearchInputChangeClearAction;
  dispatchSearchClearResultsAction: typeof dispatchSearchClearResultsAction;
  dispatchSearchLinkClick: typeof dispatchSearchLinkClick;
  dispatchSearchCancelAction: typeof dispatchSearchCancelAction;
  dispatchSearchBarFocusAction: typeof dispatchSearchBarFocusAction;
  dispatchSportsFilterClickAction: typeof dispatchSportsFilterClickAction;
  dispatchHistoryClickAction: typeof dispatchHistoryClickAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchSearchInputChangeAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchClearResultsAction,
  dispatchSearchLinkClick,
  dispatchSearchCancelAction,
  dispatchSearchBarFocusAction,
  dispatchSportsFilterClickAction,
  dispatchHistoryClickAction,
};
