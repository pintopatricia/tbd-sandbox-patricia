import { call, put, select, takeLeading } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  PlaceInstruction,
  UpdateInstruction,
  CancelInstruction,
  ReplaceInstruction,
  PlaceExecutionReport,
  UpdateExecutionReport,
  CancelExecutionReport,
  ReplaceExecutionReport,
  ImplyExecutionReport,
  MarketId,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";
import edit, { ETXMethod } from "@ppb/etx-edit-orchestrator/src/edit";
import { UnmatchedBet } from "@ppb/bet-engine";
import { ExchangeMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import { implyBet, placeBet, updateBet, cancelBet, replaceBet } from "../services/exchange-bet-service";
import {
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__PLACE_EXC_BET_IN_PROGRESS,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  PlaceExchangeBetFailureAction,
  PlaceExchangeBetInProgressAction,
  PlaceExchangeBetSuccessAction,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  UpdateExchangeBetInProgressAction,
  UpdateExchangeBetSuccessAction,
  UpdateExchangeBetFailureAction,
  NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_FAILURE,
  CancelExchangeBetInProgressAction,
  CancelExchangeBetSuccessAction,
  CancelExchangeBetFailureAction,
  BetslipExchangePlaceBetClickAction,
  BetslipExchangeConfirmBetsClickAction,
  UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeUnmatchedUpdateClickAction,
  NETWORK__IMPLY_EXC_BET_IN_PROGRESS,
  NETWORK__IMPLY_EXC_BET_SUCCESS,
  NETWORK__IMPLY_EXC_BET_FAILURE,
  ImplyExchangeBetInProgressAction,
  ImplyExchangeBetSuccessAction,
  ImplyExchangeBetFailureAction,
  PlaceExchangeBetAuthFailureAction,
  NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
  ImplyExchangeBetAuthFailureAction,
  NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
  CancelExchangeBetAuthFailureAction,
  NETWORK__CANCEL_EXC_BET_AUTH_FAILURE,
} from "../actions/betslip";
import {
  BettingExchangePlaceBetsAction,
  BETTING__EXC_PLACE_BETS,
  BETTING__EXC_UNMATCHED_UPDATE,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  MarketExchangeBetButtonClickAction,
  BettingExcPlaceDepositSuccessful,
  BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
  BettingExcEditDepositSuccessful,
  BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
  BettingDepositToPlaceCancel,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
  BettingExchangeUnmatchedUpdate,
} from "../actions/betting";
import { getPlaceBetData, PlaceBetData } from "./exchange-betting-saga-selectors";
import { getUnmatchedBets } from "../state/betting/exchange-betting/exchange-betting-selectors";
import { getExchangeRunnerTree } from "../state/entities/entities-selectors";
import {
  InstructionReport,
  mapPlaceExecutionToInstructionReport,
  mapCancelExecutionToInstructionReport,
  mapUpdateExecutionToInstructionReport,
  mapReplaceExecutionToInstructionReport,
} from "../services/exchange-bet-service-mapper";
import { getExchangeOrder } from "../state/betting/exchange-orders/exchange-order-selectors";
import { getEditingBetState, EditingBetState, getIsFreeBetsSelected } from "../state/betslip/betslip-card-selectors";
import { SubscribeExchangeMarketUpdatesAction, SUBSCRIBE_EXCHANGE_MARKET_UPDATES } from "../actions/exchange-markets";
import { calculateUsedBonus, calculateBonusLeft } from "../helpers/free-bets";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import {
  MyBetsCancelExchangeBetFailureAction,
  MyBetsCancelExchangeBetInProgressAction,
  MyBetsCancelExchangeBetSuccessAction,
  MyBetsOnCancelAllPressAction,
  MyBetsOnCancelUnmatchedBetPressAction,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
  UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS,
  MyBetsCancelAllExchangeBetsSuccessAction,
  MyBetsCancelAllExchangeBetFailureAction,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
} from "../actions/my-bets";
import { refreshWallet, RefreshWalletReturn } from "./wallet-saga";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { FETCH_CARDS, FetchCardsAction } from "../actions/catalogue";
import { PlacedBetValues, CancelledBetValues, ExchangeRunnerTree } from "../state/betslip/Betslip.types";
import { ExchangeOrder } from "../state/betting/exchange-orders/ExchangeOrder.types";
import {
  ExchangeBetTransactionError,
  ExchangeBetTransactionErrorCode,
} from "../state/betting/ExchangeBetTransactionError.types";
import URN from "../state/layout/URN";
import { ExchangeSide as ExchangeSideType } from "../state/betting/exchange-bets/ExchangeBet.types";

type Calculations = {
  profit: number;
  liability: number;
  size: number;
  totalBonusUsed?: number;
};

const FALLBACK_ERROR: ExchangeBetTransactionError = {
  errorCode: "UNABLE_PLACE_BET",
};

const CANCEL_ALL_RECEIPT_ERROR = {
  receiptTitle: {
    translate: {
      key: "I18N.GENERIC_RECEIPT.BET_CANCELED_ERROR",
    },
  },
  errorMessage: {
    translate: {
      key: "I18N.GENERIC_RECEIPT.ERROR_MESSAGE_TITLE",
    },
  },
  errorDetail: {
    translate: {
      key: "I18N.GENERIC_RECEIPT.BET_CANCELLED_ERROR_SUB_TITLE",
    },
  },
};

async function calculate(
  side: ExchangeSideType,
  price: number,
  size: number,
  bettingType: string,
  marketType: string,
  availableBonus?: number,
): Promise<Calculations> {
  const { calc } = await import(/* webpackChunkName: "BetEngine", webpackPreload: true */ "@ppb/bet-engine");

  const profit = calc.profit(side, size, price, bettingType, marketType);
  const liability = calc.liability(side, size, price, bettingType, marketType);
  const totalBonusUsed = calculateUsedBonus(liability, availableBonus);

  const liabilityWithDiscount = availableBonus
    ? calc.liability(side, size, price, bettingType, marketType, { bonus: availableBonus })
    : liability;

  return { profit, liability: liabilityWithDiscount, size, totalBonusUsed };
}

async function calculateReport(
  side: ExchangeSideType,
  report: PlacedBetValues | CancelledBetValues,
  market: ExchangeMarket,
  availableBonus?: number,
): Promise<PlacedBetValues | CancelledBetValues> {
  const { bettingType, type: marketType } = market;
  const { profit, liability, size, totalBonusUsed } = await calculate(
    side,
    report.price,
    report.size,
    bettingType,
    marketType,
    availableBonus,
  );

  return {
    ...report,
    profit,
    liability,
    size,
    totalBonusUsed,
  };
}

async function calculateInstructionReports(
  reports: InstructionReport,
  market: ExchangeMarket,
): Promise<InstructionReport> {
  const { side, matched, unmatched, cancelled, availableBonus } = reports;

  const matchedReport = matched ? await calculateReport(side, matched, market, availableBonus) : undefined;
  // FIXME: Remove calculateBonusLeft when ETX returns the totalBonusUsed for each bet
  const bonusLeft = matchedReport ? calculateBonusLeft(matchedReport.totalBonusUsed, availableBonus) : availableBonus;
  const unmatchedReport = unmatched ? await calculateReport(side, unmatched, market, bonusLeft) : undefined;
  const cancelledReport = cancelled
    ? await calculateReport(side, cancelled, market, cancelled.totalBonusUsed)
    : undefined;

  return {
    ...reports,
    matched: matchedReport,
    unmatched: unmatchedReport,
    cancelled: cancelledReport,
  };
}

function* subscribeMarketUpdate(marketId: MarketId): SagaIterator {
  yield put<SubscribeExchangeMarketUpdatesAction>({
    type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
    payload: { marketId },
  });
}

function* startPlaceBet(runner: URN): SagaIterator {
  const placeBetData: PlaceBetData = yield select(getPlaceBetData, runner);
  if (placeBetData == null) {
    return;
  }

  const runnerTree: ExchangeRunnerTree = yield select((state: ApplicationState) =>
    getExchangeRunnerTree(state.entities, runner),
  );

  if (!runnerTree) {
    return;
  }

  yield put<PlaceExchangeBetInProgressAction>({
    type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
  });

  const { market } = runnerTree;
  const { marketId, selectionId, handicap, side, orderType, limitOrder } = placeBetData;
  const instruction: PlaceInstruction = {
    side,
    selectionId,
    handicap,
    orderType,
    limitOrder,
  };

  const useAvailableBonus = yield select(getIsFreeBetsSelected);

  try {
    const executionReport: PlaceExecutionReport = yield call(
      placeBet,
      instruction as PlaceInstruction,
      marketId,
      {
        price: limitOrder?.price || 0,
        size: limitOrder?.size || 0,
      },
      {
        useAvailableBonus,
      },
    );
    const report: InstructionReport = mapPlaceExecutionToInstructionReport(executionReport);

    const calculatedReport: InstructionReport = yield call(calculateInstructionReports, report, market);

    yield call(subscribeMarketUpdate, marketId);

    yield put<PlaceExchangeBetSuccessAction>({
      type: NETWORK__PLACE_EXC_BET_SUCCESS,
      payload: {
        betId: executionReport.instructionReports?.[0].betId, // Only used on GTM
        report: {
          betIds: report.betIds,
          metadata: {
            runnerTree,
          },
          runner: placeBetData.urn,
          ...calculatedReport,
        },
      },
    });
  } catch (error) {
     
    console.warn(error);

    if (error instanceof Error && isHttpUnauthorizedError(error)) {
      yield put<PlaceExchangeBetAuthFailureAction>({ type: NETWORK__PLACE_EXC_BET_AUTH_FAILURE });
    } else {
      yield put<PlaceExchangeBetFailureAction>({
        type: NETWORK__PLACE_EXC_BET_FAILURE,
        payload: {
          error: error as ExchangeBetTransactionError,
          side,
        },
      });
    }
  }
}

function* implyBetEffect(action: MarketExchangeBetButtonClickAction): SagaIterator {
  try {
    if (!action.payload.marketId) {
      return;
    }

    yield put<ImplyExchangeBetInProgressAction>({
      type: NETWORK__IMPLY_EXC_BET_IN_PROGRESS,
    });

    const executionReport: ImplyExecutionReport = yield call(implyBet, action.payload.marketId);

    if (executionReport.marketId !== action.payload.marketId) {
      return;
    }

    yield put<ImplyExchangeBetSuccessAction>({
      type: NETWORK__IMPLY_EXC_BET_SUCCESS,
      payload: executionReport,
    });
  } catch (error) {
    if (error instanceof Error && isHttpUnauthorizedError(error)) {
      yield put<ImplyExchangeBetAuthFailureAction>({
        type: NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
      });
    } else {
      yield put<ImplyExchangeBetFailureAction>({
        type: NETWORK__IMPLY_EXC_BET_FAILURE,
        payload: {
          error: error as ExchangeBetTransactionError,
        },
      });
    }
  }
}

function* confirmBetEffect(action: BetslipExchangeConfirmBetsClickAction): SagaIterator {
  yield call(startPlaceBet, action.payload.runner);
}

function* placeBetEffect(action: BetslipExchangePlaceBetClickAction): SagaIterator {
  if (action.payload.confirmFirst) {
    return;
  }
  yield call(startPlaceBet, action.payload.runner);
}

function* updateBetEffect(action: BetslipExchangeUnmatchedUpdateClickAction): SagaIterator {
  const getExchangeMarket = createExchangeMarketSelector();

  try {
    const { market, betId, runner, betOriginURL } = action.payload;
    const order: ExchangeOrder = yield select(getExchangeOrder, market, betId);
    const editedState: EditingBetState = yield select(getEditingBetState, market);
    const { marketType, bettingType } = yield select((state: ApplicationState) =>
      getExchangeMarket(state.entities.exchangemarkets, market),
    );

    if (!order || !editedState) {
      return;
    }

    yield put<UpdateExchangeBetInProgressAction>({
      type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
    });

    const { marketId, selectionId, handicap, price, size, sizeRemaining, orderType, persistenceType, side } = order;
    const { price: newPrice, size: newSize, persistenceType: newPersistenceType } = editedState;

    if (!newPrice || !newSize || !newPersistenceType) {
      return;
    }

    const originalBet = {
      limitOrder: {
        persistenceType,
        size: sizeRemaining || size,
        price,
      },
      betId,
      selectionId,
      orderType,
      side,
      handicap,
    };

    const newBet = {
      ...originalBet,
      limitOrder: {
        persistenceType: newPersistenceType,
        size: newSize,
        price: newPrice,
      },
    };

    const { instruction, method } = edit(newBet, originalBet);
    const unmatchedBets: UnmatchedBet[] = yield select(getUnmatchedBets, market, [betId]);
    const useAvailableBonus = yield select(getIsFreeBetsSelected);

    let executionReport: PlaceExecutionReport | UpdateExecutionReport | CancelExecutionReport | ReplaceExecutionReport;
    let report: InstructionReport;

    switch (method) {
      case ETXMethod.Update:
        executionReport = yield call(updateBet, instruction as UpdateInstruction, marketId);

        // Updating, at the moment, only one bet at time
        report = mapUpdateExecutionToInstructionReport(executionReport as UpdateExecutionReport, unmatchedBets[0], {
          marketType,
          bettingType,
        });
        break;

      case ETXMethod.Place:
        executionReport = yield call(
          placeBet,
          instruction as PlaceInstruction,
          marketId,
          {
            price,
            size,
          },
          {
            useAvailableBonus,
          },
        );
        report = mapPlaceExecutionToInstructionReport(executionReport as PlaceExecutionReport);
        break;

      case ETXMethod.Cancel:
        executionReport = yield call(cancelBet, [instruction] as CancelInstruction[], marketId);
        report = mapCancelExecutionToInstructionReport(
          executionReport as CancelExecutionReport,
          unmatchedBets,
          persistenceType,
          {
            marketType,
            bettingType,
          },
        );
        break;

      case ETXMethod.Replace:
        executionReport = yield call(replaceBet, instruction as ReplaceInstruction, marketId, {
          price,
          size,
        });
        report = mapReplaceExecutionToInstructionReport(executionReport as ReplaceExecutionReport);
        break;

      default:
        yield put<UpdateExchangeBetFailureAction>({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: FALLBACK_ERROR,
          },
        });
        throw new Error(`Expected a possible bet edition, but no edit can be made. ${method}`);
    }

    const exchangeRunnerTree: ExchangeRunnerTree = yield select((state: ApplicationState) =>
      getExchangeRunnerTree(state.entities, runner),
    );

    if (!exchangeRunnerTree) {
      return;
    }

    const exchangeMarket: ExchangeMarket = exchangeRunnerTree.market;
    const calculatedReport: InstructionReport = yield call(calculateInstructionReports, report, exchangeMarket);

    yield call(subscribeMarketUpdate, marketId);

    yield put<UpdateExchangeBetSuccessAction>({
      type: NETWORK__UPDATE_EXC_BET_SUCCESS,
      payload: {
        report: {
          betIds: report.betIds,
          metadata: {
            runnerTree: exchangeRunnerTree,
          },
          runner,
          priceAtSelection: price,
          ...calculatedReport,
        },
        betOriginURL,
      },
    });
  } catch (error) {
    yield put<UpdateExchangeBetFailureAction>({
      type: NETWORK__UPDATE_EXC_BET_FAILURE,
      payload: {
        error: error as ExchangeBetTransactionError,
      },
    });
  }
}

function* cancelBetEffect(action: BetslipExchangeUnmatchedCancelClickAction): SagaIterator {
  try {
    const { betIds, runner: runnerUrn } = action.payload.instructions;
    const runnerTree: ExchangeRunnerTree = yield select((state: ApplicationState) =>
      getExchangeRunnerTree(state.entities, runnerUrn),
    );

    if (!runnerTree) {
      return;
    }

    const { market, runner } = runnerTree;
    const unmatchedBets: UnmatchedBet[] = yield select(getUnmatchedBets, market.urn, betIds);

    if (!unmatchedBets.length) {
      return;
    }

    yield put<CancelExchangeBetInProgressAction>({
      type: NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
    });

    const instructions: CancelInstruction[] = betIds.map((betId) => ({ betId }));
    const executionReport: CancelExecutionReport = yield call(cancelBet, instructions, market.marketId);
    const report: InstructionReport = mapCancelExecutionToInstructionReport(executionReport, unmatchedBets);

    const calculatedReport: InstructionReport = yield call(calculateInstructionReports, report, market);

    yield call(subscribeMarketUpdate, market.marketId);

    yield put<CancelExchangeBetSuccessAction>({
      type: NETWORK__CANCEL_EXC_BET_SUCCESS,
      payload: {
        report: {
          betIds: report.betIds,
          metadata: {
            runnerTree,
          },
          runner: runner.urn,
          ...calculatedReport,
        },
      },
    });
  } catch (error) {
    console.warn(error);

    if (error instanceof Error && isHttpUnauthorizedError(error)) {
      yield put<CancelExchangeBetAuthFailureAction>({ type: NETWORK__CANCEL_EXC_BET_AUTH_FAILURE });
    } else {
      yield put<CancelExchangeBetFailureAction>({
        type: NETWORK__CANCEL_EXC_BET_FAILURE,
        payload: {
          error: error as ExchangeBetTransactionError,
        },
      });
    }
  }
}

function* cancelUnmatchedBetEffect(action: MyBetsOnCancelUnmatchedBetPressAction): SagaIterator {
  const { marketId, betId, selectionName, side, marketBetCardGroupURN } = action.payload;

  try {
    yield put<MyBetsCancelExchangeBetInProgressAction>({
      type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
    });

    const instructions: CancelInstruction[] = [{ betId }];

    yield call(cancelBet, instructions, marketId);

    yield put<MyBetsCancelExchangeBetSuccessAction>({
      type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
      payload: {
        selectionName,
        side,
        betId,
      },
    });

    yield put<FetchCardsAction>({
      type: FETCH_CARDS,
      payload: {
        urns: [marketBetCardGroupURN],
        forceRefresh: true,
      },
    });
  } catch (error) {
    yield put<MyBetsCancelExchangeBetFailureAction>({
      type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
      payload: {
        side,
        betId,
        selectionName,
        errorCode: (error as ExchangeBetTransactionError).errorCode as ExchangeBetTransactionErrorCode,
        receipt: {
          entityURN: marketId,
          ...CANCEL_ALL_RECEIPT_ERROR,
        },
      },
    });
  }
}

function* cancelAllBetsEffect(action: MyBetsOnCancelAllPressAction): SagaIterator {
  const { marketId, marketName, numberOfBets, event, marketBetCardGroupURN } = action.payload;

  try {
    yield put<MyBetsCancelExchangeBetInProgressAction>({
      type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
    });

    yield call(cancelBet, [], marketId);

    yield put<MyBetsCancelAllExchangeBetsSuccessAction>({
      type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
      payload: {
        marketName,
        numberOfBets,
        event,
      },
    });

    yield put<FetchCardsAction>({
      type: FETCH_CARDS,
      payload: {
        urns: marketBetCardGroupURN,
        forceRefresh: true,
      },
    });
  } catch (error) {
    yield put<MyBetsCancelAllExchangeBetFailureAction>({
      type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
      payload: {
        errorCode: (error as ExchangeBetTransactionError).errorCode as ExchangeBetTransactionErrorCode,
        receipt: {
          entityURN: marketId,
          ...CANCEL_ALL_RECEIPT_ERROR,
        },
      },
    });
  }
}

function* refreshWalletAndPlace(action: BettingExcPlaceDepositSuccessful): SagaIterator {
  const { failure }: RefreshWalletReturn = yield call(refreshWallet);

  if (failure) {
    yield put<BettingDepositToPlaceCancel>({ type: BETTING__DEPOSIT_TO_PLACE_CANCEL });
    return;
  }

  const { runner } = action.payload;

  yield put<BettingExchangePlaceBetsAction>({
    type: BETTING__EXC_PLACE_BETS,
    payload: { runner, confirmFirst: false },
  });
}

function* refreshWalletAndUpdate(action: BettingExcEditDepositSuccessful): SagaIterator {
  const { failure }: RefreshWalletReturn = yield call(refreshWallet);

  if (failure) {
    yield put<BettingDepositToPlaceCancel>({ type: BETTING__DEPOSIT_TO_PLACE_CANCEL });
    return;
  }

  const { runner, betId, market } = action.payload;

  yield put<BettingExchangeUnmatchedUpdate>({
    type: BETTING__EXC_UNMATCHED_UPDATE,
    payload: { betId, runner, market, betOriginURL: null },
  });
}

export function* exchangeBettingSaga(): SagaIterator {
  yield takeLeading(UI__MARKET_EXC_BET_BUTTON_CLICK, implyBetEffect);
  yield takeLeading(BETTING__EXC_PLACE_BETS, placeBetEffect);
  yield takeLeading(UI__BETSLIP_EXC_CONFIRM_BET_CLICK, confirmBetEffect);
  yield takeLeading(BETTING__EXC_UNMATCHED_UPDATE, updateBetEffect);
  yield takeLeading(UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK, cancelBetEffect);
  yield takeLeading(UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS, cancelAllBetsEffect);
  yield takeLeading(UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS, cancelUnmatchedBetEffect);
  yield takeLeading(BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL, refreshWalletAndPlace);
  yield takeLeading(BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL, refreshWalletAndUpdate);
}
