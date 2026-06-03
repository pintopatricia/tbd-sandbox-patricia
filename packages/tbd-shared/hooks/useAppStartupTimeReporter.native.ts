import { trace } from "@opentelemetry/api";
import { firebase } from "@react-native-firebase/crashlytics";
import { useCallback, useEffect, useRef } from "react";
import { NativeModules } from "react-native";
import config from "../config/app-configuration.native";

export const useAppStartupTimeReporter = (isLoading: boolean): void => {
  const hasSentReport = useRef(false);

  const reportAppStartupTime = useCallback(async () => {
    NativeModules.StartupTime?.getTimeSinceStartup()
      .then(({ isColdStartup, time }: { isColdStartup: boolean; time: number }) => {
        // Only report startup time on cold start to avoid multiple reports when app is warm started.
        // On Android, a warm launch will occur if users have previously left the app by pressing the
        // hardware back button or swiping on the edge of the root / home screen.
        if (isColdStartup) {
          hasSentReport.current = true;
          const span = trace.getActiveSpan();
          if (span) {
            span.setAttribute("customAppStartupTime", time);
          }
        }
      })
      .catch((error: Error) => firebase.crashlytics().recordError(error, "customAppStartupTime"));
  }, []);

  useEffect(() => {
    if (!isLoading && config.appConfig?.TBDN_RELEASE_MODE === "production" && !hasSentReport.current) {
      reportAppStartupTime();
    }
  }, [isLoading, reportAppStartupTime]);
};
