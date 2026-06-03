import { IceHockeyPeriod, IceHockeyClock } from "@ppb/tbd-store/state/entities/ice-hockey-fixture/IceHockeyFixture";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";

const getStatusLabel = (iceHockeyClock: IceHockeyClock | undefined, viewMode: ScoreboardViewMode): string => {
  if (!iceHockeyClock) {
    return "";
  }
  const { period } = iceHockeyClock;

  switch (period) {
    case IceHockeyPeriod.END_PERIOD_1:
    case IceHockeyPeriod.END_PERIOD_2:
    case IceHockeyPeriod.END_PERIOD_3:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.END_PERIOD" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.END_PERIOD" });
    case IceHockeyPeriod.END:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.FULL_TIME" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" });

    default:
      break;
  }

  return "";
};

const isIceHockeyFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
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

export { getStatusLabel, isIceHockeyFixtureEqual };
