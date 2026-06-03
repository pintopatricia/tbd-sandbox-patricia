import { Middleware, StoreEnhancer, compose } from "redux";
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getSagaExtension, ISagaModule } from "redux-dynamic-modules-saga";
import { SagaIterator } from "redux-saga";
import { ApplicationState } from "./state/ApplicationState.types";
import { PlatformType } from "./middlewares/tagging-resolvers/AnalyticsConstants";
import { AssetsConfig } from "./state/initial-state/Environment.types";
import { setApplicationKey } from "./config/application-key";
import { createRootSaga } from "./middlewares/root-saga";
import tbdApp from "./state/application-state-reducer";
import { i18nextMiddleware } from "./middlewares/i18next";
import { GtmConfig } from "./modules/critical-tagging-module";
import { OutboundMessageMap } from "./middlewares/messaging-hub-saga";
import { raceResultsCardUpdatesMiddleware } from "./middlewares/race-results-updates-middleware";
import { richContentMiddleware } from "./middlewares/rich-content-live-updates-middleware";
import { sportsbookMarketPricesMiddleware } from "./middlewares/sportsbook-market-prices-updates-middleware";
import { bettingOpportunityPricesMiddleware } from "./middlewares/betting-opportunity-prices-updates-middleware";
import { winLoseVoidUpdatesMiddleware } from "./middlewares/win-lose-void-state-middleware";
import { betMutationEligibilityMiddleware } from "./middlewares/bet-mutation-eligibility-middleware";
import { getInteractivelyLoadModule } from "./modules/interactively-load-module";
import { setupAssets } from "./config/assets-config";
import rateMyAppReducer from "./state/rating/rate-my-app-reducer";
import { StorageModule } from "./modules/StorageModule.types";
import { getCommandsModule } from "./modules/commands-module";
import { StorageState } from "./helpers/storage";
import { PayoutLimits, productConfiguration } from "./config";
import { otelMiddleware } from "./middlewares/otel-middleware";
import { obbCardsMiddleware } from "./middlewares/obb-cards";
import { fixedOddsCashoutQuotesUpdatesMiddleware } from "./middlewares/fixed-odds-cashout-quotes-middleware";

let store: IModuleStore<ApplicationState> | null = null;

export type PayoutsConfig = { limits: PayoutLimits };

export type CreateStoreOptions<M extends StorageModule<S>, S extends StorageState> = {
  /** The initial state of the store */
  preloadedState?: any;
  middlewares?: Middleware[];
  sagas?: (() => SagaIterator<any>)[];
  compose?: typeof compose;
  gtm: GtmConfig;
  messaging: OutboundMessageMap;
  payouts: PayoutsConfig;
  overrideUserAgent?: string;
  seoLoad?: boolean;
  storage?: StorageModule<S extends StorageState ? S : M>;
  enhancers?: StoreEnhancer[];
};

/**
 * Create a store with all reducers and the basic middlewares for the TBD business logic.
 */
export default function buildStore<M extends StorageModule<S>, S extends StorageState>(
  assetsConfig: AssetsConfig,
  applicationKey: string,
  options?: CreateStoreOptions<M, S>,
): IModuleStore<ApplicationState> {
  if (!applicationKey) {
    throw new Error("Please provide a valid application key");
  }

  if (!options) {
    throw new Error("Store creation: Options not provided");
  }

  const asyncErrorCatchMiddleware: Middleware = () => (next) => (action) => {
    const result = next(action);
    if (result && typeof result.then === "function") {
      (result as Promise<unknown>).catch((err: unknown) => {
        console.error(`[middleware] Unhandled async error processing "${(action as { type: string }).type}":`, err);
      });
    }
    return result;
  };

  const MIDDLEWARES = [
    asyncErrorCatchMiddleware,
    otelMiddleware,
    i18nextMiddleware,
    richContentMiddleware,
    sportsbookMarketPricesMiddleware,
    bettingOpportunityPricesMiddleware,
    raceResultsCardUpdatesMiddleware,
    winLoseVoidUpdatesMiddleware,
    betMutationEligibilityMiddleware,
    obbCardsMiddleware,
    fixedOddsCashoutQuotesUpdatesMiddleware,
  ];

  if (options.middlewares) {
    MIDDLEWARES.push(...options.middlewares);
  }

  setApplicationKey(applicationKey);

  // Setup assets
  setupAssets(assetsConfig);

  productConfiguration.setPayoutLimits(options.payouts.limits);

  // Create Redux store with initial state
  const preloadedState = options.preloadedState || {};
  const isNative = options.gtm.platformType === PlatformType.Native;

  const getCriticalModule = (): ISagaModule<ApplicationState> => {
    const reducerMap: any = isNative ? { ...tbdApp, rating: rateMyAppReducer } : tbdApp;

    return {
      id: "critical-module",
      reducerMap,
      middlewares: MIDDLEWARES,
      sagas: [createRootSaga(options.messaging, options.sagas)],
    };
  };

  store = createStore(
    {
      initialState: preloadedState,
      advancedComposeEnhancers: options.compose,
      extensions: [getSagaExtension({})],
      enhancers: options.enhancers,
    },
    getCriticalModule(),
  );

  if (options.seoLoad) {
    import(/* webpackChunkName: "seo-middleware" */ "./modules/incremental-load-module").then(
      ({ getIncrementalLoadModule }) => {
        if (store) store.addModule(getIncrementalLoadModule());
      },
    );
  } else {
    store.addModule(getInteractivelyLoadModule());
  }

  if (isNative) {
    store.addModule(getCommandsModule());
  }

  return store;
}

export function getStore() {
  if (!store) {
    throw new Error("Redux store is not initialized");
  }
  return store;
}
