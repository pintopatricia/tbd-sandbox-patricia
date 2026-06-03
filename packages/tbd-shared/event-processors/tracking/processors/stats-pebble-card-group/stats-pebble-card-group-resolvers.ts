import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { buildInterfaceEvent } from "tagging-library";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStore } from "@ppb/tbd-store/create-store";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { i18n } from "../../../../helpers/i18n";
import { StatsPebbleCardGroupEvents } from "../../../../components/StatsPebbleCardGroup/viewmodel/events";
import { getStatsPebbleCardGroup } from "./StatsPebbleCardGroup.graphql";
import { TranslationKey } from "../../../../translations/keys";

type ParamsType = {
  verticalPosition?: number | undefined;
  horizontalPosition?: number | undefined;
  tabName?: string | undefined;
  cardGroupTitle?: string;
  pebbleCardGroupTitle?: string | undefined;
  viewTitle?: string | undefined;
  marketTitle?: string;
  status: string | null;
  pageType: string | null;
  eventName?: string;
  competitionName?: string;
  pebbleName?: string;
};

async function getCouponStatsTrackingParams(payload: { urn: string; pebbleId?: string }): Promise<ParamsType | null> {
  const card = await getStatsPebbleCardGroup(payload.urn);

  if (!card) {
    return null;
  }

  let pebbleName;
  if (payload.pebbleId) {
    const pebbleDisplayName = card.items.edges.find((item) => item?.node.urn === payload.pebbleId)?.displayName;

    pebbleName =
      pebbleDisplayName && typeof pebbleDisplayName === "object" && "translationKey" in pebbleDisplayName
        ? i18n({ key: pebbleDisplayName.translationKey as unknown as keyof TranslationKey })
        : "";
  }

  // We need this here because the viewTitle is always undefined in the layout-snapshot
  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const metadata = getLayoutMetadata(payload.urn);

  return {
    status: card.status,
    pageType,
    eventName: card.sportEvent?.name,
    competitionName: card.sportEvent?.competition?.name,
    ...metadata,
    pebbleName,
  };
}

export async function statsPebbleClickTrackingResolver(
  payload: StatsPebbleCardGroupEvents["@@UI/PEBBLE_STATS_CLICK"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.urn) {
    return;
  }

  const params = await getCouponStatsTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `stats - ${params.pebbleName}`,
    module: `${params.pageType} - ${params.cardGroupTitle} - ${params.marketTitle} - ${params.competitionName} - ${params.eventName} - ${params.status}`,
  });

  sendEvent(event);
}
