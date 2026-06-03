import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getLoadPrizeMachineEvent } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/game-interactions";
import {
  getLaunchPrizeMachineEvent,
  getTCPrizeMachineClickEvent,
} from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/navigation";
import {
  loadPrizeMachine,
  launchPrizeMachine,
  getTCPrizeMachineClickEvent as legacyGetTCPrizeMachineClickEvent,
} from "@ppb/tbd-store/middlewares/tagging-resolvers";
import { getGAThrottles, getGamingPrizeMachineCard } from "./GamingPrizeMachine.graphql";
import { GamingPrizeMachineCardEvents } from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/viewmodel/events";

function getGamingPrizeMachineTrackingParams(payload: { urn: string; viewUrl: string }) {
  const card = getGamingPrizeMachineCard(payload.urn);

  if (!card) {
    return null;
  }

  const metadata = getLayoutMetadata(card.urn);
  const jackpotState = card.jackpotState ? card.jackpotState.toLowerCase().replace("_", " ") : "regular";

  const hasJackpot = !!card.jackpotAmount;
  let isPlus = "";
  if (card.guaranteedPrize) {
    if (hasJackpot) {
      isPlus = " plus -";
    } else {
      isPlus = " plus";
    }
  }

  return {
    urn: card.urn,
    viewUrl: payload.viewUrl,
    verticalPosition: metadata.verticalPosition,
    hasJackpot,
    jackpotState,
    isPlus,
    guaranteedPrize: card.guaranteedPrize,
  };
}

export function prizeMachineCardLoadedTrackingResolver(
  payload: GamingPrizeMachineCardEvents["@@UI/PRIZE_MACHINE_CARD_LOADED"],
  sendEvent: (payload: any) => void,
) {
  const params = getGamingPrizeMachineTrackingParams(payload);
  const { UAEnabled, GA4Enabled } = getGAThrottles();

  if (!params) {
    return;
  }

  if (GA4Enabled) {
    const ga4Dimensions = getLoadPrizeMachineEvent({
      urn: params.urn,
      hasJackpot: params.hasJackpot,
      jackpotState: params.jackpotState,
      guaranteedPrize: params.guaranteedPrize,
    });

    sendEvent(ga4Dimensions);
  }

  if (UAEnabled) {
    const uaDimensions = loadPrizeMachine(
      params.viewUrl,
      params.verticalPosition,
      params.hasJackpot,
      params.jackpotState,
      params.isPlus,
    );
    sendEvent(uaDimensions);
  }
}

export function prizeMachinePlayBtnClickTrackingResolver(
  payload: GamingPrizeMachineCardEvents["@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const params = getGamingPrizeMachineTrackingParams(payload);
  const { UAEnabled, GA4Enabled } = getGAThrottles();

  if (!params) {
    return;
  }

  if (GA4Enabled) {
    const ga4Dimensions = getLaunchPrizeMachineEvent({
      urn: params.urn,
      viewLink: params.viewUrl,
      hasJackpot: params.hasJackpot,
      jackpotState: params.jackpotState,
      guaranteedPrize: params.guaranteedPrize,
    });

    sendEvent(ga4Dimensions);
  }

  if (UAEnabled) {
    const uaDimensions = launchPrizeMachine(
      params.viewUrl,
      params.verticalPosition,
      params.hasJackpot,
      params.jackpotState,
      params.isPlus,
    );
    sendEvent(uaDimensions);
  }
}

export function prizeMachineTCsLinkClickTrackingResolver(
  payload: GamingPrizeMachineCardEvents["@@UI/PRIZE_MACHINE_TCs_LINK_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const params = getGamingPrizeMachineTrackingParams(payload);
  const { UAEnabled, GA4Enabled } = getGAThrottles();

  if (!params) {
    return;
  }

  if (GA4Enabled) {
    const ga4Dimensions = getTCPrizeMachineClickEvent({
      urn: params.urn,
      viewLink: params.viewUrl,
    });

    sendEvent(ga4Dimensions);
  }

  if (UAEnabled) {
    const uaDimensions = legacyGetTCPrizeMachineClickEvent(params.viewUrl, params.verticalPosition);
    sendEvent(uaDimensions);
  }
}
