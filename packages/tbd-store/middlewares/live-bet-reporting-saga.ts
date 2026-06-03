import { call, cancel, delay, fork, takeLatest, put } from "redux-saga/effects";
import { SagaIterator, Task } from "redux-saga";

import { LiveOrderSummaryReport } from "@flutter-global/uki-channels-http-clients/src/clients/LiveBetReporting/LiveBetReporting";
import { ExchangeReportRunnerMetadata } from "../state/betslip/Betslip.types";
import URN from "../state/layout/URN";
import { searchOrders } from "../services/live-bet-reporting-service";
import lbrMapper from "../services/live-bet-reporting-service-mapper";

import { getInterval } from "../config";
import {
  NETWORK__PLACE_EXC_BET_SUCCESS,
  PlaceExchangeBetSuccessAction,
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
  SearchExchangeOrdersInProgressAction,
  SearchExchangeOrdersSuccessAction,
  NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
  SearchExchangeOrdersFailureAction,
  NETWORK__SEARCH_EXC_ORDERS_FAILURE,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  UpdateExchangeBetSuccessAction,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
} from "../actions/betslip";
import { UI__MARKET_EXC_BET_BUTTON_CLICK } from "../actions/betting";

type Subscription = {
  betIds?: string[];
  task?: Task;
};

const SUBSCRIPTION: Subscription = {};
const SEARCH_ORDERS_TTL = 120000;
const MAX_RETRIES = 4;
let retries = 0;

function isSameSubscription(subscriptionIds: string[] | undefined, betIds: string[] | undefined): boolean {
  return (
    Array.isArray(subscriptionIds) &&
    Array.isArray(betIds) &&
    subscriptionIds.length === betIds.length &&
    subscriptionIds.every((id, index) => id === betIds[index])
  );
}

/**
 * Cleans existent subscriptions of the poller.
 * Also allows to stop LBR search orders poller for an interaction.
 * @returns {SagaIterator}
 */
function* cleanSubscription(): SagaIterator {
  if (SUBSCRIPTION.task) {
    const currentTask = SUBSCRIPTION.task;
    delete SUBSCRIPTION.betIds;
    delete SUBSCRIPTION.task;

    retries = 0;

    // Cancelling should be the last operation
    // Since it terminates the current fork, no more operations are ran after this
    yield cancel(currentTask);
  }
}

/**
 * Method that will call LBR search orders and dispatch the corresponding actions.
 * If bet is totally matched, it cleans current subscriptions
 *
 * @returns {(SagaIterator)}
 */
function* searchOrdersEffect(metadata: ExchangeReportRunnerMetadata, runner: URN): SagaIterator {
  if (!SUBSCRIPTION.betIds?.length) {
    return;
  }
  try {
    yield put<SearchExchangeOrdersInProgressAction>({
      type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
    });

    const response: LiveOrderSummaryReport = yield call(searchOrders, SUBSCRIPTION.betIds);
    if (response && response.liveOrders && response.liveOrders.length) {
      retries = 0;
      const report = lbrMapper.mapResponseToInstructionReport(response.liveOrders);

      yield put<SearchExchangeOrdersSuccessAction>({
        type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
        payload: {
          report: {
            metadata,
            runner,
            ...report,
          },
        },
      });

      if (!report.unmatched) {
        yield call(cleanSubscription);
      }
    }
  } catch {
    retries += 1;
    yield put<SearchExchangeOrdersFailureAction>({
      type: NETWORK__SEARCH_EXC_ORDERS_FAILURE,
    });
  }
}

/**
 * Method that will handle requesting and polling
 *
 * @returns {(SagaIterator)}
 */
function* poller(metadata: ExchangeReportRunnerMetadata, runner: URN): SagaIterator {
  while (SUBSCRIPTION.betIds && SUBSCRIPTION.betIds.length > 0 && retries < MAX_RETRIES) {
    yield call(searchOrdersEffect, metadata, runner);
    yield delay(getInterval("LBR"));
  }
}

/**
 * Method that will add the poller for searchOrders for a specific betId for dynamic matching, only if
 * bet has a part unmatched.
 * It will stop after 2 minutes, on betslip close or bet is totally matched.
 *
 * @param {PlaceExchangeBetSuccessAction | UpdateExchangeBetSuccessAction} action
 * @returns {(SagaIterator)}
 */
function* handleExchangeUnmatchedBetStatus(
  action: PlaceExchangeBetSuccessAction | UpdateExchangeBetSuccessAction,
): SagaIterator {
  const { report } = action.payload;
  const { unmatched, metadata, runner } = report;

  if (!unmatched) {
    return;
  }

  const { betIds } = report;

  if (!isSameSubscription(SUBSCRIPTION.betIds, betIds)) {
    yield call(cleanSubscription);

    SUBSCRIPTION.betIds = betIds;
    SUBSCRIPTION.task = yield fork(poller, metadata, runner);

    yield delay(SEARCH_ORDERS_TTL);
    yield call(cleanSubscription);
  }
}

/**
 * Saga that takes every `NETWORK__PLACE_EXC_BET_SUCCESS` searchOrdersEffect and trigger
 * the LBR search orders polling, if place exchange bet report has an unmatched part.
 *
 * Also takes all `UI__MARKET_EXC_BET_BUTTON_CLICK`, `UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK` and
 * `UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK` to remove all subscriptions to stop polling
 * */
export function* fetchExchangeBetsUpdatesSaga(): SagaIterator {
  yield takeLatest([NETWORK__PLACE_EXC_BET_SUCCESS, NETWORK__UPDATE_EXC_BET_SUCCESS], handleExchangeUnmatchedBetStatus);

  yield takeLatest(
    [
      UI__MARKET_EXC_BET_BUTTON_CLICK,
      UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
      UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
      UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
    ],
    cleanSubscription,
  );
}
