import { UpsellSuggestionsEvents } from "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/viewmodel/events";
import { Product, UserDetails } from "@ppb/tbd-store";
import { getSportsbookRunnerMetrics } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { BetDirection, TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import {
  AddedSelectionEvent,
  BetslipEvent,
  buildAddedSelectionEvent,
  buildBetslipEvent,
  buildInterfaceEvent,
  type InterfaceEvent,
} from "tagging-library";
import { getStore } from "@ppb/tbd-store/create-store";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getRunnerUniqueTaggingId } from "@ppb/tbd-store/helpers/betting";

const UPSELL_SUGGESTIONS_MODULE = "betslip - upsell";

export function upsellSuggestionsItemClickTrackingResolver(
  payload: UpsellSuggestionsEvents["@@UI/UPSELL_SUGGESTIONS_ITEM_CLICK"],
  sendEvent: (payload: AddedSelectionEvent | BetslipEvent) => void,
) {
  const state = getStore().getState();
  const { currencyCode } = getUserDetails(state) as UserDetails;
  const runnerMetrics = getSportsbookRunnerMetrics(state, payload.runnerUrn);

  if (!runnerMetrics) {
    return;
  }

  const uniqueId = getRunnerUniqueTaggingId(state, payload.runnerUrn);

  let event: AddedSelectionEvent | BetslipEvent;
  if (payload.isRemovingFromBetslip) {
    event = buildBetslipEvent({
      action: TaggingAction.REMOVED_SELECTION,
      betId: "null",
      selection: runnerMetrics.selection || "null",
      selectionId: runnerMetrics.selection_id.toString(),
      bettingProduct: Product.Sportsbook,
    });
  } else {
    event = buildAddedSelectionEvent({
      antepostFlag: runnerMetrics.antepost_flag,
      betDirection: BetDirection.Back,
      betIdentifier: uniqueId ?? "null",
      bettingProduct: Product.Sportsbook,
      competition: runnerMetrics.competition_name || "null",
      competitionId: runnerMetrics.competition_id?.toString() || "null",
      currency: currencyCode || "null",
      eventId: runnerMetrics.event_id.toString(),
      eventName: runnerMetrics.event_name,
      inPlayIndicator: runnerMetrics.in_play_indicator,
      market: runnerMetrics.market_name,
      marketId: runnerMetrics.market_id,
      module: UPSELL_SUGGESTIONS_MODULE,
      moduleDisplayOrder: "null",
      position: payload.position,
      priceAtSelection: runnerMetrics.price_at_selection?.toString() || "null",
      selection: runnerMetrics.selection,
      selectionId: runnerMetrics.selection_id.toString(),
      sport: runnerMetrics.sport_name || "null",
      sportId: runnerMetrics.sport_id?.toString() || "null",
    });
  }

  sendEvent(event);
}

export function upsellSuggestionsLoadedTrackingResolver(sendEvent: (payload: InterfaceEvent) => void) {
  const event = buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: "buildabet upsell",
    module: UPSELL_SUGGESTIONS_MODULE,
  });

  sendEvent(event);
}
