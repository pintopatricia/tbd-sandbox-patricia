import { getEventRegistry } from "eventemitter3-singleton";
import { sendEvent } from "../gtm/tagging-collector.native";
import registerTrackingEventProcessor from "./tracking/tracking-event-processor";
import registerRichContentEventProcessor from "./live-data/rich-content-event-processor";
import registerNavigationEventProcessor from "./navigation/navigation-event-processor.native";
import registerPotentialBetsProcessor from "./betting/potential-bets-processor";
import registerSportsbookMarketLiveDataProcessor from "./live-data/sportsbook-market-live-data-processor";
import registerDeleteViewItemsProcessor from "./live-data/delete-view-items-processor";
import registerBettingOpportunityLiveDataProcessor from "./live-data/betting-opportunity-live-data-processor";
import registerStateSyncProcessor from "./state-sync/state-sync-processor";
import registerCatalogueEventProcessor from "./catalogue/catalogue-event-processor";

const { removeAllListeners } = getEventRegistry();

/**
 * Registers Event Processors that are external to the main Sports Bet Experience being offered by the app
 * Covers event processors for several cross-cutting concerns like:
 *  - SEO
 *  - Navigation
 *  - Tracking
 *  - etc
 */
export default function registerNativeEventProcessors() {
  // Remove all listeners
  removeAllListeners();

  // Initialize event processors
  registerTrackingEventProcessor(sendEvent);
  registerRichContentEventProcessor();
  registerNavigationEventProcessor();
  registerPotentialBetsProcessor();
  registerSportsbookMarketLiveDataProcessor();
  registerDeleteViewItemsProcessor();
  registerBettingOpportunityLiveDataProcessor();
  registerStateSyncProcessor();
  registerCatalogueEventProcessor();
}
