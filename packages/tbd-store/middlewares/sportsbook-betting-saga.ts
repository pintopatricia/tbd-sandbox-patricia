import { all, call, put, select, take, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { getEventRegistry } from "eventemitter3-singleton";
import { codecs } from "@ppb/tbd-urn-codecs";

import { BettingOpportunityType, ProductsOption, UserPreferences } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  CatalogueEvents,
  NETWORK__SBK_MARKETS_FAILURE,
  NETWORK__SBK_MARKETS_IN_PROGRESS,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsFailureAction,
  SportsbookMarketsInProgressAction,
  SportsbookMarketsSuccessAction,
} from "../actions/catalogue";
import {
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_ENSURE_SELECTION_DATA,
  BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BETTING__SBK_MARKETS_REQUEST,
  BettingSportsbookEnsureSelectionData,
  BettingSportsbookEnsureSelectionDataError,
  BettingSportsbookEnsureSelectionDataSuccess,
  BettingSportsbookMarketsRequest,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__OBB_CLEAR_ACTION,
} from "../actions/betting";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "../actions/sportsbook-markets";
import { getVirtualRunnerByURN } from "../state/entities/virtual-runner/virtual-runner-selectors";
import { ConfirmationAction, UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import { UI__BETSLIP_SET_COLLAPSE_ACTION } from "../actions/betslip";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import { BettingGroup, SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { getSportsbookRunnerTree } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ObbBettingState } from "../state/betting/obb-betting/ObbBetting.types";
import { getObbBettingState } from "../state/betting/obb-betting/obb-betting-selectors";

const getUserPreferences = createUserPreferencesWithProductSwitcherSelector();
const { emit } = getEventRegistry<CatalogueEvents>();

/**
 * Fetch sportsbook markets for specified urns
 */

function* getSportsbookMarkets(action: BettingSportsbookMarketsRequest): SagaIterator {
  const { urns, group } = action.payload;
  const isVirtual = group === "VIRTUAL";
  const userPreferences: UserPreferences = yield select((state: ApplicationState) =>
    getUserPreferences(state.entities.preferences),
  );
  const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
  const router = yield select((state: ApplicationState) => state.router);

  yield put<SportsbookMarketsInProgressAction>({ type: NETWORK__SBK_MARKETS_IN_PROGRESS });

  let marketsData;
  try {
    marketsData = isVirtual
      ? yield call(catalogueService.getVirtualMarkets, urns, throttleOverrides, router)
      : yield call(
          catalogueService.getMarkets,
          urns,
          { ...userPreferences, products: [ProductsOption.sportsbook] },
          throttleOverrides,
          router,
        );
  } catch (error) {
    if (error instanceof Error) {
      yield put<SportsbookMarketsFailureAction>({
        type: NETWORK__SBK_MARKETS_FAILURE,
        payload: { error: error.message },
      });
    } else {
      yield put<SportsbookMarketsFailureAction>({
        type: NETWORK__SBK_MARKETS_FAILURE,
        payload: { error: `Unknown error ${error}` },
      });
    }
    return;
  }

  const success: SportsbookMarketsSuccessAction = {
    type: NETWORK__SBK_MARKETS_SUCCESS,
    payload: { ...marketsData },
  };

  yield put<SportsbookMarketsSuccessAction>(success);

  emit("@@NETWORK/SBK_MARKETS_SUCCESS", success.payload);
}

type Selection = {
  runnerUrn: string;
  marketUrn: string;
};

type SportsbookBettingContext = {
  currentGroup: BettingGroup;
  sportsbookBetting: SportsbookBettingState;
  runnersMissing: Selection[];
};

const getSportsbookBettingContext = (state: ApplicationState, selections: Selection[]): SportsbookBettingContext => ({
  currentGroup: state.betslip?.group || "REAL",
  sportsbookBetting: state.betting.sportsbookBetting,
  runnersMissing: selections
    .map((selection) => ({
      runnerUrn: selection.runnerUrn,
      marketUrn: selection.marketUrn,
      isStored:
        !!getVirtualRunnerByURN(state.entities.virtualrunners, selection.runnerUrn) ||
        !!getSportsbookRunnerTree(state, selection.runnerUrn),
    }))
    .filter((selection) => !selection.isStored),
});

const URNToMarketId = (marketUrn: string): string | undefined => codecs.sportsbookMarket.decode(marketUrn);

/**
 * Ensure all data required for adding selections to betslip is
 * available on the store
 *  boostedIdentification?: BoostedIdentification;
 */
function* ensureSelectionSaga(action: BettingSportsbookEnsureSelectionData): SagaIterator {
  const { selections, group } = action.payload;
  const {
    currentGroup,
    sportsbookBetting,
    runnersMissing,
  }: {
    currentGroup: BettingGroup;
    sportsbookBetting: SportsbookBettingState;
    runnersMissing: Selection[];
  } = yield select((state) => getSportsbookBettingContext(state, selections));

  let ensureSelectionsFromStore = true;
  let bettingOpportunityId: string | undefined;
  let bettingOpportunityType: BettingOpportunityType | undefined;

  if ("ensureSelectionsFromStore" in action.payload) {
    ensureSelectionsFromStore = action.payload.ensureSelectionsFromStore ?? true;
    bettingOpportunityId = action.payload.bettingOpportunityId;
    bettingOpportunityType = action.payload.bettingOpportunityType;
  }

  const obbBetting: ObbBettingState = yield select(getObbBettingState);

  const isSwitchingContext = group !== currentGroup && !!Object.values(sportsbookBetting.legs).length;
  const isSwitchingBetslipType = Object.values(obbBetting?.legs).length;

  if (isSwitchingBetslipType) {
    yield put<ConfirmationAction>({
      type: UI__ACTION_CONFIRMATION,
      payload: {
        id: "BETTING_BETSLIP_TYPE_SWITCH",
        refuseActions: [],
        acceptActions: [
          {
            type: BETTING__OBB_CLEAR_ACTION,
          },
          {
            type: BETTING__SBK_ADD_SELECTIONS,
            payload: { selections, group, bettingOpportunityId, bettingOpportunityType },
          },
          {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: false },
          },
        ],
      },
    });

    return;
  }

  // If we are switching context we either want to keep the actual bet or the upcoming one
  if (isSwitchingContext && selections) {
    yield put<ConfirmationAction>({
      type: UI__ACTION_CONFIRMATION,
      payload: {
        id: "BETTING_GROUP_SWITCH",
        refuseActions: [],
        acceptActions: [
          {
            type: BETTING__SBK_CLEAR_ACTION,
          },
          {
            type: BETTING__SBK_ADD_SELECTIONS,
            payload: { selections, group, bettingOpportunityId, bettingOpportunityType },
          },
          {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: false },
          },
        ],
      },
    });

    return;
  }

  if (runnersMissing.length) {
    const liveDataRunners = runnersMissing.map((r) => URNToMarketId(r.marketUrn)).filter((id): id is string => !!id);

    yield all([
      put<BettingSportsbookMarketsRequest>({
        type: BETTING__SBK_MARKETS_REQUEST,
        payload: {
          urns: runnersMissing.map((r) => r.marketUrn),
          group,
        },
      }),
      ...liveDataRunners.map((marketId) =>
        put<SubscribeSportsbookMarketUpdatesAction>({
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: { marketId, subscriberId: "sportsbook-betting-saga" },
        }),
      ),
    ]);
    yield all([
      take([NETWORK__SBK_MARKETS_SUCCESS, NETWORK__SBK_MARKETS_FAILURE]),
      take(FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS),
    ]);

    const {
      runnersMissing: runnersStillMissing,
    }: {
      runnersMissing: Selection[];
    } = yield select((state) => getSportsbookBettingContext(state, selections));

    yield all(
      liveDataRunners.map((marketId) =>
        put<UnsubscribeSportsbookMarketUpdatesAction>({
          type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: { marketId, subscriberId: "sportsbook-betting-saga" },
        }),
      ),
    );

    // if selections should be on store but runners still missing
    if (runnersStillMissing.length && ensureSelectionsFromStore) {
      yield put<BettingSportsbookEnsureSelectionDataError>({ type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR });
      return;
    }
  }

  yield put<BettingSportsbookEnsureSelectionDataSuccess>({
    type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
    payload: action.payload,
  });
}

/**
 * Fetch sportsbook markets data when triggered
 */
export function* sportsbookBettingSaga(): SagaIterator {
  yield takeEvery(BETTING__SBK_ENSURE_SELECTION_DATA, ensureSelectionSaga);
  yield takeEvery(BETTING__SBK_MARKETS_REQUEST, getSportsbookMarkets);
}
