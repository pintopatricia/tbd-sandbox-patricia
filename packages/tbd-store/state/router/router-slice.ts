import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchCatalogueSuccessAction, fetchCatalogueFailureAction } from "../../actions/catalogue";
import {
  myBetsHeritageToggleFilterClickAction,
  myBetsOrderStatusFilterClickAction,
  myBetsOrderTypeFilterClickAction,
  myBetsResetFiltersAction,
} from "../../actions/my-bets";
import { ViewLink } from "../layout/cards/ViewLink.types";
import URN from "../layout/URN";
import { RouterState } from "./RouterState.types";

export const INITIAL_STATE = {
  currentTabUrn: null,
  currentView: null,
  currentUrn: null,
  currentUrl: null,
  firstLocationKey: null,
  locationKey: null,
  isRefreshing: false,
  currentRoute: null,
  showBackButton: false,
};

type TabRouteUpdateActionPayload = {
  viewLink?: ViewLink;
  tabsListURN?: URN;
  selectedTabUrn?: URN;
};

/**
 * This shouldn't be done like this. These hardcoded links are basically what we have
 * on the bottom bar. The problem is that be bottom bar is configured on CMS. If anyone
 * changes this on Prismic, this code will fail.
 *
 * @param viewLink The page view link
 * @returns boolean
 */
function shouldDisableBackButton(viewLink: ViewLink, router: RouterState) {
  const blackListedUrns = [
    "ppb:tbd:view:generic:home",
    "ppb:tbd:view:myBets:",
    "ppb:tbd:view:browse:",
    "ppb:tbd:view:gaming:",
  ];

  if (router.locationKey === router.firstLocationKey) {
    return true;
  }

  return !!blackListedUrns.find((blackListedUrn) => viewLink?.viewUrn.startsWith(blackListedUrn));
}

function updateStateWithUrn(state: RouterState, payload: { viewUrn: string }) {
  if (payload) {
    const urn = codecs.parse(payload.viewUrn);

    state.currentView = urn?.type || null;
    state.currentUrn = urn?.uid || null;
    state.currentUrl = null;
  }
}

const routerSlice = createSlice({
  name: "Router",
  initialState: INITIAL_STATE as RouterState,
  reducers: {
    /** When we navigate to a page pushing a new route */
    push: (state, action: PayloadAction<ViewLink>) => {
      const urn = codecs.parse(action.payload.viewUrn);

      state.currentView = urn?.type || null;
      state.currentUrn = urn?.uid || null;
      state.currentUrl = action.payload.viewUrl;
      state.showBackButton = !shouldDisableBackButton(action.payload, state);
    },
    locationKey: (state, action: PayloadAction<string>) => {
      state.firstLocationKey = state.firstLocationKey || action.payload;
      state.locationKey = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshInProgress: (state, action: PayloadAction<{ urn: URN }>) => {
      state.isRefreshing = true;
    },
    /**
     * When the native bottom bar is pressed should navigate to a page pushing a new route
     * and don't want to load the catalog which is the case with PUSH action
     */
    bottomBarPush: (state, action: PayloadAction<ViewLink>) => {
      state.currentRoute = action.payload;
    },
    /**
     * When navigating to the apollo view, it shouldn't load the catalog which is the case with PUSH action
     */
    apolloViewPush: (state, action: PayloadAction<ViewLink & { type: EntityType }>) => {
      state.currentUrl = action.payload.viewUrl;
      state.currentUrn = action.payload.viewUrn;
      state.currentView = action.payload.type;
    },
    tabRouteUpdate: (state, action: PayloadAction<TabRouteUpdateActionPayload>) => {
      state.currentTabUrn = action.payload.selectedTabUrn || null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
      // if returned view is not one of the requested redirect to it
      const { router } = action.payload;
      const requestedUrns = action.payload.requestedUrns || [];

      if (
        router?.currentUrn &&
        router?.currentView &&
        router?.currentUrl != null && // should return true for home url that is ''
        !requestedUrns.includes(router.currentUrn)
      ) {
        state.currentUrl = router.currentUrl;
        state.currentUrn = router.currentUrn;
        state.currentView = router.currentView;
      }

      state.isRefreshing = false;
    });

    builder.addCase(fetchCatalogueFailureAction, (state) => {
      state.isRefreshing = false;
    });

    builder.addCase(myBetsOrderTypeFilterClickAction, (state, action) => {
      updateStateWithUrn(state, action.payload);
    });

    builder.addCase(myBetsHeritageToggleFilterClickAction, (state, action) => {
      updateStateWithUrn(state, action.payload);
    });

    builder.addCase(myBetsOrderStatusFilterClickAction, (state, action) => {
      updateStateWithUrn(state, action.payload);
    });

    builder.addCase(myBetsResetFiltersAction, (state, action) => {
      if (action.payload) {
        updateStateWithUrn(state, action.payload);
      }
    });
  },
});

export const { push, bottomBarPush, locationKey, refreshInProgress, apolloViewPush, tabRouteUpdate } =
  routerSlice.actions;

export default routerSlice.reducer;
