import { takeLeading, put, call, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { getEventRegistry } from "eventemitter3-singleton";
import { buildBetPlacement, buildPlacedBetResults, buildWalletAllocationType } from "@ppb/betslip-core";
import { ApplicationState } from "../state/ApplicationState.types";

import {
  PlaceSportsbookBetSuccessAction,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  PlaceSportsbookBetFailureAction,
  NETWORK__PLACE_SBK_BET_FAILURE,
  PlaceSportsbookBetInProgressAction,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  PlaceSportsbookBetAuthFailureAction,
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  BetslipCollapseToggleAction,
} from "../actions/betslip";
import {
  BettingSportsbookPlaceBetsAction,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_DEPOSIT_SUCCESSFUL,
  BettingDepositToPlaceCancel,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
} from "../actions/betting";
import {
  placeBets,
  SportsbookTransactionalSuccess,
  SportsbookTransactionalError,
} from "../services/sportsbook-bet-service";
import {
  getBettingResolvers,
  getSportsbookBettingState,
  createQuickBetslipBetPickerSelector,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { refreshWallet, RefreshWalletReturn } from "./wallet-saga";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { createCustomerRefBuilder } from "../helpers/betting";
import { SpanKind, trace } from "@opentelemetry/api";
import { getBettingTelemetricFacility } from "../helpers/telemetry/betting-telemetry";

const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
const { emit } = getEventRegistry();
const buildCustomerReference = createCustomerRefBuilder();

function* placeBet(): SagaIterator {
  const transactionalTracer = trace.getTracer("[TransactionalSaga]");
  const placeBetSpan = transactionalTracer.startSpan("betting.placeBet", {
    attributes: {
      "workflow.name": "betting.placeBet",
    },
    kind: SpanKind.CLIENT,
  });

  try {
    const betRunnersMetadata = yield select((state: ApplicationState) =>
      getBettingResolvers(state.betslip?.group).getMetadata(state),
    );
    const oddsMovement = yield select(
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences).oddsMovement,
    );

    const sportsbookBetting = yield select(getSportsbookBettingState);
    const betPlacement = buildBetPlacement(sportsbookBetting, false);
    const customerRef = buildCustomerReference();

    placeBetSpan.setAttributes({
      "betting.placeBet.customerRef": customerRef,
      "betting.placeBet.acceptLowerOdds": oddsMovement,
    });

    const deepCloneBettingState = JSON.parse(JSON.stringify(sportsbookBetting)); // Guarantee no state shifts happen while placing to construct results

    yield put<PlaceSportsbookBetInProgressAction>({
      type: NETWORK__PLACE_SBK_BET_IN_PROGRESS,
    });

    const { result = [] }: SportsbookTransactionalSuccess = yield call(placeBets, betPlacement, {
      acceptLowerOdds: oddsMovement,
      useAvailableBonus: deepCloneBettingState.isBonusSelected,
      dryRun: false,
      customerRef,
      walletAllocationType: buildWalletAllocationType(deepCloneBettingState.wallets),
    });

    emit("@@THE_BRIDGE/SBK_BET_PLACED", null);

    yield put<PlaceSportsbookBetSuccessAction>({
      type: NETWORK__PLACE_SBK_BET_SUCCESS,
      payload: {
        report: {
          metadata: betRunnersMetadata,
          isFreeBetsSelected: deepCloneBettingState.isBonusSelected,
          // TODO: Fix betslip core types
          // @ts-expect-error - "PlaceBetResultRunner.runner" type is now "Runner | undefined" due to a new outcome field added
          result: buildPlacedBetResults(deepCloneBettingState, result, betPlacement),
        },
      },
    });

    placeBetSpan.setAttributes({
      "betting.placeBet.success": true,
      "betting.placeBet.receiptId": result.map((res) => res.betReceiptId).join(", "),
    });
  } catch (error) {
    const { recordAuthException, recordOperationalException, recordTechnicalException } = getBettingTelemetricFacility(
      transactionalTracer,
      placeBetSpan,
    );

    if (error instanceof SportsbookTransactionalError) {
      yield put<PlaceSportsbookBetFailureAction>({
        type: NETWORK__PLACE_SBK_BET_FAILURE,
        payload: {
          isTechnical: false,
          error,
        },
      });

      // When the failed bet is eligible for the quick betslip view, keep the betslip
      // collapsed so the odds movement alert is shown there instead of in the full betslip.
      const quickBetslipBet = yield select(createQuickBetslipBetPickerSelector());
      if (quickBetslipBet && quickBetslipBet.status === "valid") {
        yield put<BetslipCollapseToggleAction>({
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: { collapse: true },
        });
      }

      recordOperationalException(error);

      return;
    }

    if (error instanceof Error && isHttpUnauthorizedError(error)) {
      yield put<PlaceSportsbookBetAuthFailureAction>({ type: NETWORK__PLACE_SBK_BET_AUTH_FAILURE });

      recordAuthException(error);

      return;
    }

    yield put<PlaceSportsbookBetFailureAction>({
      type: NETWORK__PLACE_SBK_BET_FAILURE,
      payload: {
        isTechnical: true,
        error: error as SportsbookTransactionalError,
      },
    });

    recordTechnicalException(error as Error);
  } finally {
    placeBetSpan.end();
  }
}

function* refreshWalletAndPlaceBet(): SagaIterator {
  const { failure }: RefreshWalletReturn = yield call(refreshWallet);

  if (failure) {
    yield put<BettingDepositToPlaceCancel>({ type: BETTING__DEPOSIT_TO_PLACE_CANCEL });
    return;
  }

  yield put<BettingSportsbookPlaceBetsAction>({ type: BETTING__SBK_PLACE_BETS });
}

export function* placeSportsbookBetsSaga(): SagaIterator {
  yield takeLeading(BETTING__SBK_DEPOSIT_SUCCESSFUL, refreshWalletAndPlaceBet);
  yield takeLeading(BETTING__SBK_PLACE_BETS, placeBet);
}
