import { ScoreData, ScoreboardViewMode, MatchStatus, ScoreStyle } from "@ppb/the-wall-common/types";
import { TableTennisSet } from "@ppb/tbd-store/state/entities/table-tennis-fixture/TableTennisFixture.types";
import { ComponentProps } from "./props";

const formatCouponScoreBoardData = (
  scoreBoardData: ScoreData[],
  viewMode: ScoreboardViewMode,
  currentSet?: TableTennisSet,
  matchStatus?: MatchStatus,
): ScoreData[] => {
  const scoreBoardInplayIndex = scoreBoardData.findIndex((score) => score.style === ScoreStyle.IN_PLAY);

  if (viewMode === ScoreboardViewMode.COUPON) {
    if (matchStatus === MatchStatus.END) {
      return [scoreBoardData[0]];
    }

    if (matchStatus === MatchStatus.IN_PLAY && currentSet) {
      return [scoreBoardData[0], scoreBoardData[currentSet.number || scoreBoardInplayIndex]];
    }
  }

  return scoreBoardData;
};

const isEqualFixture: (previous: ComponentProps, current: ComponentProps) => boolean = (previous, current) =>
  JSON.stringify(previous) === JSON.stringify(current);

export { formatCouponScoreBoardData, isEqualFixture };
