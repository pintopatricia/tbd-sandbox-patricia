import { BaseballPeriod, BaseballClock } from "@ppb/tbd-store/state/entities/baseball-fixture/BaseballFixture";
import { ScoreData, ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";

const getStatusLabel = (baseballClock: BaseballClock | undefined, viewMode: ScoreboardViewMode): string => {
  if (!baseballClock) {
    return "";
  }
  const { period } = baseballClock;

  switch (period) {
    case BaseballPeriod.END:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.FULL_TIME" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" });

    default:
      break;
  }

  return "";
};

const formatCouponScoreBoardData = (scoreBoardData: ScoreData[]): ScoreData[] => {
  // Always strip the grey columns (history/innings).
  if (scoreBoardData && scoreBoardData.length > 0) {
    return [scoreBoardData[0]];
  }

  return scoreBoardData;
};

const isBaseballFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
  prevProps.competition === nextProps.competition &&
  prevProps.date === nextProps.date &&
  prevProps.matchStatus === nextProps.matchStatus &&
  prevProps.showBottomSeparator === nextProps.showBottomSeparator &&
  prevProps.sporteventURN === nextProps.sporteventURN &&
  prevProps.time === nextProps.time &&
  prevProps.urn === nextProps.urn &&
  prevProps.viewMode === nextProps.viewMode &&
  prevProps.teamA?.name === nextProps.teamA?.name &&
  prevProps.teamB?.name === nextProps.teamB?.name &&
  prevProps.notificationsSubscription === nextProps.notificationsSubscription &&
  JSON.stringify(prevProps.scoreData) === JSON.stringify(nextProps.scoreData) &&
  getStatusLabel(prevProps.clock, prevProps.viewMode) === getStatusLabel(nextProps.clock, nextProps.viewMode);

export { getStatusLabel, isBaseballFixtureEqual, formatCouponScoreBoardData };
