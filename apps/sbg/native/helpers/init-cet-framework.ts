import {
  CETEnvironment,
  CETEnvironmentMode,
  CETJurisdiction,
  cetMainConfiguration,
  CetMainConfigurationType,
} from "@flutter-global/react-native-cet-framework";
import { trace } from "@opentelemetry/api";
import { Appearance, Platform, NativeModules } from "react-native";

import { getCurrentEnv } from "@ppb/tbd-shared/config/base-path-utils.native";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { getProdIdConfig } from "@ppb/tbd-shared/config/endpoints";
import { resolveCETEnvironment } from "@ppb/tbd-shared/config/environments.native";
import { isMetaDataEvent, sendEvent } from "@ppb/tbd-shared/gtm/tagging-collector.native";
import { getAnalyticsTrackingState } from "@ppb/tbd-shared/helpers/analytics-tracking-state.native";
import { getCustomUserAgentSuffix } from "@ppb/tbd-shared/helpers/user-agent.native";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { setCetInitialised } from "@ppb/tbd-shared/helpers/cet-init-state.native";

import appConfig from "../app.config.json";

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
    brand: Brand.Skybet,
    jurisdiction: jurisdiction as CETJurisdiction,
    countryCode: country,
    myAccountProductId: getProdIdConfig(),
    environmentConfiguration,
    theme,
    applicationKey: APP_KEY,
    applicationUrlSchema: "skybet://",
    universalAppLink: "https://www.skybet.com/",
    merchantId: "merchant.com.skybet",
    productName: "home.skybet.int",
    analyticsConfiguration: {
      appsFlyerDevKey: "3uFeKbkin6acbLFWtbNTve",
      analyticsTrackingState,
      appStoreId: "428237841", // this appStoreID is for Skybet iOS, new Skybet will replace hSBG
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
            console.log("Logging to SignalFX failed:", err);
          }
        }
      },
    },
    loginCanBeClosed: true,
    myAccountScreenLinks: {
      MY_DETAILS: {
        link: "skybet://www.skybet.com/view/settings-settings",
      },
      SPORTSBOOK_BETS: {
        link: `skybet://www.skybet.com/mybets/mybets-open`,
      },
      GAMING_SCREEN: {
        link: "skybet://www.skybet.com/casino/gm-1", // to be checked
      },
      SPORTS_SCREEN: {
        link: "skybet://skybet.com",
      },
    },
    joinNowLabel: authData.JOIN_DATA.joinNowLabel,
    joinNowUrl: authData.JOIN_DATA.joinNowLink,
    userAgentSuffix: customUserAgentSuffix,
    tmxConfiguration: {
      async getSessionId() {
        return getTmxSessionId(Brand.Skybet);
      },
    },
  };
  await cetMainConfiguration.setup(params);
  setCetInitialised();
};

export default initialCetFrameworkSetup;
