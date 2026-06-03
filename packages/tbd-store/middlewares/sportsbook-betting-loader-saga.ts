import { SagaIterator } from "redux-saga";
import { call, put, select, take, race, takeLatest, all, delay } from "redux-saga/effects";
import { Validator } from "jsonschema";
import { getEventRegistry } from "eventemitter3-singleton";
import { codecs } from "@ppb/tbd-urn-codecs";
import groupSchema from "@ppb/betslip-core/src/schemas/group.json";
import { BettingState, generateLegId, generateRunnerId, LEG_TYPES } from "@ppb/betslip-core";
import { PopularState } from "../state/betting/popular-betting/PopularBetting.types";
import { TaggingMetadataState } from "../state/betslip/Betslip.types";
import { ProductsOption, UserPreferences } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  ADD_SELECTION_PAYLOAD,
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_ADD_SELECTIONS_SUCCESS,
  BETTING__SBK_ENSURE_SELECTION_DATA,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BettingSportsbookAddSelectionAction,
  BettingSportsbookAddSelectionActionSuccess,
  BettingSportsbookEnsureSelectionData,
  BettingSportsbookLoadStorageActionSuccess,
  LOAD_STORAGE_PAYLOAD,
  BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
  BettingSportsbookLoadStorageFailed,
  BETTING__SBK_LOAD_STORAGE_FAILED,
  BettingBetslipLoadMaxPayoutInfoAction,
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BetslipEvents,
  BETTING__SBK_REMOVE_LEG_ACTION,
  BettingSportsbookRemoveLegAction,
  BettingSportsbookEnsureSelectionDataSuccess,
  BettingSportsbookEnsureSelectionDataError,
} from "../actions/betting";
import { StorageModule } from "../modules/StorageModule.types";
import {
  BetslipStorage,
  StorageState,
  getBetslip,
  getSportsbookBettingData,
  getTaggingMetadata,
  removeSportsbookBettingData,
  resetTaggingMetadata,
} from "../helpers/storage";
import { getAllowLoadFromStorage } from "../state/boot/boot-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import { SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import {
  BetslipBetBuilderAddSelectionsAction,
  BetslipBetBuilderRemoveSelectionsAction,
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
} from "../actions/betslip";
import { getUniqueId } from "../helpers/betting";
import { createGetPopularCombination } from "../state/betslip/betslip-popular-bets-selectors";

type EnsureSelectionDataResult =
  | BettingSportsbookEnsureSelectionDataSuccess
  | BettingSportsbookEnsureSelectionDataError;

type HydratedSelection = {
  marketUrn: string;
  runnerUrn: string;
  uniqueId: string;
  legId: string;
};

const BETSLIP_STORAGE_TIMEOUT = 5000;

const groupValidator = new Validator();
const getUserPreferences = createUserPreferencesWithProductSwitcherSelector();
const getPopularCombination = createGetPopularCombination();

const { emit } = getEventRegistry<BetslipEvents>();

function* buildSelections(payload: ADD_SELECTION_PAYLOAD, isBoostedLeg: boolean) {
  const { selections, bettingOpportunityId } = payload;

  const appState: ApplicationState = yield select((state: ApplicationState) => state);

  // Build legs
  return selections.reduce((acc, selection) => {
    const runnerUrn = codecs.parse(selection.runnerUrn);
    const codecRunner = runnerUrn && codecs.sportsbookRunner.extract(runnerUrn);

    if (!codecRunner) {
      return acc;
    }

    const { marketId, selectionId } = codecRunner;
    const runnerTuple = [generateRunnerId({ marketId, selectionId })];
    const legId = generateLegId(
      LEG_TYPES.SIMPLE_SELECTION,
      runnerTuple,
      isBoostedLeg ? bettingOpportunityId : undefined,
    );

    acc.push({
      marketUrn: selection.marketUrn,
      runnerUrn: selection.runnerUrn,
      uniqueId: getUniqueId(appState),
      legId,
    });

    return acc;
  }, [] as HydratedSelection[]);
}

function* removeAllSelectionsIfAllLegsExist(selections: HydratedSelection[], cardUrn?: string) {
  let removed = false;

  const sportsbookBetting: BettingState.Group = yield select(
    (state: ApplicationState) => state.betting.sportsbookBetting,
  );

  const allSelectionsExist = selections.every((selection) => !!sportsbookBetting.legs[selection.legId]);

  if (!allSelectionsExist) {
    return false;
  }

  for (let i = 0; i < selections.length; i += 1) {
    const selection = selections[i];
    const { legId } = selection;

    yield put<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId },
    });

    yield put<BetslipBetBuilderRemoveSelectionsAction>({
      type: UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
      payload: {
        cardUrn: cardUrn || "",
        selection,
      },
    });

    removed = true;
  }

  return removed;
}

function* ensureSelectionData(payload: ADD_SELECTION_PAYLOAD | LOAD_STORAGE_PAYLOAD): SagaIterator {
  yield put<BettingSportsbookEnsureSelectionData>({
    type: BETTING__SBK_ENSURE_SELECTION_DATA,
    payload,
  });

  return yield race([take(BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS), take(BETTING__SBK_ENSURE_SELECTION_DATA_ERROR)]);
}

function* addSelectionsSaga(action: BettingSportsbookAddSelectionAction): SagaIterator {
  const { cardUrn, odds, cardMetadata } = action.payload;

  const popularCombination: PopularState | undefined = yield select((state: ApplicationState) =>
    getPopularCombination(
      state,
      action.payload.selections.map((selection) => ({ urn: selection.runnerUrn })),
    ),
  );
  const isBoostedLeg = popularCombination?.bettingOpportunityType === "BOOSTED_BETS";
  const bettingOpportunityId = popularCombination?.bettingOpportunityId;
  const bettingOpportunityType = popularCombination?.bettingOpportunityType;
  const selections: HydratedSelection[] = yield call(buildSelections, action.payload, isBoostedLeg);

  // If all selections already exist on betslip we remove them instead
  const removed = yield call(removeAllSelectionsIfAllLegsExist, selections, cardUrn);
  if (removed) {
    return;
  }

  // If selections failed to be ensured we return
  const [result]: EnsureSelectionDataResult[] = yield call(ensureSelectionData, action.payload);
  if (result?.type !== BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS) {
    return;
  }

  for (let i = 0; i < selections.length; i += 1) {
    yield put<BetslipBetBuilderAddSelectionsAction>({
      type: UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
      payload: {
        cardUrn: cardUrn || "",
        selection: selections[i],
        odds,
        cardMetadata,
      },
    });
  }

  yield put<BettingSportsbookAddSelectionActionSuccess>({
    type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
    payload: {
      selections,
      group: action.payload.group,
      options: isBoostedLeg ? { isBoostedLeg, groupId: bettingOpportunityId } : undefined,
      bettingOpportunityType,
      bettingOpportunityId,
    },
  });
}

function* loadBettingStateFromStorage(
  storage: StorageModule<StorageState>,
): SagaIterator<SportsbookBettingState | null> {
  const preferences: UserPreferences = yield select((state: ApplicationState) =>
    getUserPreferences(state.entities.preferences),
  );

  if (!preferences.products.includes(ProductsOption.sportsbook)) {
    return null;
  }

  const [sportsbookBettingState, taggingMetadata, betslipState]: [
    SportsbookBettingState | undefined,
    TaggingMetadataState | undefined,
    BetslipStorage | undefined,
  ] = yield all([
    call(getSportsbookBettingData, storage),
    call(getTaggingMetadata, storage),
    call(getBetslip, storage),
  ]);

  if (!sportsbookBettingState || !betslipState) {
    return null;
  }

  const { valid, errors } = groupValidator.validate(sportsbookBettingState, groupSchema);
  if (!valid) {
    yield put<BettingSportsbookLoadStorageFailed>({
      type: BETTING__SBK_LOAD_STORAGE_FAILED,
      payload: { errors },
    });
    return null;
  }

  yield call(resetTaggingMetadata, storage);

  const isVirtual = betslipState.group === "VIRTUAL";

  const runners = Object.values(sportsbookBettingState.runners);

  const selections: { marketUrn: string; runnerUrn: string; uniqueId?: string }[] = [];

  for (let i = 0; i < runners.length; i += 1) {
    const { marketId, selectionId } = runners[i];

    const newUniqueId: string = yield select((state: ApplicationState) => getUniqueId(state));

    const runnerUrn = isVirtual
      ? codecs.virtualRunner.encode(marketId, selectionId).uid
      : codecs.sportsbookRunner.encode(marketId, selectionId).uid;
    const uniqueId = taggingMetadata?.selections?.[runnerUrn]?.uniqueId || newUniqueId;

    selections.push({
      marketUrn: isVirtual ? codecs.virtualMarket.encode(marketId).uid : codecs.market.encode(marketId).uid,
      runnerUrn,
      uniqueId,
    });
  }

  const payload: LOAD_STORAGE_PAYLOAD = {
    selections,
    group: betslipState.group,
  };

  const [result] = yield call(ensureSelectionData, payload);

  // only populate storage if ensure selections effect is successful
  if (result?.type !== BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS) {
    return null;
  }

  const isLoggedIn = yield select((state: ApplicationState) => state.entities.userdetails?.loggedIn);

  yield put<BettingSportsbookLoadStorageActionSuccess>({
    type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
    payload: {
      betslip: isLoggedIn ? betslipState : { ...betslipState, lastSuccessfulStake: undefined }, // Sanitize possible sensitive user data
      storageBettingState: sportsbookBettingState,
    },
  });

  Object.values(sportsbookBettingState.runners).forEach(({ marketId, selectionId }) => {
    emit("@@BETSLIP/SBK_RUNNER_ADDED", {
      marketId,
      selectionId,
    });
  });

  return sportsbookBettingState;
}

function* clearSbkBettingStorage(storage: StorageModule<StorageState>): SagaIterator {
  yield call(removeSportsbookBettingData, storage);
}

export function* sportsbookBettingLoaderSaga(storage?: StorageModule<StorageState>): SagaIterator {
  if (!storage) {
    return;
  }

  yield takeLatest(BETTING__SBK_ADD_SELECTIONS, addSelectionsSaga);
  yield takeLatest(BETTING__SBK_LOAD_STORAGE_FAILED, clearSbkBettingStorage, storage);

  const betslipStorage = yield call(getBetslip, storage);
  if (betslipStorage?.showMaxPayoutNotification !== undefined) {
    yield put<BettingBetslipLoadMaxPayoutInfoAction>({
      type: BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
      payload: betslipStorage.showMaxPayoutNotification,
    });
  }

  const allowLoadFromStorage = yield select(getAllowLoadFromStorage);
  if (allowLoadFromStorage) {
    yield race([
      call(loadBettingStateFromStorage, storage),
      // adding a timeout for the whole storage effect
      // because if it does not finish due to an unexpected error we would end up without the betting module loaded
      // and therefore no Betslip would be available for the user
      delay(BETSLIP_STORAGE_TIMEOUT),
    ]);
  }

  // Indicate the module has loaded only after storage has attempted a restore, successful or not
  // Helps to avoid storage re-writes before it has been read
  yield put({ type: MODULES__SBK_BETTING_LOADED });
}
