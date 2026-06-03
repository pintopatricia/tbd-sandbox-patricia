import {
  AustralianRulesScore,
  AustralianRulesScoreBoard,
  AustralianRulesFixture,
  AustralianRulesPeriod,
  AustralianRulesPeriodScore,
} from "../../../../../state/entities";
import { AustralianRulesFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeAustralianRulesScoreIntoAustralianRulesScore = (
  australianRulesScore?: { scoreHome: number | null; scoreAway: number | null } | null,
): AustralianRulesScore | undefined => {
  if (
    !australianRulesScore ||
    typeof australianRulesScore.scoreHome !== "number" ||
    typeof australianRulesScore.scoreAway !== "number"
  ) {
    return undefined;
  }

  return {
    home: australianRulesScore.scoreHome,
    away: australianRulesScore.scoreAway,
  };
};

const normalizeAustralianRulesScoreBoardIntoAustralianRulesScoreBoard = (
  australianRulesScoreBoard: {
    goals: { scoreHome: number | null; scoreAway: number | null } | null;
    behinds: { scoreHome: number | null; scoreAway: number | null } | null;
    points: { scoreHome: number | null; scoreAway: number | null } | null;
  } | null,
): AustralianRulesScoreBoard | undefined => {
  const { goals, behinds, points } = australianRulesScoreBoard || {};

  if (!australianRulesScoreBoard || (!goals && !behinds && !points)) {
    return undefined;
  }

  return {
    goals: normalizeAustralianRulesScoreIntoAustralianRulesScore(goals),
    behinds: normalizeAustralianRulesScoreIntoAustralianRulesScore(behinds),
    points: normalizeAustralianRulesScoreIntoAustralianRulesScore(points),
  };
};

const normalizeAustralianRulesPeriodScoresIntoAustralianRulesPeriodScores = (
  fixture: AustralianRulesFixtureFragment,
): AustralianRulesPeriodScore[] | undefined => {
  if (!fixture) {
    return undefined;
  }
  const { periodScores } = fixture;

  if (!periodScores) {
    return undefined;
  }

  return periodScores.reduce<AustralianRulesPeriodScore[]>((acc, periodScore) => {
    if (periodScore) {
      acc.push({
        score: normalizeAustralianRulesScoreBoardIntoAustralianRulesScoreBoard(periodScore.score),
        period: periodScore.australianRulesPeriod
          ? AustralianRulesPeriod[periodScore.australianRulesPeriod]
          : undefined,
      });
    }
    return acc;
  }, []);
};

const normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture = (
  fragment: AustralianRulesFixtureFragment,
): TransformedFragment<AustralianRulesFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, score } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeAustralianRulesScoreBoardIntoAustralianRulesScoreBoard(score),
      periodScores: normalizeAustralianRulesPeriodScoresIntoAustralianRulesPeriodScores(fragment),
    },
  };
};

export default normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture;
