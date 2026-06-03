import { buildInterfaceEvent } from "tagging-library";
import type { InterfaceEvent } from "tagging-library";
import type { StatsTeamsCardEvents } from "../../../../components/StatsTeamsCard/viewmodel/events";
import { getStatsTeamsCard } from "./StatsTeamsCard.graphql";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";

export async function statsTeamsCardExpandableButtonTrackingResolver(
  payload: StatsTeamsCardEvents["@@UI/STATS_TEAMS_CARD_EXPAND_ICON_CHANGED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const params = await getStatsTeamsCard(payload.urn);
  if (!params) {
    return;
  }

  const competitionName = params.fixture.sportevent.competition?.name.toLocaleLowerCase();
  const eventName = params.fixture.sportevent.name.toLocaleLowerCase();

  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const eventData = {
    action: payload.isExpanded ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: `stats - ${payload.stat_tab} - ${payload.stat_type}`,
    module: `${pageType} - null - null - ${competitionName} - ${eventName} - pre_match`,
  };

  const event = buildInterfaceEvent(eventData);
  sendEvent(event);
}
