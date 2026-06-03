import { RUNNER_FAILURE_CODES, BettingState, generateRunnerId } from "@ppb/betslip-core";
import { SportsbookMarkets, SportsbookRunners } from "../state/entities";
import { SportsbookRunnerStatus } from "../state/constants";

const MARKET_STATUS_AS_FAILURE_CODE = {
  CLOSED: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
  SUSPENDED: RUNNER_FAILURE_CODES.MARKET_SUSPENDED,
  OPEN: "",
};
const RUNNER_STATUS_AS_FAILURE_CODE = {
  [SportsbookRunnerStatus.REMOVED]: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
  [SportsbookRunnerStatus.SUSPENDED]: RUNNER_FAILURE_CODES.RUNNER_SUSPENDED,
  [SportsbookRunnerStatus.ACTIVE]: "",
};

type EntityRunner = {
  marketId: string;
  marketStatus: RUNNER_FAILURE_CODES;
  runnerStatus: RUNNER_FAILURE_CODES;
  inplay: boolean;
  odds?: number;
  handicap: number;
};

type EntityRunnerMap = {
  [coreRunnerId: string]: EntityRunner;
};

export function buildEntityRunnerMap(
  runnerUrns: string[],
  markets: SportsbookMarkets,
  runners: SportsbookRunners,
): EntityRunnerMap {
  return runnerUrns.reduce((acc, runnerUrn) => {
    const sportsbookrunner = runners[runnerUrn];
    if (!sportsbookrunner) {
      return acc;
    }

    const { selectionId, market: marketURN, trueOdds, status: runnerStatus, handicap } = sportsbookrunner;
    const market = markets[marketURN];

    if (!market) {
      return acc;
    }

    const { marketId, status: marketStatus = "OPEN", inplay } = market;
    const runnerId = generateRunnerId({ marketId, selectionId });

    return {
      ...acc,
      [runnerId]: {
        marketId,
        marketStatus: MARKET_STATUS_AS_FAILURE_CODE[marketStatus],
        runnerStatus: RUNNER_STATUS_AS_FAILURE_CODE[runnerStatus],
        inplay,
        odds: trueOdds?.decimal,
        handicap,
      },
    };
  }, {});
}

export function buildBettingRunnerHash(
  runner: BettingState.Runner,
  failures: BettingState.ImplyRunnerFailure[] = [],
): string {
  const marketStatus = failures.find((failure) =>
    [RUNNER_FAILURE_CODES.MARKET_NOT_FOUND, RUNNER_FAILURE_CODES.MARKET_SUSPENDED].includes(failure.failureCode),
  );
  const runnerStatus = failures.find((failure) =>
    [RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND, RUNNER_FAILURE_CODES.RUNNER_SUSPENDED].includes(failure.failureCode),
  );
  const baseHash = `${runner.isInplay}${runner.handicap || 0}`;
  const marketStatusHash = marketStatus ? marketStatus?.failureCode : runnerStatus?.failureCode;
  const statusHash = marketStatusHash ? `${marketStatusHash || ""}` : `${runner.odds?.decimalOdds}`;

  return `${baseHash}${statusHash}`;
}

export function buildEntityRunnerHash(entityRunner: EntityRunner): string {
  const baseHash = `${entityRunner.inplay}${entityRunner.handicap || 0}`;
  const marketStatusHash = entityRunner.marketStatus ? entityRunner.marketStatus : entityRunner.runnerStatus;
  const statusHash = marketStatusHash ? `${marketStatusHash}` : `${entityRunner.odds}`;

  return `${baseHash}${statusHash}`;
}

export function isBettingStale(
  bettingRunners: BettingState.RunnersMap,
  bettingRunnersFailures: BettingState.ImplyRunnerFailuresMap,
  entityRunners: EntityRunnerMap,
): boolean {
  return Object.keys(bettingRunners).some((runnerId) => {
    const entityRunner = entityRunners[runnerId];

    if (!entityRunner) {
      return true;
    }

    const bettingRunner = bettingRunners[runnerId];
    const implyFailures = bettingRunnersFailures[runnerId];

    return buildBettingRunnerHash(bettingRunner, implyFailures) !== buildEntityRunnerHash(entityRunner);
  });
}
