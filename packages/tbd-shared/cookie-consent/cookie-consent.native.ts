/* global __DEV__ */
import { useEffect } from "react";
import { firebase } from "@react-native-firebase/analytics";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { IDynamicallyAddedModule, IModuleStore } from "redux-dynamic-modules";
import { getTaggingModule } from "@ppb/tbd-store/modules/tagging-module";
import { getCriticalTaggingModule, GtmConfig } from "@ppb/tbd-store/modules/critical-tagging-module";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { COOKIE_CONSENT__CATEGORIES_CHANGED } from "@ppb/tbd-store/actions/cookie-consent";
import { DeviceEventEmitter, Platform } from "react-native";
import { useAnalyticsTracking, AnalyticsTrackingState } from "@flutter-global/react-native-cet-framework";

import { isCurrentEnv } from "../config/base-path-utils.native";
import { Environment } from "../config/environments.native";
import appConfiguration from "../config/app-configuration.native";
import { gtmConfig } from "../setup/store.native";

let gtmModule: IDynamicallyAddedModule;

let initializedOneTrust = false;

// OneTrust cookies categories
// In this project we find the source of truth for cookie consent related stuff:
// https://gitlab.app.betfair/cookie-consent-management/cookie-consent-js/-/blob/master/src/constants/categories.ts.
export const CATEGORIES = {
  /**
   * Strictly necessary cookies and localStorage
   */
  STRICTLY_NECESSARY: "C0001",

  /**
   * Performance cookies and localStorage
   */
  PERFORMANCE: "C0002",

  /**
   * Functionality cookies and localStorage
   */
  FUNCTIONALITY: "C0003",

  /**
   * Marketing, Targeting and 3rd Party cookies and localStorage
   */
  MARKETING_TARGETING_3RD_PARTY: "C0004",
};

export async function handleConsentChange(
  store: IModuleStore<ApplicationState>,
  gtmConfig: GtmConfig,
  analyticsTrackingEnableState: AnalyticsTrackingState,
  setAnalyticsTrackingEnableState: (state: AnalyticsTrackingState) => void,
  performanceConsentStatus?: number,
): Promise<void> {
  /**
   * 1 = Consent Given
   * 0 = Consent Not Given
   * -1 = Consent hasn't been collected
   */
  const performanceCookiesStatus =
    performanceConsentStatus !== undefined
      ? performanceConsentStatus
      : await OTPublishersNativeSDK.getConsentStatusForCategory(CATEGORIES.PERFORMANCE);

  if (performanceCookiesStatus === 0) {
    firebase.analytics().setAnalyticsCollectionEnabled(false);

    if (gtmModule) {
      gtmModule.remove();
    }

    if (analyticsTrackingEnableState !== "disabled") {
      setAnalyticsTrackingEnableState("disabled");
    }
  }

  if (performanceCookiesStatus === 1) {
    firebase.analytics().setAnalyticsCollectionEnabled(true);
    store.addModule(getCriticalTaggingModule(gtmConfig));
    gtmModule = store.addModule(getTaggingModule(gtmConfig));

    if (analyticsTrackingEnableState !== "enabled") {
      setAnalyticsTrackingEnableState("enabled");
    }
  }
}

export const showPreferenceCenter = (): void => {
  OTPublishersNativeSDK.showPreferenceCenterUI({
    enableDarkMode: "false",
  });
};

const getActiveConsentCategories = async (): Promise<string[]> => {
  const categories: string[] = [];
  for (const [, categoryId] of Object.entries(CATEGORIES)) {
    const status = await OTPublishersNativeSDK.getConsentStatusForCategory(categoryId);
    if (status === 1) {
      categories.push(categoryId);
    }
  }
  return categories;
};

const syncConsentCategoriesToRedux = async (store: IModuleStore<ApplicationState>): Promise<void> => {
  const activeCategories = await getActiveConsentCategories();
  store.dispatch({
    type: COOKIE_CONSENT__CATEGORIES_CHANGED,
    payload: activeCategories,
  });
};

export const startOneTrustSDK = async (oneTrustKey: string, localeCode = "en-GB"): Promise<void> => {
  OTPublishersNativeSDK.startSDK("cdn-ukwest.onetrust.com", oneTrustKey, localeCode, {}, true).catch((error) => {
    console.error(`OneTrust download failed with error ${error}`);
  });
};

export const setupOneTrust = async (
  oneTrustKey: string,
  onConsentChange: (performanceConsentStatus: number) => void,
  store: IModuleStore<ApplicationState>,
  localeCode = "en-GB",
): Promise<void> => {
  startOneTrustSDK(oneTrustKey, localeCode);

  OTPublishersNativeSDK.setBroadcastAllowedValues([CATEGORIES.PERFORMANCE, CATEGORIES.MARKETING_TARGETING_3RD_PARTY]);

  // listen for changes in performance cookies acceptance
  OTPublishersNativeSDK.listenForConsentChanges(CATEGORIES.PERFORMANCE, (_, performanceConsentStatus) => {
    // remove/add GTM
    onConsentChange(performanceConsentStatus);
  });

  // listen for changes in marketing cookies acceptance
  OTPublishersNativeSDK.listenForConsentChanges(CATEGORIES.PERFORMANCE, () => {
    syncConsentCategoriesToRedux(store);
  });
};

export const updateOneTrustJavascriptWithinCET = async () => {
  DeviceEventEmitter.emit("UpdateOneTrustJavascriptWithinCET");
};

/*
  Used to check `OTPublishersNativeSDK` to see if we should show the cookie consent banner to the user. Since we use
  automatic bannering as part of the `OTPublishersNativeSDK` there is currently sometimes cases when the banner tries to show
  and it gets blocked. This method can be used to attempt to re-show the consent bannering.

  This is currently used in `NotificationsInitialPrompt` for SBG as on iOS there's a problem that consent does not show on a re-install
  as it's blocked by the notifications prompt.
*/
export const showCookieConsentBannerAfterDelay = (delayMs = 100) => {
  setTimeout(async () => {
    const shouldShow = await OTPublishersNativeSDK.shouldShowBanner();
    if (shouldShow) {
      OTPublishersNativeSDK.showBannerUI({});
    }
  }, delayMs);
};

const getOneTrustKey = (): string => {
  const OS = Platform.OS as "android" | "ios";
  const releaseMode = appConfiguration.appConfig?.TBDN_RELEASE_MODE;
  const oneTrustKeys = appConfiguration.appConfig?.ONE_TRUST_KEYS;

  const ONE_TRUST_KEY_IOS = __DEV__ || releaseMode === "internal" ? oneTrustKeys?.ios.dev : oneTrustKeys?.ios.prod;
  const ONE_TRUST_KEY_ANDROID =
    __DEV__ || releaseMode === "internal" ? oneTrustKeys?.android.dev : oneTrustKeys?.android.prod;

  const ONE_TRUST_KEY = OS === "android" ? ONE_TRUST_KEY_ANDROID : ONE_TRUST_KEY_IOS;

  return ONE_TRUST_KEY || "";
};

export const initOneTrust = async (
  store: IModuleStore<ApplicationState>,
  analyticsTrackingEnableState: AnalyticsTrackingState,
  setAnalyticsTrackingEnableState: (state: AnalyticsTrackingState) => void,
): Promise<void> => {
  const localeCode = store.getState().entities?.userdetails?.localeCode;

  if (!isCurrentEnv(Environment.mockserver)) {
    setupOneTrust(
      getOneTrustKey(),
      (performanceConsentStatus) =>
        handleConsentChange(
          store,
          gtmConfig,
          analyticsTrackingEnableState,
          setAnalyticsTrackingEnableState,
          performanceConsentStatus,
        ),
      store,
      localeCode,
    );
  }

  handleConsentChange(store, gtmConfig, analyticsTrackingEnableState, setAnalyticsTrackingEnableState);
  syncConsentCategoriesToRedux(store);
};

/**
 * Hook that initializes OneTrust and makes sure that it's only initialized once.
 *
 * @param store - The Redux store.
 */
export const useOneTrust = (store: IModuleStore<ApplicationState>): void => {
  const { analyticsTrackingEnableState, setAnalyticsTrackingEnableState } = useAnalyticsTracking();

  useEffect(() => {
    if (initializedOneTrust) {
      return;
    }

    initializedOneTrust = true;

    initOneTrust(store, analyticsTrackingEnableState, setAnalyticsTrackingEnableState);
  }, [store, analyticsTrackingEnableState, setAnalyticsTrackingEnableState]);
};

export const reinitOneTrust = async (localeCode = "en-GB"): Promise<void> => {
  if (!isCurrentEnv(Environment.mockserver)) {
    startOneTrustSDK(getOneTrustKey(), localeCode);
  }
};
