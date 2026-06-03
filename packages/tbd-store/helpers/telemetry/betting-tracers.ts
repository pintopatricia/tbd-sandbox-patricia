import { Tracer, Span } from "@opentelemetry/api";
import { SportsbookTransactionalError } from "../../services/sportsbook-bet-service";
import { getBasicSpan } from "./betting-telemetry";
import {
  PlaceBetResultLeg,
  PlaceBetResultRunner,
} from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookPlaceBet/FixedOddsTransactional";
import {
  BetCombination,
  ImplyBetsResult,
  ImplyBetsRunnerFailure,
  RunnerOdds,
  Runner,
} from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookImplyBets/SportsbookImplyBets";

export function traceLegDefinition(tracer: Tracer, definition: SportsbookTransactionalError["definitions"][0]): void {
  definition.legs?.forEach((leg, legIndex) => {
    tracer.startActiveSpan(
      `betting.placeBet.exception.operational.definition.${definition.betNo}.leg.${legIndex}`,
      {
        attributes: {
          "workflow.name": "betting.placeBet.exception.operational",
          [`bet.${definition.betNo}.leg.${legIndex}.runners`]: JSON.stringify(leg.betRunners),
          [`bet.${definition.betNo}.leg.${legIndex}.odds`]: leg.winExpectedOdds?.decimalOdds?.decimalOdds,
        },
      },
      (span) => span.end(),
    );
  });
}

export function traceLegResult(tracer: Tracer, legs: PlaceBetResultLeg[]): void {
  const uniqueFailureCodes = [...new Set(legs.map((leg) => leg.failureCode))];

  uniqueFailureCodes.forEach((failureCode) => {
    if (!failureCode) {
      return;
    }

    tracer.startActiveSpan(
      `betting.placeBet.exception.operational.result.leg.failure.${failureCode}`,
      {
        attributes: {
          "workflow.name": "betting.placeBet.exception.operational",
        },
      },
      (span) => span.end(),
    );
  });
}

export function traceRunnerResult(tracer: Tracer, runners: PlaceBetResultRunner[]): void {
  const uniqueFailureCodes = [...new Set(runners.map((runner) => runner.failureCode))];

  uniqueFailureCodes.forEach((failureCode) => {
    if (!failureCode) {
      return;
    }

    tracer.startActiveSpan(
      `betting.placeBet.exception.operational.result.runner.failure.${failureCode}`,
      {
        attributes: {
          "workflow.name": "betting.placeBet.exception.operational",
        },
      },
      (span) => span.end(),
    );
  });
}

export function tracePlaceBet(tracer: Tracer, definition: SportsbookTransactionalError["definitions"][0]): void {
  tracer.startActiveSpan(
    `betting.placeBet.exception.operational.definition.${definition.betNo}`,
    {
      attributes: {
        "workflow.name": "betting.placeBet.exception.operational",
        [`bet.${definition.betNo}.ref`]: definition.betReference,
        [`bet.${definition.betNo}.odds`]: definition.winExpectedOdds?.trueOdds.decimalOdds?.decimalOdds,
        [`bet.${definition.betNo}.type`]: definition.betType,
        [`bet.${definition.betNo}.stake`]: definition.stakePerLine,
      },
    },
    (span) => {
      traceLegDefinition(tracer, definition);

      span.end();
    },
  );
}

export function traceCombinations(tracer: Tracer, betCombinations: BetCombination[], parentSpan?: Span): void {
  betCombinations.forEach((combination, index) => {
    const span = getBasicSpan(
      tracer,
      `betting.implyBets.combination.${combination.betType}.${combination.betReference || index}`,
      parentSpan,
      `betting.implyBets.combination`,
    );

    span.setAttributes({
      "combination.numLines": combination.numLines,
      "combination.combinationGroup": combination.combinationGroup,
      "combination.combinationGroupId": combination.combinationGroupId,
      "combination.trueWinAvgOdds": JSON.stringify(combination.winAvgOdds?.trueOdds),
      "combination.trueEachwayAvgOdds": JSON.stringify(combination.eachwayAvgOdds?.trueOdds),
    });

    span.end();
  });
}

export function traceWinRunnerOdds(tracer: Tracer, winRunnerOdds: RunnerOdds[], parentSpan?: Span): void {
  winRunnerOdds
    ?.filter((runnerOdd): runnerOdd is RunnerOdds & { runner: Runner } => !!runnerOdd.runner)
    .forEach((runnerOdd) => {
      const {
        runner: { marketId, selectionId },
        combinationGroups,
        inplay,
        odds,
      } = runnerOdd;

      const span = getBasicSpan(
        tracer,
        `betting.implyBets.runner.${marketId}-${selectionId}`,
        parentSpan,
        `betting.implyBets.runner`,
      );

      span.setAttributes({
        "runner.combinationGroups": combinationGroups?.join(","),
        "runner.inplay": inplay,
        "runner.trueOdds": JSON.stringify(odds?.trueOdds),
      });

      span.end();
    });
}

export function traceBetFailures(tracer: Tracer, failures: ImplyBetsRunnerFailure[], parentSpan?: Span): void {
  failures
    ?.filter(
      (runnerFailure): runnerFailure is ImplyBetsRunnerFailure & { failedRunner: Runner } =>
        !!runnerFailure.failedRunner,
    )
    .forEach((runnerFailure) => {
      const {
        failedRunner: { marketId, selectionId },
        failureCode,
        combinationGroupIds,
        combinationGroups,
      } = runnerFailure;
      const span = getBasicSpan(
        tracer,
        `betting.implyBets.runner.failure.${failureCode}`,
        parentSpan,
        `betting.implyBets.runner.failure`,
      );

      span.setAttributes({
        "runner.failure.runner": `betting.implyBets.runner.${marketId}-${selectionId}`,
        "runner.failure.failureCode": failureCode,
        "runner.failure.combinationGroupIds": combinationGroupIds?.join(","),
        "runner.failure.combinationGroups": combinationGroups?.join(","),
      });

      span.end();
    });
}

export function traceImply(tracer: Tracer, response: ImplyBetsResult[], parentSpan?: Span): void {
  response.forEach((result, index) => {
    const rootSpan = getBasicSpan(tracer, `betting.implyBets.result.${index}`, parentSpan, `betting.implyBets.result`);

    traceCombinations(tracer, result.betCombinations, rootSpan);
    traceWinRunnerOdds(tracer, result.winRunnerOdds || [], rootSpan);
    traceBetFailures(tracer, result.betFailures || [], rootSpan);

    rootSpan.end();
  });
}
