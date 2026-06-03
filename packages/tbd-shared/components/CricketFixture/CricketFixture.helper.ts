import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";
import { CricketScoreData } from "../../view-model-factories/cricket-fixture";
import { ComponentProps } from "./props";

/**
 * Format the CricketScoreData to a formatted array of ScoreData objects for the Coupon View
 *
 * When the matchStatus is END
 * - show the sum of all the innings for both home and away with the style BORDER
 *
 * When the matchStatus is not END
 * - show all the innings for both home and away
 */
const formatCouponViewScoreData = (
  { teamATotalRuns, teamBTotalRuns, scoreData }: CricketScoreData,
  matchStatus: MatchStatus | undefined,
): ScoreData[] => {
  if (matchStatus === MatchStatus.END) {
    return [{ teamA: teamATotalRuns, teamB: teamBTotalRuns, style: ScoreStyle.FINISHED }];
  }

  return scoreData;
};

const isCricketFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

export { formatCouponViewScoreData, isCricketFixtureEqual };
