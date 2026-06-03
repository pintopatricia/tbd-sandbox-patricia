import { PotentialBet, RunnerPosition, UnmatchedBet, BetEngineState } from "@ppb/bet-engine";
import { defaultMemoize, ParametricSelector, createSelectorCreator } from "reselect";
import { MarketRunner } from "../../entities";
import { ApplicationState } from "../../ApplicationState.types";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import URN from "../../layout/URN";

export type BetslipSelectionDescription = {
  title: string;
  subtitle: string;
};

export const isOfRunner = (potentialBet: PotentialBet, runner: MarketRunner): boolean =>
  potentialBet.selectionId === runner.selectionId && potentialBet.handicap === runner.handicap;

export const getUnmatchedBets = (state: ApplicationState, marketUrn: URN, betIds: string[]): UnmatchedBet[] => {
  const marketState = state.betting.exchangeBetting[marketUrn];

  if (!marketState) {
    return [];
  }

  return marketState.unmatchedBets.filter((bet) => betIds.includes(bet.id.slice(2)));
};

export const createMarketPotentialBetsSelector = (): ParametricSelector<
  BetEngineState,
  URN,
  PotentialBet[] | undefined
> =>
  createShallowEqualSelector(
    (exchangeBetting: BetEngineState, marketUrn: URN) => exchangeBetting[marketUrn]?.potentialBets,
    (potentialBets): PotentialBet[] | undefined => potentialBets,
  );

export const getMarketPotentialBets = (state: ApplicationState, marketUrn: URN): PotentialBet[] => {
  const marketState = state.betting.exchangeBetting[marketUrn];
  if (!marketState) {
    return [];
  }

  return marketState.potentialBets;
};

export const getBettingMarket = (state: ApplicationState, marketUrn: URN) => state.betting.exchangeBetting[marketUrn];

const exchangeRunnerPositionHasUpdates = (runner: RunnerPosition, updatedRunner: RunnerPosition): boolean => {
  if (!runner || !updatedRunner) {
    return false;
  }

  if (runner.handicap !== updatedRunner.handicap) {
    return true;
  }

  if (runner.pnl.lose !== updatedRunner.pnl.lose) {
    return true;
  }

  if (runner.pnl.win !== updatedRunner.pnl.win) {
    return true;
  }

  if (runner.potentialPnl.lose !== updatedRunner.potentialPnl.lose) {
    return true;
  }

  if (runner.potentialPnl.win !== updatedRunner.potentialPnl.win) {
    return true;
  }

  if (runner.whatIf.lose !== updatedRunner.whatIf.lose) {
    return true;
  }

  if (runner.whatIf.win !== updatedRunner.whatIf.win) {
    return true;
  }

  return false;
};

const isRunnersPositionEqual: (runners1: RunnerPosition[], runners2: RunnerPosition[]) => boolean = (
  runners1,
  runners2,
) => {
  if (runners1.length !== runners2.length) {
    return false;
  }

  const runnerWithChanges = runners1.find((runner, index) => exchangeRunnerPositionHasUpdates(runner, runners2[index]));

  if (runnerWithChanges) {
    return false;
  }
  return true;
};

export const createBettingMarketRunnersPositionSelector = () =>
  createSelectorCreator(defaultMemoize, isRunnersPositionEqual)(
    (exchangeBetting: BetEngineState, marketUrn: URN) => exchangeBetting[marketUrn]?.runnersPosition || [],
    (runnersPosition): RunnerPosition[] | undefined => runnersPosition,
  );
