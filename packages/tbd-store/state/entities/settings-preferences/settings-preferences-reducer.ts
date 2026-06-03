import { codecs } from "@ppb/tbd-urn-codecs";
import { SettingsPreferences } from "./SettingsPreferences.types";

import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  UPDATE_PREFERENCE_SUCCESS,
  UpdatePreferenceSuccessAction,
} from "../../../actions/catalogue";
import {
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
  type BetslipSportsbookOddsMovementPrefChange,
} from "../../../actions/betslip";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | UpdatePreferenceSuccessAction
  | BetslipSportsbookOddsMovementPrefChange;

/** *******************************
 *  Settings Preferences reducer  *
 ******************************** */

export default (currentState: undefined | SettingsPreferences, action: ActionTypes): SettingsPreferences => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const preferences = action.payload.data.PreferenceSingleChoice || [];

      return preferences.reduce(
        (acc, preference) => {
          const { urn } = preference;
          return {
            ...acc,
            [urn]: preference,
          };
        },
        { ...state },
      );
    }

    case UPDATE_PREFERENCE_SUCCESS: {
      return {
        ...state,
        ...action.payload.settingsPreferences,
      };
    }

    case UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE: {
      const { payload } = action;

      const oddsMovementPrefURN = codecs.preference.singleChoice.encode("oddsMovement").uid;

      const oddsMovementPref = state[oddsMovementPrefURN];

      // only update if the preference already exists
      if (!oddsMovementPref) {
        return state;
      }

      const selectedValueIndex = oddsMovementPref.preferenceValues.findIndex(
        (preferenceValue) => preferenceValue.value === (payload.isOddsMovementAccepted ? "ON" : "OFF"),
      );

      return {
        ...state,
        [oddsMovementPrefURN]: {
          ...oddsMovementPref,
          selectedValueIndex,
        },
      };
    }

    default:
      return state;
  }
};
