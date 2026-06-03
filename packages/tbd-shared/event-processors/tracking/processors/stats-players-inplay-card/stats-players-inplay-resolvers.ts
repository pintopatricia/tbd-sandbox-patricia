import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { buildNavigationEvent, NavigationEvent, buildInterfaceEvent, InterfaceEvent } from "tagging-library";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStore } from "@ppb/tbd-store/create-store";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { StatsPlayersInPlayEvents } from "../../../../components/StatsPlayersInPlayCard/viewmodel/events";
import { getStatsPlayersInPlay } from "./StatsPlayersInplay.graphql";

type ParamsType = {
  verticalPosition?: number | undefined;
  horizontalPosition?: number | undefined;
  tabName?: string | undefined;
  cardGroupTitle?: string;
  pebbleCardGroupTitle?: string | undefined;
  viewTitle?: string | undefined;
  marketTitle?: string;
  pageType: string | null;
  eventName?: string;
  competitionName?: string;
};

async function getStatsPlayersInPlayTrackingParams(payload: { urn: string }): Promise<ParamsType | null> {
  const card = await getStatsPlayersInPlay(payload.urn);

  if (!card) {
    return null;
  }

  // We need this here because the viewTitle is always undefined in the layout-snapshot
  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const metadata = getLayoutMetadata(payload.urn);

  return {
    pageType,
    eventName: card.sportEvent?.name,
    competitionName: card.sportEvent?.competition?.name,
    ...metadata,
  };
}

export async function statsPlayersInplayPressTermsTrackingResolver(
  payload: StatsPlayersInPlayEvents["@@UI/STATS_PLAYERS_INPLAY_TERMS_TAP"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  if (!payload.urn) {
    return;
  }

  const params = await getStatsPlayersInPlayTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: payload.destinationUrl,
    elementText: "help & support page",
    module: `${params.pageType} - ${payload.title} - null - ${params.competitionName} - ${params.eventName} - in-play`,
    position: params.horizontalPosition?.toString() || "null",
    moduleDisplayOrder: params.verticalPosition?.toString() || "null",
  });

  sendEvent(event);
}

export async function statsPlayersInplayExpandableButtonTrackingResolver(
  payload: StatsPlayersInPlayEvents["@@UI/STATS_PLAYERS_INPLAY_EXPANDABLE_BUTTON_CLICK"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  if (!payload.urn) {
    return;
  }

  const params = await getStatsPlayersInPlayTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: payload.isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: `stats - ${payload.isOpen ? "show more" : "show less"}`,
    module: `${params.pageType} - null - null - ${params.competitionName} - ${params.eventName} - in-play`,
  });

  sendEvent(event);
}
