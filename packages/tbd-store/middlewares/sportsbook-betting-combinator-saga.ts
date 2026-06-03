import { buildBetLegs, BettingState, ImplyResponse, RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { SagaIterator } from "redux-saga";
import {
  all,
  call,
  delay,
  put,
  PutEffect,
  race,
  retry,
  select,
  take,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";
import { BetLeg } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookImplyBets/SportsbookImplyBets";
import { sportsbookRunnerCodec } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "../state";
import {
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  SportsbookCombinationsUpdateAuthFailureAction,
  SportsbookCombinationsUpdateFailureAction,
  SportsbookCombinationsUpdateInProgressAction,
  SportsbookCombinationsUpdateSuccessAction,
  SportsbookImplyError,
} from "../actions/betslip";
import { BETTING__SBK_CLEAR_ACTION, BETTING__SBK_COMBINATIONS_OUTDATED } from "../actions/betting";
import { getInterval } from "../config";
import { buildEntityRunnerMap, isBettingStale } from "../helpers/sportsbook-betting-hasher";
import { fetchCombinations, PricePolicy, SportsbookImplyBetsSuccess } from "../services/sportsbook-imply-bets-service";
import { getSportsbookBettingState } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getThrottles } from "../state/entities/throttles/throttles-selectors";
import {
  FetchSportsbookMarketUpdatesSuccessAction,
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "../actions/sportsbook-markets";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { Span, trace } from "@opentelemetry/api";
import { getBasicSpan, getBettingTelemetricFacility } from "../helpers/telemetry/betting-telemetry";
import { addErrorAttributesToSpan } from "../helpers/telemetry/betting-exceptions";

const START_EVENTS = [BETTING__SBK_COMBINATIONS_OUTDATED, NETWORK__FETCH_APP_CONTEXT_SUCCESS];
const STOP_EVENTS = [NETWORK__PLACE_SBK_BET_SUCCESS, BETTING__SBK_CLEAR_ACTION, UI__SWITCH_PRODUCT_PREFERENCE];
let hasAttemptedSubscription = false;

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

const combinatorTracer = trace.getTracer("[CombinatorSaga]");

type Combinator = (span: Span) => SagaIterator;
type GetCombinatorResult = { subscribedMarketIds: string[]; combinator: Combinator };

function* areCombinationsOutdated(): SagaIterator {
  const {
    betting: { sportsbookBetting },
    entities: { sportsbookmarkets, sportsbookrunners },
  }: ApplicationState = yield select((state: ApplicationState) => state);
  // there was an incident where a corrupted application state would cause an exception here, and combinations were not being flagged as outdated
  // when something goes wrong, lets assume combinations are outdated from now on so a new request to SIB is made and the flow continues
  try {
    const { runners, failures } = sportsbookBetting;
    const runnerUrns = buildRunnerUrnsFromRunnersMap(runners);
    const entityRunnerMap = buildEntityRunnerMap(runnerUrns, sportsbookmarkets, sportsbookrunners);
    return isBettingStale(runners, failures.imply.runners, entityRunnerMap);
  } catch (err) {
    console.error("[CombinatorSaga] - areCombinationsOutdated failed:", err);
    return true;
  }
}

function buildRunnerUrnsFromRunnersMap(runnersMap: BettingState.RunnersMap) {
  // runners map comes from betslip-core and we don't have an URN associated with them
  // therefore we are creating a runner URN here for fast access to our store sportsbookrunners slice
  // because otherwise we would need to loop all runners to find the correct one by marketId and selectionId occurring in a heavy performance cost
  return Object.values(runnersMap).map(
    (runner) => sportsbookRunnerCodec.encode(runner.marketId, runner.selectionId).uid,
  );
}

function* areAllRunnersClosed(): SagaIterator {
  const { runners, failures }: SportsbookBettingState = yield select(getSportsbookBettingState);
  const allRunners = Object.keys(runners);

  return (
    allRunners.length &&
    allRunners.every((runnerId) => {
      const runnerFailures = failures.imply.runners[runnerId] || [];

      return !!runnerFailures.find(
        ({ failureCode }) =>
          failureCode === RUNNER_FAILURE_CODES.MARKET_NOT_FOUND ||
          failureCode === RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
      );
    })
  );
}

function* hasAnyCombinableLegs(): SagaIterator {
  const state: SportsbookBettingState = yield select(getSportsbookBettingState);
  const legs = buildBetLegs(state);

  return legs.active?.length || legs.suggestedPrice?.length;
}

function* registerMarketSubscriptions(): SagaIterator {
  const marketIds: string[] = yield call(getCurrentBettingMarketIds);

  yield all(marketIds.map((id) => registerMarketUpdate(id)));

  hasAttemptedSubscription = false;

  return marketIds;
}

function* getCurrentBettingMarketIds(): SagaIterator<string[]> {
  const { runners }: SportsbookBettingState = yield select(getSportsbookBettingState);

  return Array.from(new Set(Object.values(runners).map(({ marketId }) => marketId)));
}

function* poll(combinator: Combinator, combinatorSpan: Span): SagaIterator {
  yield call(fetchNewCombinations, combinatorSpan);

  while (true) {
    const combineLegsPollSpan = getBasicSpan(
      combinatorTracer,
      "betting.implyBets.poll",
      combinatorSpan,
      "betting.implyBets",
    );

    if (yield call(areAllRunnersClosed)) {
      combineLegsPollSpan.setAttribute("betting.implyBets.allRunnersClosed", true);
      combineLegsPollSpan.end();

      return;
    }

    yield call(combinator, combineLegsPollSpan);

    combineLegsPollSpan.end();
  }
}

function* pollStarter(): SagaIterator {
  const combinatorSpan = getBasicSpan(combinatorTracer, "betting.implyBets");
  let marketIds: string[] = [];

  try {
    if (!(yield call(hasAnyCombinableLegs))) {
      combinatorSpan.setAttribute("betting.implyBets.uncombinable", true);

      return;
    }

    const isDirtyCheckSkipped: boolean = (yield select(getThrottles))?.["SKIP_DIRTY_CHECK"]?.isActive;
    const { subscribedMarketIds, combinator }: GetCombinatorResult = yield call(
      isDirtyCheckSkipped ? getCombinator : getDirtyCheckCombinator,
    );

    marketIds = subscribedMarketIds;

    yield race([call(poll, combinator, combinatorSpan), take(STOP_EVENTS)]);
  } catch (error) {
    if (error instanceof Error) {
      addErrorAttributesToSpan(error, combinatorSpan);
    }

    console.error(error);
  } finally {
    yield all(marketIds.map((id) => unregisterMarketUpdate(id)));

    combinatorSpan.end();
  }
}

function unregisterMarketUpdate(id: string): PutEffect {
  return put({ type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES, payload: { marketId: id, subscriberId: "sbcs" } });
}

function* getDirtyCheckCombinator(): SagaIterator<GetCombinatorResult> {
  const subscribedMarketIds = yield call(registerMarketSubscriptions);
  const combinator = function* (span: Span): SagaIterator {
    yield call(dirtyCheckLegs, subscribedMarketIds, span);
  };

  return {
    subscribedMarketIds,
    combinator,
  };
}

function* dirtyCheckLegs(registeredMarketIds: string[], span: Span): SagaIterator {
  const pricesAction = yield call(waitForMarketUpdate);

  // Note: This is only needed due to a "rogue" unsubscription caused by SportsbookMarket.web.tsx
  // which runs the useEffect on component mount and unsubscribes a Market ID it has not subscribed to.
  const hasSubbedSuccessfully = yield call(certifyMarketSubscription, registeredMarketIds, pricesAction);

  if (!hasSubbedSuccessfully && hasAttemptedSubscription) {
    // If not all markets are present and a subscription has been attempted
    // fallback to SIB interval polling to guarantee closure / updates
    yield call(combineLegs, span);

    span.setAttributes({
      "betting.implyBets.refreshed": true,
      "betting.implyBets.fallback": true,
    });
  } else if (yield call(areCombinationsOutdated)) {
    yield call(fetchNewCombinations, span);

    span.setAttributes({
      "betting.implyBets.refreshed": true,
      "betting.implyBets.fallback": false,
    });
  }
}

function* waitForMarketUpdate(): SagaIterator {
  const [priceUpdate]: [FetchSportsbookMarketUpdatesSuccessAction, boolean] = yield race([
    take(FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS),
    delay(getInterval("SMP")),
  ]);

  return priceUpdate;
}

function* certifyMarketSubscription(
  registeredMarketIds: string[],
  pricesAction?: FetchSportsbookMarketUpdatesSuccessAction,
): SagaIterator {
  const missingMarketIds = getMissingMarkets(registeredMarketIds, pricesAction);
  const hasAllMarkets = missingMarketIds.length === 0;

  if (hasAllMarkets || hasAttemptedSubscription) {
    return true;
  }

  yield all(missingMarketIds.map((id) => registerMarketUpdate(id)));

  const pricesAfterAttempt = yield call(waitForMarketUpdate);

  hasAttemptedSubscription = true;

  return getMissingMarkets(registeredMarketIds, pricesAfterAttempt).length === 0;
}

function getMissingMarkets(
  registeredMarketIds: string[],
  pricesAction?: FetchSportsbookMarketUpdatesSuccessAction,
): string[] {
  return pricesAction
    ? registeredMarketIds.filter(
        (marketId) =>
          !pricesAction.payload.markets.find((market) => "marketId" in market && market.marketId === marketId),
      )
    : registeredMarketIds;
}

function registerMarketUpdate(id: string): PutEffect {
  return put({
    type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
    payload: { marketId: id, subscriberId: "sbcs" },
  });
}

function getCombinator(): GetCombinatorResult {
  const combinator = function* (span: Span): SagaIterator {
    yield call(combineLegs, span);

    span.setAttributes({
      "betting.implyBets.force": true,
    });
  };

  return {
    subscribedMarketIds: [],
    combinator,
  };
}

function* combineLegs(span: Span): SagaIterator {
  yield delay(getInterval("SIB"));
  yield call(fetchNewCombinations, span);
}

function* fetchNewCombinations(span: Span): SagaIterator {
  let fetchSpan: Span | null = null;

  try {
    fetchSpan = getBasicSpan(combinatorTracer, "betting.implyBets.fetch", span, "betting.implyBets");

    const { recordImplyResult } = getBettingTelemetricFacility(combinatorTracer, fetchSpan);

    const state = yield select(getSportsbookBettingState);
    const legs = buildBetLegs(state);

    fetchSpan.setAttributes({
      "betLegs.active": JSON.stringify(legs.active),
      "betLegs.suggested": JSON.stringify(legs.suggestedPrice),
    });

    yield put<SportsbookCombinationsUpdateInProgressAction>({ type: NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS });

    // Without combinationsLimit, the combinations result will always have one element.
    const [[activeResult], [suggestedResult]]: SportsbookImplyBetsSuccess[][] = yield all([
      retry(RETRY_ATTEMPTS, RETRY_DELAY_MS, fetchCombinations, {
        betLegs: legs.active as BetLeg[],
      }),
      retry(RETRY_ATTEMPTS, RETRY_DELAY_MS, fetchCombinations, {
        betLegs: legs.suggestedPrice as BetLeg[],
        pricePolicy: PricePolicy.SUGGESTED,
      }),
    ]);

    // In case of any combinations array is empty or undefined, we want to remove it from the final combinations array.
    // It can happen when the betLegs are empty or there are no valid combinations.
    const combinations = [activeResult, suggestedResult].filter((result) =>
      Array.isArray(result) ? result.length > 0 : result !== undefined,
    );

    recordImplyResult(combinations);

    yield put<SportsbookCombinationsUpdateSuccessAction>({
      type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
      payload: {
        combinations: combinations as ImplyResponse.ImplyBetsResult[],
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (fetchSpan) {
        addErrorAttributesToSpan(error, fetchSpan);
      }

      if (isHttpUnauthorizedError(error)) {
        yield put<SportsbookCombinationsUpdateAuthFailureAction>({
          type: NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
        });
      }
    }

    yield put<SportsbookCombinationsUpdateFailureAction>({
      type: NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
      payload: { error: error as SportsbookImplyError },
    });
  } finally {
    fetchSpan?.end();
  }
}

function* reCombine() {
  const span = getBasicSpan(combinatorTracer, "betting.implyBets.recombine", undefined, "betting.implyBets");

  try {
    yield call(fetchNewCombinations, span);
  } finally {
    span.end();
  }
}

// - Leverages SMP to cross-check (according to the smp interval) the current sportsbookBettingState.
// - If throttled on will skip the dirty check and just poll SIB at the defined interval
// - When out of date related to SMP, re-combines and updates betting state
// - Poller stops when there are no combinable legs, or all runners are closed

export function* sportsbookBettingCombinatorSaga(): SagaIterator {
  yield takeLatest(START_EVENTS, pollStarter);
  yield takeLeading(NETWORK__PLACE_SBK_BET_FAILURE, reCombine);
}
