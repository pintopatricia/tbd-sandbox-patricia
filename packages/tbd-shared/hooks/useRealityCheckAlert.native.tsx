import { useCallback, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";

import { EVENTS } from "@flutter-global/react-native-cet-framework";

import { dispatchRealityCheckAlert } from "../helpers/reality-check-alert";

type RealityCheckAlertEvent = {
  totalMinutes?: unknown;
};

export const useRealityCheckAlert = (): void => {
  const handleRealityCheckAlert = useCallback((event?: RealityCheckAlertEvent): void => {
    dispatchRealityCheckAlert(event?.totalMinutes);
  }, []);

  useEffect(() => {
    const realityCheckListener = DeviceEventEmitter.addListener(EVENTS.ON_REALITY_CHECK, handleRealityCheckAlert);

    return (): void => realityCheckListener.remove();
  }, [handleRealityCheckAlert]);
};
