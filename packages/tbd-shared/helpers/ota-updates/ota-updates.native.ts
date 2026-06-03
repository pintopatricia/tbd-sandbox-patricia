import * as Updates from "expo-updates";
import { ThrottlesState, createGetThrottleSelector } from "@ppb/tbd-store";

import appConfiguration from "../../config/app-configuration.native";
import { startOtaSession } from "./ota-telemetry.native";
import { NativeModules } from "react-native";

const { LaunchArgumentsModule } = NativeModules;

let hasCheckedOnce = false;

const isOtaEnabled = async (throttles: ThrottlesState): Promise<boolean> => {
  if (hasCheckedOnce) {
    // Skip all other checks if already tried once
    return false;
  }

  const getThrottle = createGetThrottleSelector();
  const throttle = getThrottle(throttles, "ENABLE_OTA_UPDATES");
  const isOtaEnabled = !__DEV__ && Updates.isEnabled && appConfiguration.appConfig?.TBDN_RELEASE_MODE === "production";

  if (isOtaEnabled && throttle?.isActive) {
    // Avoids slowing up the app startup in production if already enabled, launch argument as fallback
    return true;
  }

  try {
    const args: {
      ENABLE_OTA_UPDATES?: boolean;
    } = await LaunchArgumentsModule.getLaunchArguments();

    return args?.ENABLE_OTA_UPDATES === true;
  } catch {
    // In case of any error, we don't want to block the app startup, so we just return false
    return false;
  }
};

export const checkAndDownloadOtaUpdate = async (throttles: ThrottlesState): Promise<void> => {
  if (!(await isOtaEnabled(throttles))) {
    return;
  }

  hasCheckedOnce = true;

  const session = startOtaSession();

  try {
    const result = await session.trackManifestCheck(() => Updates.checkForUpdateAsync());

    if (!result.isAvailable && !result.isRollBackToEmbedded) {
      return;
    }

    await session.trackFetch(() => Updates.fetchUpdateAsync());
  } catch (err) {
    session.recordError(err as Error);
  } finally {
    session.end();
  }
};
