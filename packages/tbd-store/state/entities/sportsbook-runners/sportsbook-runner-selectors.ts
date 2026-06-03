import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { SportsbookRunner, SportsbookRunnerStatus, SportsbookRunners } from "./SportsbookRunner.types";

import { ApplicationState } from "../../ApplicationState.types";
import { createSportsbookMarketByURNSelector, isLegInState } from "../sportsbook-markets/sportsbook-market-selectors";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import { isRaceHierarchy } from "../../../helpers/markets";
import { EachWayOdds, SportsbookOdds } from "../SportsbookOdds.types";
import URN from "../../layout/URN";

const hasMaintainedAllSportsbookRunnerOdds: (
  runnerOdds: SportsbookRunner,
  updatedRunnerOdds: SportsbookRunner,
) => boolean = (runner, updatedRunner) => {
  // if the odds are added or removed
  if (!!runner !== !!updatedRunner) {
    return false;
  }

  const { odds, previousOdds, eachWayOdds, trueOdds } = runner;
  const {
    odds: updatedOdds,
    previousOdds: updatedPreviousOdds,
    eachWayOdds: updatedEachWayOdds,
    trueOdds: updatedTrueOdds,
  } = updatedRunner;

  // odds
  if (odds && updatedOdds) {
    if (odds.decimal !== updatedOdds.decimal) {
      return false;
    }
    if (odds.fractional?.denominator !== updatedOdds.fractional?.denominator) {
      return false;
    }
    if (odds.fractional?.numerator !== updatedOdds.fractional?.numerator) {
      return false;
    }
  }

  // previousOdds
  if (!previousOdds && updatedPreviousOdds) {
    return false;
  }

  if (previousOdds && !updatedPreviousOdds) {
    return false;
  }

  if (previousOdds && previousOdds[0] && updatedPreviousOdds && updatedPreviousOdds[0]) {
    if (previousOdds[0].decimal !== updatedPreviousOdds[0].decimal) {
      return false;
    }
    if (previousOdds[0].fractional?.denominator !== updatedPreviousOdds[0].fractional?.denominator) {
      return false;
    }
    if (previousOdds[0].fractional?.numerator !== updatedPreviousOdds[0].fractional?.numerator) {
      return false;
    }
  }

  // eachWayOdds
  if (eachWayOdds && updatedEachWayOdds) {
    if (eachWayOdds.trueOdds?.decimal !== updatedEachWayOdds.trueOdds?.decimal) {
      return false;
    }
    if (eachWayOdds.trueOdds?.fractional?.denominator !== updatedEachWayOdds.trueOdds?.fractional?.denominator) {
      return false;
    }
    if (eachWayOdds.trueOdds?.fractional?.numerator !== updatedEachWayOdds.trueOdds?.fractional?.numerator) {
      return false;
    }
  }

  // trueOdds
  if (trueOdds && updatedTrueOdds) {
    if (trueOdds.decimal !== updatedTrueOdds.decimal) {
      return false;
    }
    if (trueOdds.fractional?.denominator !== updatedTrueOdds.fractional?.denominator) {
      return false;
    }
    if (trueOdds.fractional?.numerator !== updatedTrueOdds.fractional?.numerator) {
      return false;
    }
  }

  return true;
};

type SportsbookRunnerOdds = {
  odds?: SportsbookOdds;
  previousOdds?: SportsbookOdds[];
  trueOdds?: SportsbookOdds;
  eachWayOdds?: EachWayOdds;
};

export const createSportsbookRunnerOddsByURNSelector = () =>
  createSelectorCreator(defaultMemoize, hasMaintainedAllSportsbookRunnerOdds)(
    [(runner: SportsbookRunner) => runner],
    (runner: SportsbookRunner) => ({
      odds: runner?.odds,
      previousOdds: runner?.previousOdds,
      trueOdds: runner?.trueOdds,
      eachWayOdds: runner?.eachWayOdds,
    }),
  );

export const createSportsbookRunnerByURNSelector = () => {
  const getSportsbookRunnerOddsByURN = createSportsbookRunnerOddsByURNSelector();

  return createShallowEqualSelector(
    [
      (
        sportsbookrunners: SportsbookRunners,
        urn: URN,
      ): Omit<SportsbookRunner, "odds" | "previousOdds" | "trueOdds" | "eachWayOdds"> | undefined => {
        // Odds are being removed from this input selector in order to avoid having nested data structures that would keep invalidating reselect's cache.
        // Instead, this selector focus on properties other than odds.
        if (sportsbookrunners[urn]) {
          const { odds, previousOdds, trueOdds, eachWayOdds, ...rest } = sportsbookrunners[urn];
          return rest;
        }

        return undefined;
      },
      (sportsbookrunners: SportsbookRunners, urn: URN): SportsbookRunnerOdds | undefined => {
        // This selector focuses uniquely on the runner odds, where a custom compare function is applied to ensure that cache is invalidated only when there are actual changes in the odds.
        const runner = sportsbookrunners[urn];
        return getSportsbookRunnerOddsByURN(runner);
      },
    ],
    (sportsbookrunner, odds): SportsbookRunner | undefined =>
      sportsbookrunner &&
      odds && {
        ...sportsbookrunner,
        ...odds,
      },
  );
};

export const createSportsbookRunnerWithBettingLegStateByURNSelector = () => {
  type SbkRunnerWithBettingStateSelectorProps = { runnerUrn: URN; marketUrn: URN };
  const getSportsbookRunnerByURNSelector = createSportsbookRunnerByURNSelector();
  const getSportsbookMarketByURNSelector = createSportsbookMarketByURNSelector();

  return createSelector(
    [
      (state: ApplicationState, { runnerUrn }: SbkRunnerWithBettingStateSelectorProps) =>
        getSportsbookRunnerByURNSelector(state.entities.sportsbookrunners, runnerUrn),
      (state: ApplicationState, { marketUrn }: SbkRunnerWithBettingStateSelectorProps) =>
        getSportsbookMarketByURNSelector(state.entities.sportsbookmarkets, marketUrn),
      (state: ApplicationState) => state.betting.sportsbookBetting,
    ],
    (
      sportsbookrunner,
      sportsbookMarket,
      sportsbookBetting,
    ): (SportsbookRunner & { isPotentialBet: boolean; isStartingPrice: boolean }) | undefined => {
      if (!sportsbookrunner || !sportsbookMarket) {
        return undefined;
      }

      const isPotentialBet = isLegInState(sportsbookrunner.market, sportsbookrunner.selectionId, sportsbookBetting);
      const isRaceMarket = isRaceHierarchy(sportsbookMarket.hierarchy);
      const isStartingPrice = isRaceMarket && sportsbookrunner.status === "ACTIVE" && !!sportsbookMarket.bspMarket;

      return {
        ...sportsbookrunner,
        isPotentialBet,
        isStartingPrice,
      };
    },
  );
};

export const createSportsbookRunnerStatusSelector = () =>
  createSelector(
    [
      (sportsbookrunners: SportsbookRunners, sportsbookRunnerURN: URN): SportsbookRunnerStatus | undefined =>
        sportsbookrunners[sportsbookRunnerURN]?.status,
    ],
    (runnerStatus?: SportsbookRunnerStatus) => runnerStatus,
  );
