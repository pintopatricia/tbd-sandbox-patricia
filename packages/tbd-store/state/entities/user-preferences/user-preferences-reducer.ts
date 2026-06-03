import {
  ODDS_MOVEMENT_MAP,
  OddsMovementOptions,
  ProductsOption,
  SingleChoicePreferences,
  UserPreferences,
  UserPreferencesState,
} from "./UserPreferences.types";
import {
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
  BetslipSportsbookOddsMovementPrefChange,
} from "../../../actions/betslip";
import { UI__USER_PROFILE_EYE_ICON_CLICK, UserProfileMenuEyeIconClickAction } from "../../../actions/user-profile";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS, FetchAppContextSuccessAction } from "../../../actions/app-context";
import {
  UPDATE_MARKET_DEPTH,
  UPDATE_TIME_FORM_COLLAPSE,
  UPDATE_EMBEDDED_CONTENT_COLLAPSE,
  UPDATE_PRODUCT_PREFERENCE,
  UpdateMarketDepth,
  UpdateTimeFormCollapse,
  UpdateProductPreferenceAction,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
  UpdateLastViewedProductPreferenceSuccessAction,
  UpdateEmbeddedContentCollapse,
  NETWORK__SET_USER_PREFERENCE_FAILURE,
  SetUserPreferenceActionFailure,
} from "../../../actions/preferences";
import { UpdatePreferenceSuccessAction, UPDATE_PREFERENCE_SUCCESS } from "../../../actions/catalogue";
import { UI__MAINTENANCE_TO_PRODUCT, MaintenanceToProduct } from "../../../actions/navigation";

let ACCEPT_ODDS_MOVEMENT_PREV_STATE: boolean | undefined;

type ActionTypes =
  | UserProfileMenuEyeIconClickAction
  | BetslipSportsbookOddsMovementPrefChange
  | FetchAppContextSuccessAction
  | UpdateMarketDepth
  | UpdateTimeFormCollapse
  | UpdateEmbeddedContentCollapse
  | UpdatePreferenceSuccessAction
  | SetUserPreferenceActionFailure
  | UpdateLastViewedProductPreferenceSuccessAction
  | UpdateProductPreferenceAction
  | MaintenanceToProduct;

const parsePreferenceUpdate = (
  userPreference: SingleChoicePreferences,
  stateOddsMovement?: UserPreferences["oddsMovement"],
): Partial<UserPreferences> => {
  if ("oddsMovement" in userPreference) {
    const { oddsMovement } = userPreference;
    let updateOddsMovement = stateOddsMovement;
    if (oddsMovement && (oddsMovement === OddsMovementOptions.Off || oddsMovement === OddsMovementOptions.On)) {
      updateOddsMovement = ODDS_MOVEMENT_MAP[oddsMovement];
    }
    return {
      ...userPreference,
      oddsMovement: updateOddsMovement,
    };
  }
  return { ...userPreference, oddsMovement: stateOddsMovement };
};

/** **********************
 *  User preferences state reducer  *
 *********************** */
const userPreferencesReducer = (
  currentState: undefined | UserPreferencesState,
  action: ActionTypes,
): UserPreferencesState => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      if (action.payload.initialState?.entities?.preferences) {
        return {
          ...state,
          ...action.payload.initialState?.entities?.preferences,
        };
      }
      return state;
    }
    case UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE: {
      const { payload } = action;

      ACCEPT_ODDS_MOVEMENT_PREV_STATE = state.oddsMovement;

      return {
        ...state,
        oddsMovement: payload.isOddsMovementAccepted,
      };
    }
    case UI__USER_PROFILE_EYE_ICON_CLICK: {
      const { payload } = action;

      return {
        ...state,
        showBalances: payload.showBalances,
      };
    }
    case UPDATE_MARKET_DEPTH: {
      const { payload } = action;

      return {
        ...state,
        isMarketDepthActive: payload.isActive,
      };
    }
    case UPDATE_TIME_FORM_COLLAPSE: {
      const { payload } = action;

      return {
        ...state,
        isTimeFormCardCollapsed: payload.isCollapsed,
      };
    }
    case UPDATE_EMBEDDED_CONTENT_COLLAPSE: {
      const { payload } = action;

      return {
        ...state,
        isEmbeddedCardCollapsed: payload.isCollapsed,
      };
    }
    case UPDATE_PREFERENCE_SUCCESS: {
      const { userPreferences } = action.payload;
      const parsedPreferenceUpdate = parsePreferenceUpdate(userPreferences, state.oddsMovement);

      ACCEPT_ODDS_MOVEMENT_PREV_STATE = parsedPreferenceUpdate.oddsMovement;

      return {
        ...state,
        ...parsedPreferenceUpdate,
      };
    }

    case NETWORK__SET_USER_PREFERENCE_FAILURE: {
      return {
        ...state,
        oddsMovement: ACCEPT_ODDS_MOVEMENT_PREV_STATE || false,
      };
    }

    case UPDATE_PRODUCT_PREFERENCE: {
      const { payload } = action;

      if (payload.productSwitcherPreference === ProductsOption.games) {
        return state;
      }

      return {
        ...state,
        productSwitcherPreference: payload.productSwitcherPreference,
      };
    }
    case UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        lastViewedProduct: payload.lastViewedProductPreference,
      };
    }
    case UI__MAINTENANCE_TO_PRODUCT: {
      const { payload } = action;

      if (payload.product === ProductsOption.games) {
        return state;
      }

      return {
        ...state,
        productSwitcherPreference: payload.product,
      };
    }
    default:
      return state;
  }
};

export default userPreferencesReducer;
