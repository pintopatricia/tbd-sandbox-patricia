import { formatTextToGA } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { StatsPlayersSeasonStatsEvents } from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/viewmodel/events";
import { buildNavigationEvent, NavigationEvent } from "tagging-library";

export async function navigateToPlayerPageResolver(
  payload: StatsPlayersSeasonStatsEvents["@@UI/STATS_PLAYERS_SEASON_STATS_PLAYER_CLICK"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: formatTextToGA(payload.playerName),
    module: `Event - Player Season Stats - ${payload.playerName}`,
    destinationUrl: payload.viewLink.viewUrl,
    position: "null",
    moduleDisplayOrder: "null",
  });

  sendEvent(event);
}
