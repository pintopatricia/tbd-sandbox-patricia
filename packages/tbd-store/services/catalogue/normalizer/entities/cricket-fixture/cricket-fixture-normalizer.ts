import { CricketInning, CricketTime, CricketScore, CricketFixture, TeamSide } from "../../../../../state/entities";
import { CricketFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCricketInningIntoCricketInning = (scores: CricketInning[] | null): CricketInning[] | undefined => {
  if (!scores?.length) {
    return [];
  }

  return scores.reduce<CricketInning[]>((acc, score) => {
    if (score) {
      acc.push({
        inningNumber: score.inningNumber ? score.inningNumber : undefined,
        runs: score.runs || score.runs === 0 ? score.runs : undefined,
        wickets: score.wickets || score.wickets === 0 ? score.wickets : undefined,
      });
    }
    return acc;
  }, []);
};

const normalizeCricketScoreIntoCricketScore = (fixture: CricketFixtureFragment): CricketScore | undefined => {
  if (!fixture) {
    return undefined;
  }

  const { score } = fixture;

  if (!score) {
    return undefined;
  }

  return {
    home: normalizeCricketInningIntoCricketInning(score.homeScore as CricketInning[]),
    away: normalizeCricketInningIntoCricketInning(score.awayScore as CricketInning[]),
  };
};

const normalizeCurrentTimeIntoCurrentTime = (currentTime: CricketTime): CricketTime | undefined => {
  if (!currentTime) {
    return undefined;
  }

  return {
    inning: currentTime.inning,
    over: currentTime.over,
  };
};

const normalizeCricketFixtureFragmentIntoCricketFixture = (
  fragment: CricketFixtureFragment,
): TransformedFragment<CricketFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, currentTeamBatting, currentTime } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeCricketScoreIntoCricketScore(fragment),
      currentTeamBatting: currentTeamBatting ? TeamSide[currentTeamBatting] : undefined,
      currentTime: normalizeCurrentTimeIntoCurrentTime(currentTime as CricketTime),
    },
  };
};

export default normalizeCricketFixtureFragmentIntoCricketFixture;
