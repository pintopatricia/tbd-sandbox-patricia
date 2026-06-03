import { Action, Dispatch, Middleware } from "redux";
import { IDynamicallyAddedModule, IModuleStore } from "redux-dynamic-modules";
import {
  FetchAppContextAuthFailureAction,
  FetchAppContextFailureAction,
  FetchAppContextSuccessAction,
  FetchAppContextTerritoryBlockingAction,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
} from "@ppb/tbd-store/actions/app-context";
import { setupAssets } from "@ppb/tbd-store/config/assets-config";
import { setupRefreshIntervals } from "@ppb/tbd-store/config/intervals";
import { REFRESH, RefreshAction } from "@ppb/tbd-store/actions/router";
import { appsFlyerTacker } from "@flutter-global/react-native-cet-framework";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getWalletModule } from "@ppb/tbd-store/modules/wallet-module";
import { getSportsbookBettingModule } from "@ppb/tbd-store/modules/sbk-betting-module";
import { getExchangeBettingModule } from "@ppb/tbd-store/modules/exc-betting-module";
import { getWebMessagesRequestModule } from "@ppb/tbd-store/modules/web-messages-request-module";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { DeviceEventEmitter } from "react-native";
import {
  BettingSportsbookClearAction,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__OBB_CLEAR_ACTION,
  BettingObbClearAction,
} from "@ppb/tbd-store/actions/betting";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { FetchAppVersionSuccessAction, NETWORK__FETCH_APP_VERSION_SUCCESS } from "@ppb/tbd-store/actions/app-version";
import { NETWORK__PLACE_SBK_BET_SUCCESS, PlaceSportsbookBetSuccessAction } from "@ppb/tbd-store/actions/betslip";
import { setHapticsEnabled } from "@ppb/the-wall-native/api/haptics";
import {
  buildEndpoints,
  setAdobeSdkConfig,
  setBetslipConfig,
  setEndpointsConfig,
  setEnv,
  setExternalLinks,
  setHomepagePaths,
  setHost,
  setLoopClientConfig,
  setProdIdConfig,
} from "../../config/endpoints";
import { getBasePath, getCatalogueDefaultPath, getCurrentEnv } from "../../config/base-path-utils.native";
import { buildApolloClient, resetApolloCacheWithAppContext } from "../../apollo-client/client";
import registerEventProcessors from "../../event-processors/registry.native";
import { gtmConfig } from "../../setup/store.native";
import appConfiguration from "../../config/app-configuration.native";

import Storage from "../storage.native";
import { AppUpdate } from "../app-update/suggest-and-force-update.native";
import { AppUpdateStatus } from "../app-update/update-helper.native";
import { checkAndDownloadOtaUpdate } from "../ota-updates/ota-updates.native";
import { reinitOneTrust } from "../../cookie-consent/cookie-consent.native";
import { Environment } from "../../config/environments.native";
import { apolloCacheWarmUp } from "../../apollo-client/cache-warmup";
import { getCookie } from "../cookies.native";
import { AppContextData } from "@ppb/tbd-store/clients/app-context/app-context-client";
import { getOtelCustomAttributes, getOtelNetworkAttributes } from "../otel.native";
import { SplunkRum } from "@splunk/otel-react-native";

export type CetFrameworkSetup = (jurisdiction: string, country: string, authData: AuthData) => Promise<void>;
export type O11ySetup = (initialState: AppContextData["initialState"]["entities"]) => void;
export type StoreResolver = (store: IModuleStore<ApplicationState>) => void;

let walletModule: IDynamicallyAddedModule;

type Actions =
  | FetchAppContextSuccessAction
  | FetchAppContextAuthFailureAction
  | FetchAppContextFailureAction
  | FetchAppContextTerritoryBlockingAction
  | FetchAppVersionSuccessAction
  | PlaceSportsbookBetSuccessAction;

const getCatalogueFallbackEndpoint = () => `${getBasePath()}${getCatalogueDefaultPath()}`;

export const createAppContextMiddleware =
  (
    // this is redux-dynamic-modules store object
    store: IModuleStore<ApplicationState>,
    appKey: string,
    userAgent: string,
    initialCetFrameworkSetup: CetFrameworkSetup,
    onReady: () => void,
  ): Middleware =>
  ({ dispatch, getState }) =>
  (next: Dispatch<Action>) =>
  async (action: Actions) => {
    if (action.type === NETWORK__FETCH_APP_VERSION_SUCCESS) {
      AppUpdate.checkAppUpdate(action.payload);

      if (AppUpdate.appUpdateStatus !== AppUpdateStatus.Hidden) {
        AppUpdate.displaySuggestOrForceUpdate();

        if (
          AppUpdate.appUpdateStatus === AppUpdateStatus.Force ||
          AppUpdate.appUpdateStatus === AppUpdateStatus.Unsupported
        ) {
          next(action);

          return;
        }
      }
    }

    if (action.type === NETWORK__FETCH_APP_CONTEXT_SUCCESS) {
      const basePath = getBasePath();
      const {
        environment: {
          ENV,
          REFRESH_RATES,
          ENDPOINTS,
          ADOBE_SDK,
          ASSETS,
          AUTH_DATA,
          HOST,
          HOMEPAGE_PATHS,
          BASE_PATH,
          EXTERNAL_LINKS,
          BETSLIP_CONFIG,
          LOOP_CLIENT_CONFIG,
        },
        initialState: {
          entities: { userdetails, appversion, productId, throttles },
        },
      } = action.payload;

      // Enable haptics globally if HAPTIC_FEEDBACK throttle is active
      const hapticFeedbackThrottle = throttles?.HAPTIC_FEEDBACK;
      if (hapticFeedbackThrottle) {
        setHapticsEnabled(hapticFeedbackThrottle.isActive);
      }

      SplunkRum.instance.globalAttributes.setAll(getOtelCustomAttributes(action.payload.initialState.entities));

      getOtelNetworkAttributes().then((networkAttributes) => {
        SplunkRum.instance.globalAttributes.setAll(networkAttributes);
      });

      if (!productId) {
        throw new Error("Missing PRODUCT_ID in NETWORK__FETCH_APP_CONTEXT_SUCCESS payload");
      }

      const currentState = getState();

      AppUpdate.checkAppUpdate(appversion, userdetails);
      if (AppUpdate.appUpdateStatus !== AppUpdateStatus.Hidden) {
        AppUpdate.displaySuggestOrForceUpdate();

        if (
          AppUpdate.appUpdateStatus === AppUpdateStatus.Force ||
          AppUpdate.appUpdateStatus === AppUpdateStatus.Unsupported
        ) {
          return;
        }
      }

      try {
        const baseURL = new URL(BASE_PATH, `https://${HOST}`).toString();
        const endpoints = buildEndpoints(ENDPOINTS, basePath, appConfiguration.appConfig?.TBDN_CATALOGUE_VERSION);
        const batching = getCurrentEnv() !== Environment.mockserver;

        setEndpointsConfig({
          endpoints,
          basePath,
          applicationKey: appKey,
          authURLs: AUTH_DATA,
          overrideUserAgent: userAgent,
          overrideReferer: baseURL,
          cbsChannel: ENDPOINTS?.CBS?.channel,
          authorizationToken: (await getCookie("ssoid")) ?? undefined,
        });

        buildApolloClient({ state: currentState, catalogueEndpoint: endpoints.CATALOGUE, appKey, batching });
        setBetslipConfig(BETSLIP_CONFIG);
        setProdIdConfig(productId);
        setLoopClientConfig(LOOP_CLIENT_CONFIG);
        setEnv(ENV);
        setupAssets(ASSETS, baseURL);
        setHost(HOST);
        setHomepagePaths(HOMEPAGE_PATHS ?? null);

        if (EXTERNAL_LINKS) {
          setExternalLinks(EXTERNAL_LINKS);
        }

        // register Event Processors for cross-cutting concerns like Tracking, SEO, Nagitation, etc
        registerEventProcessors();
      } catch {
        console.error(`"Unable to set HTTP Endpoints. Invalid base URL (host: '${HOST}, base: '${BASE_PATH}')`);
      }

      setAdobeSdkConfig(ADOBE_SDK);
      if (REFRESH_RATES) {
        setupRefreshIntervals(REFRESH_RATES);
      }

      const isJurisdictionAvailable = !!(currentState.entities.userdetails as UserDetails).jurisdiction;

      // let user-details reducer save data before anything else, so that the application state already
      // has the details loaded for `fetchUserWalletsSaga` when initializing`getWalletModule` module
      next(action);

      // Check and fail silently for bundle, do not impede app start
      // Error handling and telemetry is internally handled
      void checkAndDownloadOtaUpdate(getState().entities.throttles);

      // ensure the code below executes once until a jurisdiction is available in the application state;
      // once app context is fetched for the first time, a jurisdiction will not be present with the user
      // state, and the code below will therefore execute. For subsequent fetches, a jurisdiction will
      // already be present in the application state and protect the block below from running twice.
      if (!isJurisdictionAvailable) {
        await initialCetFrameworkSetup(
          appConfiguration.defaultJurisdiction || userdetails.jurisdiction.jurisdiction.toLowerCase(),
          userdetails.countryCode,
          AUTH_DATA,
        );

        // this can't be done twice
        store.addModule(getSportsbookBettingModule(Storage));
        store.addModule(getExchangeBettingModule());
        store.addModule(getWebMessagesRequestModule());
      }

      const isLoggingOut = currentState.entities.userdetails.loggedIn && userdetails.loggedIn === false;

      if (isLoggingOut) {
        dispatch<BettingSportsbookClearAction>({
          type: BETTING__SBK_CLEAR_ACTION,
        });
        dispatch<BettingObbClearAction>({
          type: BETTING__OBB_CLEAR_ACTION,
        });
      }

      if (userdetails.loggedIn) {
        walletModule?.remove();
        walletModule = store.addModule(getWalletModule());
      }

      // ensure that the OneTrust language is replaced when user change it in the account settings
      // even after app context is fetched for the first time and jurisdiction is set, with that
      // we will have all the screens related to OneTrust translated without closing the app
      if (userdetails && isJurisdictionAvailable) {
        reinitOneTrust(userdetails.localeCode);
      }

      const urn = getState().router.currentUrn;

      if (urn) {
        // If a urn is defined in the router state, then delete the previous layout, and render
        // a fresh layout along with a bottom bar. Use cases:
        //
        // - App Launch (cold start)
        // - Background to foreground (warm start)
        // - User session update (Log (in/out))
        // - Language update
        //
        // Why do we use the REFRESH action instead of the PUSH action here?
        //
        // The catalogue saga uses a top-level variable `withBottomBar = true` that is reset as the first BFF
        // response arrives. The action of moving an app to the background may lead to unmounting the navigation
        // system which includes a tab navigator (Bottom Bar). For this reason, when restoring the app into the
        // foreground we are required to request a fresh Bottom Bar to the BFF. Because the top-level variable
        // `withBottomBar = false` remains in memory by this point, apps cannot render a bottom bar and display
        // the home screen when dispatching the PUSH action again. Since the REFRESH action does not rely on the
        // top-level variable `withBottomBar`, and it exposes `shouldRefreshBottomBar`, we can have more control
        // over refreshing the layout completely for the use cases above. Note that on app launch, the router
        // `currentUrn` default will be already set with the home URN; hence we do not need to update the router
        // state here via the PUSH action.
        dispatch<RefreshAction>({
          type: REFRESH,
          payload: {
            urn,
            shouldRefreshBottomBar: true,
          },
        });
      }

      apolloCacheWarmUp.loadAppContext(action.payload.queryResponse);

      // This MUST be called after the new AppContext is written into Apollo cache
      if (urn) {
        resetApolloCacheWithAppContext();
      }

      // Notify that app is ready to render something
      onReady();

      return;
    }

    if (action.type === NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE) {
      DeviceEventEmitter.emit(NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE);

      buildApolloClient({
        state: getState(),
        catalogueEndpoint: getCatalogueFallbackEndpoint(),
        appKey,
        batching: false,
      });

      // Notify that app is ready to render something
      onReady();
    }

    if (action.type === NETWORK__PLACE_SBK_BET_SUCCESS) {
      const { combinations, legs } = action.payload.report.result;
      const { entities } = store.getState();

      const { currencyCode, jurisdiction, accountId, countryCode } = entities.userdetails as UserDetails;
      const rfr = await gtmConfig.getCookie("rfr");

      const staticEventValues = {
        account_id: `${accountId}`,
        af_country: countryCode,
        af_sub1: rfr?.length ? rfr : undefined,
        jurisdiction: appConfiguration.defaultJurisdiction || jurisdiction.jurisdiction.toLowerCase(),
        product: "Native",
        af_currency: currencyCode,
      };

      Object.values(combinations).forEach((combination) => {
        const priceDisplayOdds = combination.displayOdds ?? legs[combination.legs[0]].displayOdds ?? undefined;

        const eventValues = {
          ...staticEventValues,
          price: priceDisplayOdds?.decimalOdds.toFixed(2) ?? undefined,
          bet_type: combination.betType,
          transaction_id: combination.betReceiptId,
          bet_id: combination.betId,
          af_revenue: combination.totalStake.toFixed(2),
        };

        // async log, but we don't need to wait for it to complete
        appsFlyerTacker.logEvent("placed_bet", eventValues);
      });
    }

    if (action.type === NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING) {
      buildApolloClient({
        state: getState(),
        catalogueEndpoint: getCatalogueFallbackEndpoint(),
        appKey,
        batching: false,
      });

      // Notify that app is ready to render something
      onReady();
    }

    if (action.type === NETWORK__FETCH_APP_CONTEXT_FAILURE) {
      buildApolloClient({
        state: getState(),
        catalogueEndpoint: getCatalogueFallbackEndpoint(),
        appKey,
        batching: false,
      });

      // Notify that app is ready to render something
      onReady();
    }

    next(action);
  };
