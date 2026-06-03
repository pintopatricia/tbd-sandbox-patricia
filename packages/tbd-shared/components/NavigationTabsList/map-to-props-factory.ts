import type { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import {
  FETCH_CARDS,
  FETCH_CARDS_FROM_LIST,
  TAB_ROUTE_UPDATE,
  type FetchCardsAction,
  type FetchCardsFromListAction,
  type TabRouteUpdateAction,
} from "@ppb/tbd-store/actions";
import { type NavigationTabClickAction, UI__NAVIGATION_TAB_CLICK } from "@ppb/tbd-store/actions/interface";
import type { ApplicationState, PartialItem } from "@ppb/tbd-store/state";
import type URN from "@ppb/tbd-store/state/layout/URN";
import type { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import type { NavigationTabListHeader } from "@ppb/tbd-store/state/layout/navigation-tabs-list/NavigationTabsList.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import type { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { getIcon } from "../../helpers/icon";
import {
  createNavigationTabsLayoutByURNSelector,
  type NavigationTabsLayout,
} from "../../view-model-factories/navigation-tabs-layout";

export type ContainerProps = {
  urn: URN;
  stickyTabs?: boolean;
};

type Header = NavigationTabListHeader & {
  icon?: Icons;
};

export type CardProps = NavigationTabsLayout & {
  headers: Header[];
};

export type StateProps = CardProps | Record<string, never>;

const EMPTY_STATE = {};

const createHeadersSelector = () =>
  createSelector([(headers: NavigationTabListHeader[]) => headers], (headers): Header[] =>
    headers.map((header) => ({ ...header, icon: getIcon(header.icon) })),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();
  const getHeaders = createHeadersSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    let localeCode: string;
    try {
      localeCode = getUserDetails(state).localeCode;
    } catch (e) {
      console.error(e);
      return EMPTY_STATE;
    }

    const navigationTabsLayout = getNavigationTabsLayout(state, { urn, localeCode });

    if (!navigationTabsLayout) {
      return EMPTY_STATE;
    }

    return {
      ...navigationTabsLayout,
      headers: getHeaders(navigationTabsLayout.headers),
    };
  };
};

const dispatchFetchCardsFromList = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

const dispatchFetchCards = (urns: string[]): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns,
  },
});

const dispatchOnTabClick = (label: string, urn: string): NavigationTabClickAction => ({
  type: UI__NAVIGATION_TAB_CLICK,
  payload: {
    label,
    urn,
  },
});

const dispatchOnTabSwitch = (
  tabsListURN: string,
  selectedTabUrn: string,
  viewLink?: ViewLink,
): TabRouteUpdateAction => ({
  type: TAB_ROUTE_UPDATE,
  payload: {
    tabsListURN,
    selectedTabUrn,
    viewLink,
  },
});

export type DispatchProps = {
  dispatchFetchCardsFromList: typeof dispatchFetchCardsFromList;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchOnTabClick: typeof dispatchOnTabClick;
  dispatchOnTabSwitch: typeof dispatchOnTabSwitch;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCardsFromList,
  dispatchFetchCards,
  dispatchOnTabClick,
  dispatchOnTabSwitch,
};
