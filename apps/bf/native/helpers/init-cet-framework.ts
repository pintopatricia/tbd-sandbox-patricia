import {
  CETEnvironment,
  CETEnvironmentMode,
  CETJurisdiction,
  cetMainConfiguration,
  CetMainConfigurationType,
} from "@flutter-global/react-native-cet-framework";
import { trace } from "@opentelemetry/api";
import { Appearance, Platform, NativeModules } from "react-native";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { EXTERNAL_AUTH_RETURN_PATH } from "@ppb/tbd-router";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { getProdIdConfig } from "@ppb/tbd-shared/config/endpoints";
import { resolveCETEnvironment } from "@ppb/tbd-shared/config/environments.native";
import { getCurrentEnv } from "@ppb/tbd-shared/config/base-path-utils.native";
import { getCustomUserAgentSuffix } from "@ppb/tbd-shared/helpers/user-agent.native";
import { isMetaDataEvent, sendEvent } from "@ppb/tbd-shared/gtm/tagging-collector.native";
import { getAnalyticsTrackingState } from "@ppb/tbd-shared/helpers/analytics-tracking-state.native";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { setCetInitialised } from "@ppb/tbd-shared/helpers/cet-init-state.native";
import appConfig from "../app.config.json";

/*
 * The universalAppLink should only be used for the Danish jurisdiction as it's being used by the CET Framework
 * as a query param (`returnAppUrl`) to redirect the user back to the app when the MitID validation finishes
 */
const UNIVERSAL_APP_LINK = `https://www.betfair.com/betting${EXTERNAL_AUTH_RETURN_PATH}`;

/**
 * Returns the TMX session ID used for profiling.
 */
const getTmxSessionId = async (brand: string): Promise<string | undefined> => {
  const isIOS = Platform.OS === "ios";
  const module = isIOS ? NativeModules.TMXModule : NativeModules.CetModule;

  if (!module?.profileDevice) return undefined;

  try {
    const result = await module.profileDevice("my device", brand);
    const parsedResult = typeof result === "string" ? JSON.parse(result) : result;
    return parsedResult.TMXSessionID || parsedResult.sessionId;
  } catch (err) {
    if (__DEV__) {
      console.log("TMX Profiling failed:", err);
    }
  }

  return undefined;
};

const initialCetFrameworkSetup = async (jurisdiction: string, country: string, authData: AuthData): Promise<void> => {
  const OS = Platform.OS as "android" | "ios";
  const APP_KEY = appConfig.APP_KEYS[OS];
  const customUserAgentSuffix = await getCustomUserAgentSuffix();

  const analyticsTrackingState = OS === "ios" ? await getAnalyticsTrackingState() : "unset";
  const environment = getCurrentEnv();
  const environmentConfiguration: typeof cetMainConfiguration.environmentConfiguration = environment
    ? {
        // TODO: remove this cast as soon as CET fixes supported environments correctly
        // at the moment CET is exposing only 'prd' and 'nxt', therefore a cast is needed
        environment: resolveCETEnvironment(environment) as CETEnvironment,
        mode: "release" as CETEnvironmentMode,
      }
    : null;

  const theme = Appearance.getColorScheme() === "dark" ? 1 : 2;

  const params: CetMainConfigurationType = {
    brand: Brand.Betfair,
    jurisdiction: jurisdiction as CETJurisdiction,
    countryCode: country,
    myAccountProductId: getProdIdConfig(),
    environmentConfiguration,
    theme,
    applicationKey: APP_KEY,
    applicationUrlSchema: "bfe://",
    universalAppLink: UNIVERSAL_APP_LINK,
    merchantId: "merchant.com.betfair",
    productName: "home.betfair.int",
    analyticsConfiguration: {
      appsFlyerDevKey: "S4G2yWMYNsBV9qjkErsEYe",
      analyticsTrackingState,
      appStoreId: "552024276", // this appStoreID is for SMX, BFRB will replace SMX
      async logGAEvent(event: any) {
        const eventParams = { ...event, product: PlatformType.Wrapper };
        if (!isMetaDataEvent(eventParams)) {
          return sendEvent(eventParams);
        }

        return undefined;
      },
      async logSignalFX(eventType: string, eventName: string, payload: any) {
        try {
          const flattenedPayload = Object.entries(payload).reduce(
            (acc, [key, value]) => {
              acc[`cet.payload.${key}`] = typeof value === "object" ? JSON.stringify(value) : value;
              return acc;
            },
            {} as Record<string, any>,
          );
          const tracer = trace.getTracer("cet");
          const span = tracer.startSpan("logger", {
            attributes: {
              "workflow.name": eventName,
              eventType,
              ...flattenedPayload,
            },
          });
          span.end();
        } catch (err) {
          if (__DEV__) {
            console.log("Logging SignalFX event failed:", err);
          }
        }
      },
    },
    loginCanBeClosed: true,
    myAccountScreenLinks: {
      MY_DETAILS: {
        link: "bfe://view/settings-settings",
      },
      SPORTSBOOK_BETS: {
        link: `bfe://mybets/mybets-open`,
      },
      GAMING_SCREEN: {
        link: "bfe://casino/gm-1",
      },
      SPORTS_SCREEN: {
        link: "bfe://betfair.com",
      },
    },
    joinNowLabel: authData.JOIN_DATA.joinNowLabel,
    joinNowUrl: authData.JOIN_DATA.joinNowLink,
    userAgentSuffix: customUserAgentSuffix,
    tmxConfiguration: {
      async getSessionId() {
        return getTmxSessionId(Brand.Betfair);
      },
    },
  };
  await cetMainConfiguration.setup(params);
  setCetInitialised();
};

export default initialCetFrameworkSetup;
