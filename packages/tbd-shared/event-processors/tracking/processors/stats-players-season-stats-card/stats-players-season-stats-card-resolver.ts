import { buildInterfaceEvent, InterfaceEvent } from "tagging-library";
import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { StatsPlayersSeasonStatsEvents } from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/viewmodel/events";
import { getStatsPlayersSeasonStats } from "./StatsPlayersSeasonStatsCard.graphql";

export async function statsPlayersSeasonStatsExpandableButtonTrackingResolver(
  payload: StatsPlayersSeasonStatsEvents["@@UI/STATS_PLAYERS_SEASON_STATS_EXPANDABLE_BUTTON_CLICK"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  if (!payload.urn || !payload.urn) {
    return;
  }

  const cardData = await getStatsPlayersSeasonStats(payload.urn);

  if (!cardData) {
    return;
  }

  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const event = buildInterfaceEvent({
    action: payload.isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: `stats - ${payload.isOpen ? "show more" : "show less"}`,
    module: `${pageType} - null - null - ${cardData.sportEvent.competition?.name} - ${cardData.sportEvent.name} - pre-match`,
  });

  sendEvent(event);
}
