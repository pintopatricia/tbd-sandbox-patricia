import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { Validator } from "jsonschema";

import { ProductsOption, UserPreferences } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  BettingBetslipLoadMaxPayoutInfoAction,
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BETTING__OBB_LOAD_STORAGE_FAILURE,
  BETTING__OBB_LOADED,
  BettingObbLoadStorageFailureAction,
  BETTING__OBB_UPDATE_QUOTES,
  BETTING__OBB_STATE_UPDATE,
  BettingObbStateUpdateAction,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  BettingObbUpdateTaggingMetadata,
} from "../actions/betting";
import { StorageModule } from "../modules/StorageModule.types";
import {
  StorageState,
  getBetslip,
  getObbBettingData,
  getObbTaggingMetadata,
  removeObbBettingData,
  resetObbTaggingMetadata,
  resetTaggingMetadata,
} from "../helpers/storage";
import { getAllowLoadFromStorage } from "../state/boot/boot-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { ObbBettingState } from "../state/betting/obb-betting/ObbBetting.types";
import { INITIAL_STATE } from "../state/betting/obb-betting/obb-betting-reducer";
import { ObbTaggingMetadata } from "../state";
import obbStateSchema from "../state/betting/obb-betting/obb_schema.json";

const schemaValidator = new Validator();
const getUserPreferences = createUserPreferencesWithProductSwitcherSelector();

function* loadObbBettingStateFromStorage(storage: StorageModule<StorageState>): SagaIterator {
  const preferences: UserPreferences = yield select((state: ApplicationState) =>
    getUserPreferences(state.entities.preferences),
  );

  if (!preferences.products.includes(ProductsOption.sportsbook)) {
    return;
  }

  const [obbBettingState]: [ObbBettingState | undefined] = yield all([call(getObbBettingData, storage)]);

  const [obbTaggingMetadata]: [ObbTaggingMetadata | undefined] = yield all([call(getObbTaggingMetadata, storage)]);

  if (!obbBettingState) {
    return;
  }

  const { valid } = schemaValidator.validate(obbBettingState, obbStateSchema);

  if (!valid) {
    yield put<BettingObbLoadStorageFailureAction>({
      type: BETTING__OBB_LOAD_STORAGE_FAILURE,
    });
    return;
  }

  yield call(resetTaggingMetadata, storage);
  yield call(resetObbTaggingMetadata, storage);

  yield put<BettingObbStateUpdateAction>({
    type: BETTING__OBB_STATE_UPDATE,
    payload: { state: { ...obbBettingState, failures: INITIAL_STATE.failures } },
  });

  yield put({ type: BETTING__OBB_UPDATE_QUOTES, payload: { clearOnFailure: true } });

  if (obbTaggingMetadata) {
    yield put<BettingObbUpdateTaggingMetadata>({
      type: BETTING_UPDATE_OBB_TAGGING_METADATA,
      payload: { metadata: obbTaggingMetadata },
    });
  }
}

function* clearObbBettingStorage(storage: StorageModule<StorageState>): SagaIterator {
  yield call(removeObbBettingData, storage);
  yield call(resetObbTaggingMetadata, storage);
}

export function* obbBettingLoaderSaga(storage?: StorageModule<StorageState>): SagaIterator {
  if (storage) {
    yield takeLatest(BETTING__OBB_LOAD_STORAGE_FAILURE, clearObbBettingStorage, storage);

    const betslipStorage = yield call(getBetslip, storage);
    if (betslipStorage?.showMaxPayoutNotification !== undefined) {
      yield put<BettingBetslipLoadMaxPayoutInfoAction>({
        type: BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
        payload: betslipStorage.showMaxPayoutNotification,
      });
    }

    const allowLoadFromStorage = yield select(getAllowLoadFromStorage);

    if (allowLoadFromStorage) {
      yield call(loadObbBettingStateFromStorage, storage);
    }
  }

  yield put({ type: BETTING__OBB_LOADED });
}
