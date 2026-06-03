import { buildInterfaceEvent } from "tagging-library";
import { PopularSelectionsEvents } from "@ppb/tbd-components-sports-betting/components/PopularSelections/viewmodel/events";
import { PopularSelectionsPromoBannerEvents } from "@ppb/tbd-components-sports-betting/components/PopularSelectionsPromoBanner/viewmodel/events";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getStore } from "@ppb/tbd-store/create-store";
import { getSportsbookRunnerMetrics } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { getSportEventByURN } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";

const getViewTypeSelector = createViewTypeSelector();
const getViewByURN = createFindViewByURNSelector();

function getCurrentEventContext() {
  const state = getStore().getState();
  const { currentUrn } = state.router;
  if (!currentUrn) return "null";

  const currentView = getViewByURN(state.layouts.views, currentUrn);
  if (currentView && "sportevent" in currentView) {
    const sportEvent = getSportEventByURN(state.entities.sportevents, currentView.sportevent);
    return sportEvent?.name ?? "null";
  }

  return "null";
}

function buildModule(
  pageType: string | null,
  viewZoneTitle: string | undefined,
  moduleName: string,
  market: string | null | undefined,
  tabName: string | undefined,
) {
  return `${pageType} - ${viewZoneTitle ?? "null"} - ${moduleName} - ${market ?? "null"} - ${tabName ?? "all markets"}`;
}

export function popularSelectionsPromoBannerTapTrackingResolver(
  payload: PopularSelectionsPromoBannerEvents["@@UI/POPULAR_SELECTIONS_PROMO_BANNER_TAP"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle, marketTitle } = getLayoutMetadata(payload.urn);
  const eventContext = getCurrentEventContext();

  const event = buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: "popular picks - try it",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular picks", marketTitle, tabName),
  });

  sendEvent(event);
}

export function popularSelectionsSwipeLeftTrackingResolver(
  payload: PopularSelectionsEvents["@@UI/POPULAR_SELECTIONS_SWIPE_LEFT"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle } = getLayoutMetadata(payload.cardUrn);

  const runnerMetrics = getSportsbookRunnerMetrics(state, payload.runnerUrn);
  const eventContext = runnerMetrics?.event_name ?? "null";

  const action = payload.trigger === "button" ? TaggingAction.CLICKED : TaggingAction.SWIPED_LEFT;

  const event = buildInterfaceEvent({
    action,
    elementText: "reject",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular selection modal", runnerMetrics?.market_name, tabName),
  });

  sendEvent(event);
}

export function popularSelectionsSwipeRightTrackingResolver(
  payload: PopularSelectionsEvents["@@UI/POPULAR_SELECTIONS_SWIPE_RIGHT"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle } = getLayoutMetadata(payload.cardUrn);

  const runnerMetrics = getSportsbookRunnerMetrics(state, payload.runnerUrn);
  const eventContext = runnerMetrics?.event_name ?? "null";

  const action = payload.trigger === "button" ? TaggingAction.CLICKED : TaggingAction.SWIPED_RIGHT;

  const interfaceEvent = buildInterfaceEvent({
    action,
    elementText: "accept",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular selection modal", runnerMetrics?.market_name, tabName),
  });

  sendEvent(interfaceEvent);
}

export function popularSelectionsModalClosedTrackingResolver(
  payload: PopularSelectionsEvents["@@UI/POPULAR_SELECTIONS_MODAL_CLOSED"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle, marketTitle } = getLayoutMetadata(payload.cardUrn);
  const eventContext = getCurrentEventContext();

  const event = buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "close icon",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular selection modal", marketTitle, tabName),
  });

  sendEvent(event);
}

export function popularSelectionsGoToBetslipTapTrackingResolver(
  payload: PopularSelectionsEvents["@@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle, marketTitle } = getLayoutMetadata(payload.cardUrn);
  const eventContext = getCurrentEventContext();

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "go to betslip",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular selection modal", marketTitle, tabName),
  });

  sendEvent(event);
}

export function popularSelectionsSkippedTrackingResolver(
  payload: PopularSelectionsEvents["@@UI/POPULAR_SELECTIONS_SKIPPED"],
  sendEvent: (payload: any) => void,
) {
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const { tabName, viewZoneTitle } = getLayoutMetadata(payload.cardUrn);

  const runnerMetrics = getSportsbookRunnerMetrics(state, payload.runnerUrn);
  const eventContext = runnerMetrics?.event_name ?? "null";

  const action = payload.trigger === "button" ? TaggingAction.CLICKED : TaggingAction.SWIPED_LEFT;

  const event = buildInterfaceEvent({
    action,
    elementText: "skip",
    eventContext,
    module: buildModule(pageType, viewZoneTitle, "popular selection modal", runnerMetrics?.market_name, tabName),
  });

  sendEvent(event);
}
