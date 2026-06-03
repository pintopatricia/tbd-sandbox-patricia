import { BasketballPeriod, BasketballClock } from "@ppb/tbd-store/state/entities/basketball-fixture/BasketballFixture";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";

const getStatusLabel = (basketballClock: BasketballClock | undefined, viewMode: ScoreboardViewMode): string => {
  if (!basketballClock) {
    return "";
  }
  const { period, timeRemaining, segment } = basketballClock;

  switch (period) {
    case BasketballPeriod.END_PERIOD_1:
    case BasketballPeriod.END_PERIOD_2:
    case BasketballPeriod.END_PERIOD_3:
    case BasketballPeriod.END_PERIOD_4:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.END_PERIOD" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.END_PERIOD" });
    case BasketballPeriod.END:
      return viewMode === ScoreboardViewMode.DEFAULT
        ? i18n({ key: "I18N.MATCH_TIMELINE.FULL_TIME" })
        : i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" });

    default:
      break;
  }

  return timeRemaining !== undefined ? `${Math.floor(timeRemaining / 60)}'` : segment || "";
};

const isBasketballFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
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

export { getStatusLabel, isBasketballFixtureEqual };
