import { createAction } from "@reduxjs/toolkit";
import URN from "../state/layout/URN";
import { ViewLink } from "../state/layout/views/ViewLink.types";
import {
  push,
  locationKey,
  refreshInProgress,
  bottomBarPush,
  apolloViewPush,
  tabRouteUpdate,
} from "../state/router/router-slice";

export const PUSH = push.type;
export type PushAction = ReturnType<typeof push>;

export const LOCATION_KEY = locationKey.type;
export type LocationKeyAction = ReturnType<typeof locationKey>;

export const REFRESH_IN_PROGRESS = refreshInProgress.type;
export type RefreshInProgressAction = ReturnType<typeof refreshInProgress>;

export const BOTTOM_BAR_PUSH = bottomBarPush.type;
export type BottomBarPushAction = ReturnType<typeof bottomBarPush>;

export const APOLLO_VIEW_PUSH = apolloViewPush.type;
export type ApolloViewPushAction = ReturnType<typeof apolloViewPush>;

// When we navigate to the same view
export const PUSH_SAME_VIEW = "ROUTER/PUSH_SAME_VIEW";

export type PushSameViewAction = {
  type: typeof PUSH_SAME_VIEW;
  payload: ViewLink;
};

export const pushSameViewAction = createAction<PushSameViewAction["payload"], typeof PUSH_SAME_VIEW>(PUSH_SAME_VIEW);

export const VIEW_REDIRECT = "ROUTER/VIEW_REDIRECT";

export type ViewRedirectAction = {
  type: typeof VIEW_REDIRECT;
  payload: ViewLink;
};

export const viewRedirectAction = createAction<ViewRedirectAction["payload"], typeof VIEW_REDIRECT>(VIEW_REDIRECT);

export const REFRESH = "ROUTER/REFRESH";
export type RefreshAction = {
  type: typeof REFRESH;
  payload: {
    urn: URN;
    shouldRefreshBottomBar?: boolean;
  };
};

// When we navigate with back/forward into history
export const HISTORY = "ROUTER/HISTORY";
export type HistoryAction = {
  type: typeof HISTORY;
  payload: {
    key: string;
    type: string;
  };
};

// When we don't know if the navigation is internal or external to our app
export const GENERIC_PUSH = "ROUTER/GENERIC_PUSH";
export type GenericPushAction = {
  type: typeof GENERIC_PUSH;
  payload: ViewLink;
};

// When we know that the navigation is external to our app
export const EXTERNAL_PUSH = "ROUTER/EXTERNAL_PUSH";
export type ExternalPushAction = {
  type: typeof EXTERNAL_PUSH;
  payload: ViewLink;
};

// When we know that the navigation is external to our app and open in a new tab
export const EXTERNAL_PUSH_BLANK = "ROUTER/EXTERNAL_PUSH_BLANK";
export type ExternalPushBlankAction = {
  type: typeof EXTERNAL_PUSH_BLANK;
  payload: ViewLink;
};

// When a tab is clicked and the url should be updated without adding navigation history
export const TAB_ROUTE_UPDATE = tabRouteUpdate.type;
export type TabRouteUpdateAction = ReturnType<typeof tabRouteUpdate>;
