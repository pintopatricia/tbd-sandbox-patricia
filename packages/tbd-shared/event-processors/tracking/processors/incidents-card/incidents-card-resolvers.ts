import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { buildInterfaceEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { IncidentsCardEvents } from "@ppb/tbd-components-rich-data/components/IncidentsCard/viewmodel/events";
import { getIncidentsCard } from "./IncidentsCard.graphql";

export async function incidentsCardShowMoreClickTrackingResolver(
  payload: IncidentsCardEvents["@@UI/INCIDENTS_CARD_SHOW_MORE_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const cardData = await getIncidentsCard(payload.cardUrn);

  if (!cardData || !cardData.fixture) {
    return;
  }

  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);
  const event = buildInterfaceEvent({
    action: payload.showMore ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: payload.showMore ? "Show More" : "Show Less",
    module: `${pageType} - scoreboard - null - ${cardData.fixture.sportevent.competition?.name} - ${cardData.fixture.sportevent.name} - in-play`,
  });

  sendEvent(event);
}
