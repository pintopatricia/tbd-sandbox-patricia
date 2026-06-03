import { ApplicationState } from "@ppb/tbd-store";
import { getLayoutMetadata, Metadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getPenaltyTakersCard } from "./PenaltyTakersCard.graphql";
import { getStore } from "@ppb/tbd-store/create-store";
import { PenaltyTakersCardEvents } from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/viewmodel/events";
import { buildInterfaceEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { PenaltyTakersCardTrackingParamsFragment } from "../../../../types/__generated__/graphql";

type ParamsType = {
  tabName?: string;
  currencyCode?: string | null;
  eventName: string;
  players: PenaltyTakersCardTrackingParamsFragment["penaltyTakers"];
  state: ApplicationState;
} & Metadata;

async function getPenaltyTakersCardTrackingParams(payload: { cardUrn: string }): Promise<ParamsType | null> {
  const card = await getPenaltyTakersCard(payload.cardUrn);

  if (!card) {
    return null;
  }

  const state = getStore().getState();

  const metadata = getLayoutMetadata(payload.cardUrn);

  return {
    ...metadata,
    players: card.penaltyTakers,
    eventName: card.event.name,
    state,
  };
}

export async function penaltyTakersCardVisibilityTrackingResolver(
  payload: PenaltyTakersCardEvents["@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn || !payload.visible) {
    return;
  }

  const params = await getPenaltyTakersCardTrackingParams({ cardUrn: payload.cardUrn });

  if (!params) {
    return;
  }

  const cardVisibilityEvent = buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: "penalty pusher",
    eventContext: params.eventName,
    module: `event - ${params.tabName} - penalty takers`,
    gameFilter: "null",
    swimlaneType: "null",
  });

  sendEvent(cardVisibilityEvent);

  const playerCountEvent = buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: `players displayed - ${params.players.length}`,
    module: `event - ${params.tabName} - penalty takers`,
    eventContext: params.eventName,
    gameFilter: "null",
    swimlaneType: "null",
  });

  sendEvent(playerCountEvent);
}

export async function penaltyTakersCardPlayerSwipeTrackingResolver(
  payload: PenaltyTakersCardEvents["@@UI/PENALTY_TAKERS_CARD_SLIDE_CHANGE"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn || !payload.playerId) {
    return;
  }

  const params = await getPenaltyTakersCardTrackingParams({ cardUrn: payload.cardUrn });

  if (!params) {
    return;
  }

  const playerSwipeEvent = buildInterfaceEvent({
    action: "swiped",
    elementText: "select a player",
    eventContext: params.eventName,
    module: `event - ${params.tabName} - penalty takers`,
    gameFilter: "null",
    swimlaneType: "null",
  });

  sendEvent(playerSwipeEvent);

  const player = params.players.find((player) => player.player.player?.id === payload.playerId);

  if (!player?.player.player?.name) {
    return;
  }

  const playerSelectEvent = buildInterfaceEvent({
    action: TaggingAction.SELECTED,
    elementText: `select a player - ${player.player.player?.name}`,
    eventContext: params.eventName,
    module: `event - ${params.tabName} - penalty takers`,
    gameFilter: "null",
    swimlaneType: "null",
  });

  sendEvent(playerSelectEvent);
}

export async function penaltyTakersCardSegmentChangeTrackingResolver(
  payload: PenaltyTakersCardEvents["@@UI/PENALTY_TAKERS_CARD_SEGMENT_CHANGE"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getPenaltyTakersCardTrackingParams({ cardUrn: payload.cardUrn });

  if (!params) {
    return;
  }

  const segmentChangeEvent = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `score miss tabs - ${payload.selectedSegment === "TO_SCORE" ? "to score" : "to miss"}`,
    eventContext: params.eventName,
    module: `event - ${params.tabName} - penalty takers`,
    gameFilter: "null",
    swimlaneType: "null",
  });

  sendEvent(segmentChangeEvent);
}
