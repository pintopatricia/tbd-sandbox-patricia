import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { buildInterfaceEvent, InterfaceEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { StatsContentCardGroupEvents } from "../../../../components/StatsContentCardGroup/viewmodel/events";
import { getStatsContentCardGroup } from "./StatsContentCardGroup.graphql";

export async function statsContentCardGroupTabClickTrackingResolver(
  payload: StatsContentCardGroupEvents["@@UI/STATS_TAB_CLICK"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  if (!payload.urn || !payload.itemUrn) {
    return;
  }

  const cardData = await getStatsContentCardGroup(payload.urn);

  if (!cardData) {
    return;
  }

  const metadata = getLayoutMetadata(payload.itemUrn, payload.urn);
  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const event = buildInterfaceEvent({
    action: payload.isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: `stats - ${metadata.tabName}`,
    module: `${pageType} - null - null - ${cardData.sportEvent.competition?.name} - ${cardData.sportEvent.name} - ${cardData.status}`,
  });

  sendEvent(event);
}
