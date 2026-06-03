import { useCallback, useEffect, useRef } from "react";
import { ensureStaleTrackingForUrn, refreshIfStale, RefreshComponentHookConfig } from "./useRefreshComponent.common";

export const useRefreshComponent = ({
  urn,
  refreshAction,
  refreshEnabled = true,
  chefComponentName,
}: RefreshComponentHookConfig) => {
  const isHiddenRef = useRef<boolean>(typeof document !== "undefined" ? document.hidden : false);

  useEffect(() => {
    if (!refreshEnabled) {
      return;
    }

    const hadEntry = ensureStaleTrackingForUrn(urn);

    if (hadEntry && refreshIfStale(urn, chefComponentName)) {
      refreshAction({ urn });
    }
  }, [refreshEnabled, refreshAction, chefComponentName, urn]);

  const handleVisibilityChange = useCallback(() => {
    if (!refreshEnabled) {
      return;
    }

    const wasHidden = isHiddenRef.current;
    const isCurrentlyHidden = document.hidden;
    isHiddenRef.current = isCurrentlyHidden;

    if (wasHidden && !isCurrentlyHidden && refreshIfStale(urn, chefComponentName)) {
      refreshAction({ urn });
    }
  }, [refreshEnabled, refreshAction, chefComponentName, urn]);

  useEffect(() => {
    if (!refreshEnabled || typeof document === "undefined") {
      return undefined;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshEnabled, handleVisibilityChange]);
};
