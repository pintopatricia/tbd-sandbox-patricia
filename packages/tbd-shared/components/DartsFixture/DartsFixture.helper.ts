import { ScoreData, ScoreboardViewMode, MatchStatus } from "@ppb/the-wall-common/types";
import { DartsSet } from "@ppb/tbd-store/state/entities/darts-fixture/DartsFixture";
import { ComponentProps } from "./props";

const formatCouponScoreBoardData = (
  scoreBoardData: ScoreData[],
  viewMode: ScoreboardViewMode,
  currentSet?: DartsSet,
  matchStatus?: MatchStatus,
): ScoreData[] => {
  if (viewMode === ScoreboardViewMode.COUPON) {
    if (matchStatus === MatchStatus.END) {
      return [scoreBoardData[0]];
    }

    if (matchStatus === MatchStatus.IN_PLAY) {
      return scoreBoardData;
    }
  }

  return scoreBoardData;
};

const isDartsFixtureEqual: (previous: ComponentProps, current: ComponentProps) => boolean = (previous, current) =>
  JSON.stringify(previous) === JSON.stringify(current);

export { formatCouponScoreBoardData, isDartsFixtureEqual };
