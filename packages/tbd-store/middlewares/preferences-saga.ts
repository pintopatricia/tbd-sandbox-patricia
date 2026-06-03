import { call, put, select, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { codecs, confirmCashoutPreferenceCodec } from "@ppb/tbd-urn-codecs";
import URN from "../state/layout/URN";
import { DefaultProductOption } from "../state/entities/user-preferences/UserPreferences.types";
import { UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE } from "../actions/betslip";
import { getUSPPreferenceMapper, getUSPStorage, WritableActions } from "./preference-storage-handlers";
import { UI__USER_PROFILE_EYE_ICON_CLICK } from "../actions/user-profile";
import catalogueService from "../services/catalogue/catalogue-service";
import { getEventRegistry } from "eventemitter3-singleton";
import {
  UPDATE_PREFERENCE_FAILURE,
  UPDATE_PREFERENCE_IN_PROGRESS,
  UPDATE_PREFERENCE_SUCCESS,
  UpdatePreferenceFailureAction,
  UpdatePreferenceInProgressAction,
  UpdatePreferenceSuccessAction,
} from "../actions/catalogue";
import {
  PreferenceSingleChoiceClickAction,
  UpdateLastViewedProductPreferenceAction,
  UpdateLastViewedProductPreferenceSuccessAction,
  UI__PREFERENCE_SINGLE_CHOICE_CLICK,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
  PreferenceUpdateEvents,
} from "../actions/preferences";
import { createSettingsPreferenceSelector } from "../state/entities/settings-preferences/settings-preferences-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import { ApplicationState } from "../state/ApplicationState.types";
import { ThrottleOverrides } from "../state";
import { SetPreferenceResult } from "../services/catalogue/catalogue-types";

export type ActionPayload = {
  urn: string;
  value: string;
};

export enum SpecialSingleChoicePreferences {
  userProducts = "products",
  exchangeDefaultProduct = "exchangeDefaultProduct",
  defaultProduct = "defaultProduct",
  confirmCashout = "confirmCashout",
}

const PARTIAL_ERROR_RECEIPT = {
  errorMessage: {
    translate: {
      key: "I18N.BETTING_PREFS.ERROR_MESSAGE_TITLE",
    },
  },
  errorDetail: {
    translate: {
      key: "I18N.BETTING_PREFS.ERROR_MESSAGE_DESC",
    },
  },
};
const { emit } = getEventRegistry<PreferenceUpdateEvents>();

const PREFERENCE_MUTATIONS_ON_GOING_REQUESTS = new Map<URN, string>();

const getSettingsPreference = createSettingsPreferenceSelector();
const getUserPreferences = createUserPreferencesWithProductSwitcherSelector();

// Iterator responsible of saving the preference to the respective implementation
// This can be adapted to write in other several formats
function* storePreference(action: WritableActions): SagaIterator {
  const uspMapper = getUSPPreferenceMapper(action.type);

  if (uspMapper) {
    const uspStorage = getUSPStorage();

    yield call(uspStorage.save, uspMapper(action));
  }
}

function* setUserProductsPreference({ urn, value }: ActionPayload, throttleOverrides: ThrottleOverrides): SagaIterator {
  const userProductsSingleChoicePreference = yield select((state: ApplicationState) =>
    getSettingsPreference(state.entities.settingspreferences, urn),
  );

  const { products: userProductsPreferences } = yield select((state: ApplicationState) =>
    getUserPreferences(state.entities.preferences),
  );

  return yield call(
    catalogueService.setUserProductsPreference,
    codecs.preference.userProducts.encode().uid,
    value,
    userProductsSingleChoicePreference,
    userProductsPreferences,
    throttleOverrides,
  );
}

function* setExchangeDefaultProductPreference(
  { urn, value }: ActionPayload,
  throttleOverrides: ThrottleOverrides,
): SagaIterator {
  const exchangeDefaultProductSingleChoicePreference = yield select((state: ApplicationState) =>
    getSettingsPreference(state.entities.settingspreferences, urn),
  );

  return yield call(
    catalogueService.setExchangeDefaultProductPreference,
    codecs.preference.exchangeDefaultProduct.encode().uid,
    value,
    exchangeDefaultProductSingleChoicePreference,
    throttleOverrides,
  );
}

function* setDefaultProductPreference(
  { urn, value }: ActionPayload,
  throttleOverrides: ThrottleOverrides,
): SagaIterator {
  const defaultProductSingleChoicePreference = yield select((state: ApplicationState) =>
    getSettingsPreference(state.entities.settingspreferences, urn),
  );

  return yield call(
    catalogueService.setDefaultProductPreference,
    codecs.preference.defaultProduct.encode().uid,
    value as DefaultProductOption,
    defaultProductSingleChoicePreference,
    throttleOverrides,
  );
}

function* setConfirmCashoutPreference(
  { urn, value }: ActionPayload,
  throttleOverrides: ThrottleOverrides,
): SagaIterator {
  const confirmCashoutSingleChoicePreference = yield select((state: ApplicationState) =>
    getSettingsPreference(state.entities.settingspreferences, urn),
  );

  return yield call(
    catalogueService.setConfirmCashoutPreference,
    confirmCashoutPreferenceCodec.encode().uid,
    value === "ON",
    confirmCashoutSingleChoicePreference,
    throttleOverrides,
  );
}

function* handleLastViewedProductPreferenceUpdate(action: UpdateLastViewedProductPreferenceAction): SagaIterator {
  const { urn, value } = action.payload;

  if (PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.get(urn) && PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.get(urn) === value) {
    return;
  }

  const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));

  PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.set(urn, value);
  try {
    const updatedPreference = yield call(
      catalogueService.setLastViewedProductPreference,
      urn,
      value,
      throttleOverrides,
    );

    if (updatedPreference) {
      yield put<UpdateLastViewedProductPreferenceSuccessAction>({
        type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
        payload: {
          lastViewedProductPreference: updatedPreference,
        },
      });
    }
  } catch {
    yield put<UpdatePreferenceFailureAction>({
      type: UPDATE_PREFERENCE_FAILURE,
      payload: {
        ...PARTIAL_ERROR_RECEIPT,
        entityURN: urn,
      },
    });
  } finally {
    PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.delete(urn);
  }
}

function* handleSingleChoicePreferenceUpdate(action: PreferenceSingleChoiceClickAction): SagaIterator {
  const { urn, value } = action.payload;

  if (PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.get(urn) && PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.get(urn) === value) {
    return;
  }

  const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));

  yield put<UpdatePreferenceInProgressAction>({
    type: UPDATE_PREFERENCE_IN_PROGRESS,
    payload: urn,
  });
  PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.set(urn, value);
  let updatedPreference: SetPreferenceResult;
  try {
    if (urn.includes(SpecialSingleChoicePreferences.exchangeDefaultProduct)) {
      updatedPreference = yield call(setExchangeDefaultProductPreference, action.payload, throttleOverrides);
    } else if (urn.includes(SpecialSingleChoicePreferences.confirmCashout)) {
      updatedPreference = yield call(setConfirmCashoutPreference, action.payload, throttleOverrides);
    } else if (urn.includes(SpecialSingleChoicePreferences.defaultProduct)) {
      updatedPreference = yield call(setDefaultProductPreference, action.payload, throttleOverrides);
    } else if (urn.includes(SpecialSingleChoicePreferences.userProducts)) {
      updatedPreference = yield call(setUserProductsPreference, action.payload, throttleOverrides);
    } else {
      updatedPreference = yield call(catalogueService.setSingleChoicePreference, urn, value, throttleOverrides);
    }

    if (updatedPreference) {
      yield put<UpdatePreferenceSuccessAction>({
        type: UPDATE_PREFERENCE_SUCCESS,
        payload: {
          settingsPreferences: updatedPreference.settingsPreferences,
          userPreferences: updatedPreference.userPreferences,
        },
      });
      emit("@@SYNC/UPDATE_SINGLE_CHOICE_PREFERENCE", {});
    }
  } catch {
    yield put<UpdatePreferenceFailureAction>({
      type: UPDATE_PREFERENCE_FAILURE,
      payload: {
        entityURN: urn,
        ...PARTIAL_ERROR_RECEIPT,
      },
    });
  } finally {
    PREFERENCE_MUTATIONS_ON_GOING_REQUESTS.delete(urn);
  }
}

export function* userPreferenceSaga(): SagaIterator {
  yield takeLatest([UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE, UI__USER_PROFILE_EYE_ICON_CLICK], storePreference);
  yield takeEvery(UI__PREFERENCE_SINGLE_CHOICE_CLICK, handleSingleChoicePreferenceUpdate);
  yield takeLeading(UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE, handleLastViewedProductPreferenceUpdate);
}
