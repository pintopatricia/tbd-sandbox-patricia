import { SagaIterator } from "redux-saga";
import { all, ForkEffect, put, select, takeLatest } from "redux-saga/effects";

import { BettingState, generateLegId, LEG_TYPES } from "@ppb/betslip-core";

import {
  ApplicationState,
  BetslipCastContext,
  BetslipSportsbookConfirmationBet,
  createGetThrottleSelector,
  IgnoredBets,
} from "../state";
import {
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_EDIT_BETS,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
  BettingSportsbookCombinationsOutdatedAction,
  BettingSportsbookConfirmationOddsMovementAction,
  BettingSportsbookCreateSportsbookConfirmationAction,
  BettingSportsbookRemoveSportsbookConfirmationAction,
  BettingSportsbookUpdateSportsbookConfirmationFailuresAction,
} from "../actions/betting";
import {
  getSportsbookBettingCombinations,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingState,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../actions/sportsbook-markets";
import {
  getBetslipStep,
  getSportsbookConfirmationAvailability,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationIgnoredBets,
  getSportsbookConfirmationLegs,
} from "../state/betslip/betslip-card-selectors";
import {
  groupCombinationsByMarketId,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  hasAnyInvalidCombinationFailure,
} from "../helpers/sportsbook-betting";

const getThrottle = createGetThrottleSelector();

function* createSnapshot(): SagaIterator {
  const isBetConfirmationStepActive = yield select(
    (state: ApplicationState) => !!getThrottle(state.entities.throttles, "BET_CONFIRMATION_STEP")?.isActive,
  );

  if (!isBetConfirmationStepActive) {
    return;
  }

  const { combinations, legs, runners, ...rest }: SportsbookBettingState = yield select((state: ApplicationState) =>
    getSportsbookBettingState(state),
  );

  const runnerFailures: BettingState.ImplyRunnerFailuresMap = yield select((state: ApplicationState) =>
    getSportsbookBettingImplyRunnerFailures(state),
  );

  const combinationsWithStake = Object.values(combinations).reduce(
    (acc: BettingState.CombinationsMap, combination: BettingState.Combination) => {
      const hasFailures = combination.legs.some((leg) => {
        const bettingLeg = legs[leg];
        return bettingLeg.runners.some(
          (runner) =>
            runnerFailures[runner] &&
            (hasAnyMarketClosedFailure(runnerFailures[runner]) || hasAnyMarketSuspendedFailure(runnerFailures[runner])),
        );
      });

      if (combination.totalCombinedStake && !hasFailures) {
        acc[combination.id] = combination;
      }
      return acc;
    },
    {},
  );

  const ignoredBets = Object.keys(runnerFailures)
    .filter((runner) => !hasAnyInvalidCombinationFailure(runnerFailures[runner]))
    .map((id) => {
      const currentLeg = Object.values(legs).find((leg) => leg.runners.includes(id));

      let hasStake = false;
      let shouldShowNotification = false;

      if (currentLeg) {
        const legId = generateLegId(LEG_TYPES[currentLeg.legType], [id]);

        hasStake = !!combinations[legId]?.totalCombinedStake;
        shouldShowNotification =
          hasAnyMarketSuspendedFailure(runnerFailures[id]) || hasAnyMarketClosedFailure(runnerFailures[id]);
      }

      return { id, hasStake, shouldShowNotification };
    });

  const castGroups = groupCombinationsByMarketId({ combinations: combinationsWithStake, legs, runners, ...rest });

  const castContext: BetslipCastContext = Object.values(castGroups).reduce((finalCastContext, castGroup) => {
    const { combinations: castGroupCombinations } = castGroup;
    const chosenCastCombination = castGroupCombinations[0].id;

    return {
      ...finalCastContext,
      [castGroup.id]: chosenCastCombination,
    };
  }, {});

  const betslipSportsbookConfirmationPayload: BetslipSportsbookConfirmationBet = {
    combinations: combinationsWithStake,
    legs,
    ignoredBets,
    failures: {},
    availabilityChanged: false,
    runners,
    castContext,
  };

  yield put<BettingSportsbookCreateSportsbookConfirmationAction>({
    type: BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
    payload: {
      ...betslipSportsbookConfirmationPayload,
    },
  });
}

function* remakeBettings(): SagaIterator {
  yield put<BettingSportsbookCombinationsOutdatedAction>({
    type: BETTING__SBK_COMBINATIONS_OUTDATED,
  });
  yield put<BettingSportsbookRemoveSportsbookConfirmationAction>({
    type: BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  });
}

function* updateCombinationsMovement(): SagaIterator {
  const step = yield select((state: ApplicationState) => getBetslipStep(state));

  if (step !== "CONFIRM_POTENTIAL") {
    return;
  }

  const [combinations, bettingCombinations]: [
    BetslipSportsbookConfirmationBet["combinations"],
    BettingState.CombinationsMap,
  ] = yield all([
    select((state: ApplicationState) => getSportsbookConfirmationCombinations(state)),
    select((state: ApplicationState) => getSportsbookBettingCombinations(state)),
  ]);

  const combinationsUpdated = Object.values(combinations).reduce(
    (acc: BettingState.CombinationsMap, combination: BettingState.Combination) => {
      const currentBet = bettingCombinations[combination.id];
      const shouldUpdateCombination =
        currentBet?.totalCombinedStake && JSON.stringify(currentBet) !== JSON.stringify(combination);

      if (shouldUpdateCombination) {
        acc[combination.id] = currentBet;
      }

      return acc;
    },
    {},
  );

  if (!Object.keys(combinationsUpdated).length) {
    return;
  }

  yield put<BettingSportsbookConfirmationOddsMovementAction>({
    type: BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
    payload: {
      combinations: { ...combinations, ...combinationsUpdated },
    },
  });
}

function* updateFailures(): SagaIterator {
  const step = yield select((state: ApplicationState) => getBetslipStep(state));

  if (step === "CONFIRM_POTENTIAL") {
    const [implyRunnerFailures, ignoredBets, legs, currentAvailabilityChanged, combinations, bettingCombinations]: [
      BettingState.ImplyRunnerFailuresMap,
      IgnoredBets,
      BettingState.LegsMap,
      BetslipSportsbookConfirmationBet["availabilityChanged"],
      BetslipSportsbookConfirmationBet["combinations"],
      BettingState.CombinationsMap,
    ] = yield all([
      select((state: ApplicationState) => getSportsbookBettingImplyRunnerFailures(state)),
      select((state: ApplicationState) => getSportsbookConfirmationIgnoredBets(state)),
      select((state: ApplicationState) => getSportsbookConfirmationLegs(state)),
      select((state: ApplicationState) => getSportsbookConfirmationAvailability(state)),
      select((state: ApplicationState) => getSportsbookConfirmationCombinations(state)),
      select((state: ApplicationState) => getSportsbookBettingCombinations(state)),
    ]);

    Object.keys(implyRunnerFailures).forEach((runnerId) => {
      if (
        !hasAnyMarketSuspendedFailure(implyRunnerFailures[runnerId]) &&
        !hasAnyMarketClosedFailure(implyRunnerFailures[runnerId])
      ) {
        delete implyRunnerFailures[runnerId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
      }
    });

    let availabilityChanged = currentAvailabilityChanged;

    const hasNewFailures = Object.keys(implyRunnerFailures).some(
      (runnerId) =>
        !ignoredBets.some((bet) => bet.id === runnerId && bet.hasStake) &&
        Object.values(combinations).some((combination) =>
          combination.legs.some((leg) => legs[leg].runners.includes(runnerId)),
        ),
    );

    const hasRemovedFailures = Object.values(ignoredBets).some(
      (runner) => !implyRunnerFailures[runner.id] && runner.hasStake && runner.shouldShowNotification,
    );

    const combinationRemoved = Object.values(combinations).some((combination) => !bettingCombinations[combination.id]);

    if (hasNewFailures || hasRemovedFailures || combinationRemoved) {
      availabilityChanged = true;
    }

    yield put<BettingSportsbookUpdateSportsbookConfirmationFailuresAction>({
      type: BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
      payload: {
        failures: implyRunnerFailures,
        availabilityChanged,
      },
    });
  }
}

export function* sportsbookBetslipConfirmSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(BETTING__SBK_CONFIRM_BETS, createSnapshot);
  yield takeLatest(BETTING__SBK_EDIT_BETS, remakeBettings);
  yield takeLatest(BETTING__SBK_STATE_UPDATE, updateCombinationsMovement);
  yield takeLatest(FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, updateFailures);
}
