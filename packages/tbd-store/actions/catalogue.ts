import { createAction } from "@reduxjs/toolkit";
import { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import { FilteredGroupSort, GetWebMessagesQuery } from "../clients/catalogue/catalogue-response-types";
import { TransformedLayout } from "../services/catalogue/catalogue-types";
import { Receipt } from "../state/entities/Receipt.types";
import { SettingsPreferences, SingleChoicePreferences } from "../state/entities";
import { AccountBannerOnError, BannerCTA } from "../state/layout/cards/Card.types";
import { PartialItem } from "../state/layout/views/PartialItem.types";
import { FilterByInput } from "../state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import URN from "../state/layout/URN";
import { SelectableItemsFilterOptions } from "../state/constants";
import { SelectionPromoCardEvents } from "@ppb/tbd-components-promotions/components/SelectionPromoCard/viewmodel/events";

export const FETCH_CATALOGUE = "FETCH_CATALOGUE";
export const FETCH_CATALOGUE_IN_PROGRESS = "FETCH_CATALOGUE_IN_PROGRESS";
export const FETCH_CATALOGUE_SUCCESS = "FETCH_CATALOGUE_SUCCESS";
export const FETCH_CATALOGUE_CLEAN_UP = "FETCH_CATALOGUE_CLEAN_UP";
export const FETCH_CATALOGUE_FAILURE = "FETCH_CATALOGUE_FAILURE";
export const FETCH_CATALOGUE_EMPTY_VIEW_FAILURE = "FETCH_CATALOGUE_EMPTY_VIEW_FAILURE";
export const FETCH_CATALOGUE_AUTH_FAILURE = "FETCH_CATALOGUE_AUTH_FAILURE";
export const FETCH_CATALOGUE_RATE_LIMIT_FAILURE = "FETCH_CATALOGUE_RATE_LIMIT_FAILURE";
export const FETCH_MORE_CATALOGUE = "FETCH_MORE_CATALOGUE";
export const DELETE_VIEW = "DELETE_VIEW";
export const DELETE_VIEW_ITEMS = "DELETE_VIEW_ITEMS";
export const DELETE_LAYOUT = "DELETE_LAYOUT";
export const FETCH_CARDS = "FETCH_CARDS";
export const FETCH_FULL_CARD = "FETCH_FULL_CARD";
export const FETCH_CARDS_FROM_LIST = "FETCH_CARDS_FROM_LIST";
export const FETCH_MORE_GRID = "FETCH_MORE_GRID";
export const FETCH_FILTERED_COUPON = "FETCH_FILTERED_COUPON";
export const FETCH_FILTERED_SELECTABLE_ITEMS = "FETCH_FILTERED_SELECTABLE_ITEMS";
export const SET_ERROR_BANNER = "SET_ERROR_BANNER";
export const UPDATE_CURRENT_BANNER = "UPDATE_CURRENT_BANNER";
export const BANNER_ACTION_REQUEST = "BANNER_ACTION_REQUEST";
export const SUBSCRIBE_JACKPOT = "SUBSCRIBE_JACKPOT";
export const UNSUBSCRIBE_JACKPOT = "UNSUBSCRIBE_JACKPOT";
export const FETCH_RUNNERS_ORDER_UPDATES_SUCCESS = "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS";
export const FETCH_MAIN_MARKETS_UPDATES_SUCCESS = "FETCH_MAIN_MARKETS_UPDATES_SUCCESS";
export const FETCH_MAIN_MARKETS_UPDATES_FAILURE = "FETCH_MAIN_MARKETS_UPDATES_FAILURE";
export const FETCH_RUNNERS_ORDER_UPDATES_FAILURE = "FETCH_RUNNERS_ORDER_UPDATES_FAILURE";
export const UPDATE_PREFERENCE_FAILURE = "UPDATE_PREFERENCE_FAILURE";
export const UPDATE_PREFERENCE_IN_PROGRESS = "UPDATE_PREFERENCE_IN_PROGRESS";
export const UPDATE_PREFERENCE_SUCCESS = "UPDATE_PREFERENCE_SUCCESS";
export const PAGE_LOAD_SUCCESS = "PAGE_LOAD_SUCCESS";
export const NETWORK__SBK_MARKETS_IN_PROGRESS = "NETWORK/SBK_MARKETS_IN_PROGRESS";
export const NETWORK__SBK_MARKETS_SUCCESS = "NETWORK/SBK_MARKETS_SUCCESS";
export const NETWORK__SBK_MARKETS_FAILURE = "NETWORK/IMPLY_EXC_BET_FAILURE";
export const WEB_MESSAGES_MODULE_LOADED = "FETCH_WEB_MESSAGES_MODULE_LOADED";
export const FETCH_WEB_MESSAGES_SUCCESS = "FETCH_WEB_MESSAGES_SUCCESS";
export const READ_WEB_MESSAGE_SUCCESS = "READ_WEB_MESSAGE_SUCCESS";
export const READ_WEB_MESSAGE_FAILURE = "READ_WEB_MESSAGE_FAILURE";
export const FETCH_WEB_MESSAGES = "FETCH_WEB_MESSAGES";
export const READ_WEB_MESSAGE = "READ_WEB_MESSAGE";
export const OPTIN_LOYALTY_PROMOTION_SUCCESS = "OPTIN_LOYALTY_PROMOTION_SUCCESS";

export type CatalogueEvents = {
  "@@NETWORK/SBK_MARKETS_SUCCESS": SportsbookMarketsSuccessAction["payload"];
  "@@TRACKING/ADDED_SELECTION_FINISHED": {};
  "@@UI/SELECTION_PROMO_CARD_PROMO_TAP_BANNER_TAGGING_FINISHED": SelectionPromoCardEvents["@@UI/SELECTION_PROMO_CARD_PROMO_TAP"];
};

export type BannerActionRequest = {
  type: typeof BANNER_ACTION_REQUEST;
  payload: {
    urn: URN;
    index: number;
    bannerAction: BannerCTA;
  };
};

export type SetErrorBannerAction = {
  type: typeof SET_ERROR_BANNER;
  payload: {
    urn: URN;
    errorBanner: AccountBannerOnError;
  };
};

export type UpdateCurrentBannerAction = {
  type: typeof UPDATE_CURRENT_BANNER;
  payload: {
    urn: URN;
    index: number;
  };
};

export type DeleteViewAction = {
  type: typeof DELETE_VIEW;
  payload: URN;
};

export type DeleteViewItems = {
  type: typeof DELETE_VIEW_ITEMS;
  payload: URN[];
  force?: boolean;
};

export type DeleteLayoutAction = {
  type: typeof DELETE_LAYOUT;
};

export const deleteLayoutAction = createAction(DELETE_LAYOUT);

export type FetchCatalogueAction = {
  type: typeof FETCH_CATALOGUE;
  payload: { urn: URN; withBottomBar?: boolean; withLeftSidebar?: boolean; decorationsOnly?: boolean };
};

export type FetchCatalogueSuccessAction = {
  type: typeof FETCH_CATALOGUE_SUCCESS;
  payload: CatalogueServiceLayout & {
    requestedUrns?: URN[];
    withPagination?: boolean;
    forceRefreshComponent?: boolean;
  };
};

export const fetchCatalogueSuccessAction = createAction<
  FetchCatalogueSuccessAction["payload"],
  typeof FETCH_CATALOGUE_SUCCESS
>(FETCH_CATALOGUE_SUCCESS);

export type FetchCatalogueInProgressAction = {
  type: typeof FETCH_CATALOGUE_IN_PROGRESS;
  payload: URN;
};

export type FetchCatalogueFailureAction = {
  type: typeof FETCH_CATALOGUE_FAILURE;
  payload: {
    error: Error;
    urn?: URN;
  };
};

export const fetchCatalogueFailureAction = createAction<
  FetchCatalogueFailureAction["payload"],
  typeof FETCH_CATALOGUE_FAILURE
>(FETCH_CATALOGUE_FAILURE);

export type FetchCatalogueEmptyViewFailureAction = {
  type: typeof FETCH_CATALOGUE_EMPTY_VIEW_FAILURE;
};

export type FetchCatalogueAuthFailureAction = {
  type: typeof FETCH_CATALOGUE_AUTH_FAILURE;
  urn?: URN;
};

export type FetchCatalogueRateLimitFailureAction = {
  type: typeof FETCH_CATALOGUE_RATE_LIMIT_FAILURE;
  payload: {
    loggedIn: boolean;
  };
};

export type FetchMoreCatalogueAction = {
  type: typeof FETCH_MORE_CATALOGUE;
  payload: { urn: URN; cursor: string; numberOfFilledCardsInView?: number };
};

export type FetchCardsAction = {
  type: typeof FETCH_CARDS;
  payload: {
    urns: URN[];
    forceRefresh?: boolean;
    cursor?: string;
    first?: number;
    forceRefreshComponent?: boolean;
  };
};

export type FetchFullCardAction = {
  type: typeof FETCH_FULL_CARD;
  payload: URN;
};

export type FetchCardsFromListAction = {
  type: typeof FETCH_CARDS_FROM_LIST;
  payload: {
    urn: URN;
    partials: PartialItem[];
    numberOfCards?: number;
    ignoreFetchedCard?: boolean;
  };
};

export type FetchMoreGridAction = {
  type: typeof FETCH_MORE_GRID;
  payload: {
    categoryViewUrn: URN;
  };
};

export type FetchFilteredCouponAction = {
  type: typeof FETCH_FILTERED_COUPON;
  payload: {
    urn: URN;
    sortBy?: FilteredGroupSort;
    filterBy: FilterByInput;
  };
};

export type FetchFilteredSelectableItemsAction = {
  type: typeof FETCH_FILTERED_SELECTABLE_ITEMS;
  payload: {
    urn: URN;
    filterBy: {
      country: SelectableItemsFilterOptions;
    };
  };
};

export type FetchCatalogueCleanUpAction = {
  type: typeof FETCH_CATALOGUE_CLEAN_UP;
  payload: URN[];
};

export type SubscribeJackpotAction = {
  type: typeof SUBSCRIBE_JACKPOT;
  payload: {
    urn: string;
  };
};

export type UnsubscribeJackpotAction = {
  type: typeof UNSUBSCRIBE_JACKPOT;
  payload: {
    urn: string;
  };
};

export type FetchRunnersOrderUpdatesSuccessAction = {
  type: typeof FETCH_RUNNERS_ORDER_UPDATES_SUCCESS;
  payload: TransformedLayout;
};

export type FetchRunnersOrderUpdatesFailureAction = {
  type: typeof FETCH_RUNNERS_ORDER_UPDATES_FAILURE;
  error: string;
};

export type UpdatePreferenceSuccessAction = {
  type: typeof UPDATE_PREFERENCE_SUCCESS;
  payload: {
    settingsPreferences: SettingsPreferences;
    userPreferences: SingleChoicePreferences;
  };
};

export type UpdatePreferenceInProgressAction = {
  type: typeof UPDATE_PREFERENCE_IN_PROGRESS;
  payload: URN;
};

export type PageLoadSuccessAction = {
  type: typeof PAGE_LOAD_SUCCESS;
  payload: URN;
};

/**
 * Action for failed update preference
 */
export type UpdatePreferenceFailureAction = {
  type: typeof UPDATE_PREFERENCE_FAILURE;
  payload: Receipt;
};

export type FetchMainMarketsUpdatesSuccessAction = {
  type: typeof FETCH_MAIN_MARKETS_UPDATES_SUCCESS;
  payload: TransformedLayout;
};

export type FetchMainMarketsUpdatesFailureAction = {
  type: typeof FETCH_MAIN_MARKETS_UPDATES_FAILURE;
  error: string;
};

export type SportsbookMarketsInProgressAction = {
  type: typeof NETWORK__SBK_MARKETS_IN_PROGRESS;
};

export type SportsbookMarketsSuccessAction = {
  type: typeof NETWORK__SBK_MARKETS_SUCCESS;
  payload: CatalogueServiceLayout;
};

export type SportsbookMarketsFailureAction = {
  type: typeof NETWORK__SBK_MARKETS_FAILURE;
  payload: {
    error: string;
  };
};

export type FetchWebMessagesAction = {
  type: typeof FETCH_WEB_MESSAGES;
  payload: {
    postLoginSession: boolean;
  };
};

export type WebMessagesModuleLoadedAction = {
  type: typeof WEB_MESSAGES_MODULE_LOADED;
};

export type FetchWebMessagesSuccessAction = {
  type: typeof FETCH_WEB_MESSAGES_SUCCESS;
  payload: GetWebMessagesQuery;
};

export type ReadWebMessageAction = {
  type: typeof READ_WEB_MESSAGE;
  payload: {
    customerMessageId: string;
  };
};

export type ReadWebMessageSuccessAction = {
  type: typeof READ_WEB_MESSAGE_SUCCESS;
};

export type ReadWebMessageFailureAction = {
  type: typeof READ_WEB_MESSAGE_FAILURE;
};

export type OptinLoyaltyPromotionSuccessAction = {
  type: typeof OPTIN_LOYALTY_PROMOTION_SUCCESS;
  payload: {
    layout: TransformedLayout;
  };
};
