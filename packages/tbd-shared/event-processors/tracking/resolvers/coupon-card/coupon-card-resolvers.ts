import { buildInterfaceEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStore } from "@ppb/tbd-store/create-store";
import { CouponEvents } from "../../../../components/Coupon/events";
import { getStatsPebbleCardGroup } from "../../processors/stats-pebble-card-group/StatsPebbleCardGroup.graphql";

async function getCouponStatsTrackingParams(payload: { statsPebbleUrn?: string }) {
  if (!payload.statsPebbleUrn) {
    return null;
  }

  const card = await getStatsPebbleCardGroup(payload.statsPebbleUrn);

  if (!card) {
    return null;
  }

  // We need this here because the viewTitle is not working in the layout-snapshot helper
  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const metadata = getLayoutMetadata(payload.statsPebbleUrn);

  return {
    status: card.status,
    pageType,
    eventName: card.sportEvent?.name,
    competitionName: card.sportEvent?.competition?.name,
    ...metadata,
  };
}

export async function couponStatsButtonClickTrackingResolver(
  payload: CouponEvents["@@UI/COUPON_STATS_BUTTON_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const params = await getCouponStatsTrackingParams(payload);

  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: payload.isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: "stats",
    module: `${params.pageType} - ${params.cardGroupTitle} - ${params.marketTitle} - ${params.competitionName} - ${params.eventName} - ${params.status}`,
  });

  sendEvent(event);
}
