import {
  AmericanFootballPeriod,
  AmericanFootballClock,
} from "@ppb/tbd-store/state/entities/american-football-fixture/AmericanFootballFixture";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";

const getStatusLabel = (
  americanFootballClock: AmericanFootballClock | undefined,
  viewMode: ScoreboardViewMode,
): string => {
  if (!americanFootballClock || !americanFootballClock.period) {
    return "";
  }
  const { period, timeElapsed } = americanFootballClock;

  let periodLabel = "";

  switch (period) {
    case AmericanFootballPeriod.PERIOD_1:
      periodLabel = "Q1";
      break;
    case AmericanFootballPeriod.PERIOD_2:
      periodLabel = "Q2";
      break;
    case AmericanFootballPeriod.PERIOD_3:
      periodLabel = "Q3";
      break;
    case AmericanFootballPeriod.PERIOD_4:
      periodLabel = "Q4";
      break;
    case AmericanFootballPeriod.OVERTIME:
      periodLabel = "OT";
      break;
    case AmericanFootballPeriod.END:
      return "FT";
    case AmericanFootballPeriod.END_PERIOD_1:
    case AmericanFootballPeriod.END_PERIOD_2:
    case AmericanFootballPeriod.END_PERIOD_3:
    case AmericanFootballPeriod.END_PERIOD_4:
    case AmericanFootballPeriod.END_OVERTIME:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.END_PERIOD" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.END_PERIOD" });

    default:
      return "";
  }

  if (timeElapsed !== undefined && timeElapsed !== null) {
    const minutes = Math.floor(timeElapsed / 60);
    return `${periodLabel} ${minutes}'`;
  }

  return periodLabel;
};

const isAmericanFootballFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
  prevProps.competition === nextProps.competition &&
  prevProps.date === nextProps.date &&
  prevProps.matchStatus === nextProps.matchStatus &&
  prevProps.prefixLabel === nextProps.prefixLabel &&
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

export { getStatusLabel, isAmericanFootballFixtureEqual };
