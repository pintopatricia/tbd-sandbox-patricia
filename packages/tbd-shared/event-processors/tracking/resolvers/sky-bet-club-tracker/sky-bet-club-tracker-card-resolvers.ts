import { buildNavigationEvent, NavigationEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { SkyBetClubTrackerCardEvents } from "../../../../components/SkyBetClubTrackerCard/viewmodel/events";

export function skyBetClubTrackerHomepageLinkTrackingResolver(
  payload: SkyBetClubTrackerCardEvents["@@UI/SKY_BET_CLUB_TRACKER_HOMEPAGE_LINK_TAP"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: payload.destinationUrl,
    elementText: "loyalty club tracker",
    module: "betslip",
    position: "",
    moduleDisplayOrder: "",
  });

  sendEvent(event);
}
