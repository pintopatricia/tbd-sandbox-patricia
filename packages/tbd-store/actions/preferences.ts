import { LastViewedProductOption, ProductsOption, UserPreferences } from "../state/entities";
import URN from "../state/layout/URN";

/**
 * Action types
 */
export const NETWORK__SET_USER_PREFERENCE_SUCCESS = "NETWORK/SET_USER_PREFERENCE_SUCCESS";
export const NETWORK__SET_USER_PREFERENCE_FAILURE = "NETWORK/SET_USER_PREFERENCE_FAILURE";
export const UPDATE_MARKET_DEPTH = "UPDATE_MARKET_DEPTH";
export const UPDATE_TIME_FORM_COLLAPSE = "UPDATE_TIME_FORM_COLLAPSE";
export const UPDATE_PRODUCT_PREFERENCE = "UPDATE_PRODUCT_PREFERENCE";
export const UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE = "UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE";
export const UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS = "UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS";
export const UPDATE_EMBEDDED_CONTENT_COLLAPSE = "UPDATE_EMBEDDED_CONTENT_COLLAPSE";
export const UI__PREFERENCE_SINGLE_CHOICE_CLICK = "UI/PREFERENCE_SINGLE_CHOICE_CLICK";
export const UI__SWITCH_PRODUCT_PREFERENCE = "UI/SWITCH_PRODUCT_PREFERENCE";

//payload is mandatory per eventemitter typings
export type PreferenceUpdateEvents = {
  "@@SYNC/UPDATE_SINGLE_CHOICE_PREFERENCE": {};
};

export type PreferenceKey = keyof UserPreferences;

export type PreferenceStore = {
  identifier: PreferenceKey;
  identifierValue: UserPreferences[keyof UserPreferences];
};

/**
 * Action for successful set user preference
 */
export type SetUserPreferenceActionSuccess = {
  type: typeof NETWORK__SET_USER_PREFERENCE_SUCCESS;
  payload: PreferenceStore;
};

/**
 * Action for failed set user preference
 */
export type SetUserPreferenceActionFailure = {
  type: typeof NETWORK__SET_USER_PREFERENCE_FAILURE;
  error: string;
  payload: PreferenceStore;
};

export type UpdateMarketDepth = {
  type: typeof UPDATE_MARKET_DEPTH;
  payload: {
    isActive: boolean;
    urn: string;
  };
};

export type UpdateTimeFormCollapse = {
  type: typeof UPDATE_TIME_FORM_COLLAPSE;
  payload: {
    isCollapsed: boolean;
  };
};

export type UpdateEmbeddedContentCollapse = {
  type: typeof UPDATE_EMBEDDED_CONTENT_COLLAPSE;
  payload: {
    isCollapsed: boolean;
  };
};

export type PreferenceSingleChoiceClickAction = {
  type: typeof UI__PREFERENCE_SINGLE_CHOICE_CLICK;
  payload: {
    urn: URN;
    value: string;
  };
};

export type SwitchProductPreferenceAction = {
  type: typeof UI__SWITCH_PRODUCT_PREFERENCE;
  payload: {
    productSwitcherPreference: ProductsOption;
  };
};

export type UpdateProductPreferenceAction = {
  type: typeof UPDATE_PRODUCT_PREFERENCE;
  payload: {
    productSwitcherPreference: ProductsOption;
  };
};

type LastViewedActionPayload = {
  urn: URN;
  value: LastViewedProductOption;
};

export type UpdateLastViewedProductPreferenceAction = {
  type: typeof UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE;
  payload: LastViewedActionPayload;
};

export type UpdateLastViewedProductPreferenceSuccessAction = {
  type: typeof UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS;
  payload: {
    lastViewedProductPreference: LastViewedProductOption;
  };
};
