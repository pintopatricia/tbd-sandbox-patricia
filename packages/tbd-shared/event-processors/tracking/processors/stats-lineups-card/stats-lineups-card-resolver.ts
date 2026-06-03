import { buildInterfaceEvent, InterfaceEvent } from "tagging-library";
import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { StatsLineupsCardEvents } from "@ppb/tbd-components-rich-data/components/StatsLineupsCard/viewmodel/events";
import { getStatsLineupsCard } from "./StatsLineupsCard.graphql";

export async function statsLineupsOnChangeViewTrackingResolver(
  payload: StatsLineupsCardEvents["@@UI/STATS_LINEUPS_CARD_CHANGE_VIEW"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const cardData = await getStatsLineupsCard(payload.cardUrn);

  if (!cardData) {
    return;
  }

  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);
  const view = payload.view === "formation-view" ? "formation view" : "list view";
  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `stats - lineups - view switcher - ${view}`,
    module: `${pageType} - lineups - null - ${cardData.sportEvent.competition?.name ?? "null"} - ${
      cardData.sportEvent.name
    } - ${cardData.status}`,
  });

  sendEvent(event);
}
