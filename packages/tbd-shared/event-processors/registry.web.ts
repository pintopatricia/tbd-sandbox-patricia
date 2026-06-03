import { getEventRegistry } from "eventemitter3-singleton";
import { TheBridgeSBKApi } from "@flutter-global/the-bridge";
import { sendEvent } from "../gtm/tagging-collector.web";

const { removeAllListeners } = getEventRegistry();

/**
 * Registers Event Processors that are external to the main Sports Bet Experience being offered by the app
 * Covers event processors for several cross-cutting concerns like:
 *  - SEO
 *  - Navigation
 *  - Tracking
 *  - etc
 */
export default function registerWebEventProcessors() {
  // Remove all listeners
  removeAllListeners();

  import(/* webpackChunkName: "tracking-event-processor" */ "./tracking/tracking-event-processor").then((module) => {
    const registerTrackingEventProcessor = module.default;

    registerTrackingEventProcessor(sendEvent);
  });

  import(/* webpackChunkName: "rich-content-event-processor" */ "./live-data/rich-content-event-processor").then(
    (module) => {
      const registerRichContentEventProcessor = module.default;

      registerRichContentEventProcessor();
    },
  );

  import(/* webpackChunkName: "navigation-event-processor" */ "./navigation/navigation-event-processor.web").then(
    (module) => {
      const registerNavigationEventProcessor = module.default;

      registerNavigationEventProcessor();
    },
  );

  import(/* webpackChunkName: "potential-bets-processor" */ "./betting/potential-bets-processor").then((module) => {
    const registerPotentialBetsProcessor = module.default;

    registerPotentialBetsProcessor();
  });

  import(
    /* webpackChunkName: "sportsbook-market-live-data" */ "./live-data/sportsbook-market-live-data-processor"
  ).then((module) => {
    const registerSportsbookMarketLiveDataProcessor = module.default;

    registerSportsbookMarketLiveDataProcessor();
  });

  import(/* webpackChunkName: "ui-processor" */ "./live-data/delete-view-items-processor").then((module) => {
    const registerDeleteViewItemsProcessor = module.default;

    registerDeleteViewItemsProcessor();
  });

  import(
    /* webpackChunkName: "betting-opportunity-live-data-processor" */ "./live-data/betting-opportunity-live-data-processor"
  ).then((module) => {
    const registerBettingOpportunityLiveDataProcessor = module.default;

    registerBettingOpportunityLiveDataProcessor();
  });

  import(/* webpackChunkName: "catalogue-event-processor" */ "./catalogue/catalogue-event-processor").then((module) => {
    const registerCatalogueEventProcessor = module.default;

    registerCatalogueEventProcessor();
  });

  import(/* webpackChunkName: "seo-event-processor" */ "./seo/seo-event-processor.web").then((module) => {
    const registerSeoEventProcessor = module.default;

    registerSeoEventProcessor();
  });
  import(/* webpackChunkName: "state-sync-processor" */ "./state-sync/state-sync-processor").then((module) => {
    const registerStateSyncProcessor = module.default;

    registerStateSyncProcessor();
  });

  if (TheBridgeSBKApi.getInstance()) {
    import(
      /* webpackChunkName: "the-bridge-event-processor" */ "./the-bridge-wrapper/the-bridge-event-processor.web"
    ).then((module) => {
      const registerTheBridgeEventProcessor = module.default;

      registerTheBridgeEventProcessor();
    });
  }
}
