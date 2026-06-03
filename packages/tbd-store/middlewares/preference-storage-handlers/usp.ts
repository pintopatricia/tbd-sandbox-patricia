import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import {
  BetslipSportsbookOddsMovementPrefChange,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "../../actions/betslip";
import {
  SetUserPreferenceActionSuccess,
  NETWORK__SET_USER_PREFERENCE_SUCCESS,
  SetUserPreferenceActionFailure,
  NETWORK__SET_USER_PREFERENCE_FAILURE,
  PreferenceStore,
} from "../../actions/preferences";
import userSharedPreferencesService from "../../services/user-shared-preferences-service";
import { UserProfileMenuEyeIconClickAction, UI__USER_PROFILE_EYE_ICON_CLICK } from "../../actions/user-profile";

type StringBoolean = "0" | "1";
type OddsMovementPreference = {
  name: "general.betAcceptance";
  value: StringBoolean;
};
type ShowBalancesPreference = {
  name: "maw.show.balances";
  value: StringBoolean;
};
type Preference<T> = PreferenceStore & T;

export type USPWritableActions = BetslipSportsbookOddsMovementPrefChange | UserProfileMenuEyeIconClickAction;
type WritablePreferences = OddsMovementPreference | ShowBalancesPreference;
type PreferenceMapper<T> = (action: T) => Preference<WritablePreferences>;
type Writer = (preference: Preference<WritablePreferences>) => SagaIterator;
type PreferenceHandler = { [type: string]: PreferenceMapper<USPWritableActions> };

type Persistable<T> = {
  save: T;
};

function encodeBoolean(value: boolean): StringBoolean {
  return value ? "1" : "0";
}

const handleOddsMovementPreference: PreferenceMapper<BetslipSportsbookOddsMovementPrefChange> = (
  action,
): Preference<OddsMovementPreference> => {
  const { isOddsMovementAccepted } = action.payload;

  return {
    name: "general.betAcceptance",
    value: encodeBoolean(isOddsMovementAccepted),
    identifier: "oddsMovement",
    identifierValue: isOddsMovementAccepted,
  };
};

const handleShowBalancesPreference: PreferenceMapper<UserProfileMenuEyeIconClickAction> = (
  action,
): Preference<ShowBalancesPreference> => {
  const { showBalances } = action.payload;

  return {
    name: "maw.show.balances",
    value: encodeBoolean(showBalances),
    identifier: "showBalances",
    identifierValue: showBalances,
  };
};

const USP_PREFERENCE_HANDLER: PreferenceHandler = {
  [UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE]: (action) =>
    handleOddsMovementPreference(action as BetslipSportsbookOddsMovementPrefChange),
  [UI__USER_PROFILE_EYE_ICON_CLICK]: (action) =>
    handleShowBalancesPreference(action as UserProfileMenuEyeIconClickAction),
};

export function getUSPPreferenceMapper(type: string): PreferenceMapper<USPWritableActions> {
  return USP_PREFERENCE_HANDLER[type];
}

function* persist(preference: Preference<WritablePreferences>): SagaIterator {
  const { name, value, identifier, identifierValue } = preference;
  const preferencePayload = {
    [name]: value,
  };

  try {
    yield call(userSharedPreferencesService.setPreference, preferencePayload);

    yield put<SetUserPreferenceActionSuccess>({
      type: NETWORK__SET_USER_PREFERENCE_SUCCESS,
      payload: {
        identifier,
        identifierValue,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      yield put<SetUserPreferenceActionFailure>({
        type: NETWORK__SET_USER_PREFERENCE_FAILURE,
        error: error.message,
        payload: {
          identifier,
          identifierValue,
        },
      });
    } else {
      yield put<SetUserPreferenceActionFailure>({
        type: NETWORK__SET_USER_PREFERENCE_FAILURE,
        error: `Unknown error ${error}`,
        payload: {
          identifier,
          identifierValue,
        },
      });
    }
  }
}

export function getUSPStorage(): Persistable<Writer> {
  return {
    save: function* saveUSP(preference: Preference<WritablePreferences>): SagaIterator {
      yield call(persist, preference);
    },
  };
}
