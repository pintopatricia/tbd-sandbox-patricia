import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { ensureStaleTrackingForUrn, refreshIfStale, RefreshComponentHookConfig } from "./useRefreshComponent.common";

export const useRefreshComponent = ({
  urn,
  refreshAction,
  refreshEnabled = true,
  chefComponentName,
}: RefreshComponentHookConfig) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!refreshEnabled) {
      return;
    }

    const hadEntry = ensureStaleTrackingForUrn(urn);

    if (hadEntry && refreshIfStale(urn, chefComponentName)) {
      refreshAction({ urn });
    }
  }, [refreshEnabled, refreshAction, chefComponentName, urn]);

  useEffect(() => {
    if (!refreshEnabled) {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      const wasInBackground = appState.current === "inactive" || appState.current === "background";
      appState.current = nextAppState;

      if (wasInBackground && nextAppState === "active" && refreshIfStale(urn, chefComponentName)) {
        refreshAction({ urn });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshEnabled, refreshAction, chefComponentName, urn]);
};
