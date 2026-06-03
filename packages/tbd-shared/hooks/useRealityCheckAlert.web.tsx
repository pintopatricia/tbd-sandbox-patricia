import { useCallback, useEffect } from "react";

import { dispatchRealityCheckAlert } from "../helpers/reality-check-alert";

type SGTimeAlertEvent = CustomEvent<{ timeSpent?: unknown } | undefined>;
const SG_TIME_ALERT_EVENT = "sgTimeAlert";

export const useRealityCheckAlert = (): void => {
  const handleRealityCheckAlert = useCallback(
    (event: SGTimeAlertEvent): void => dispatchRealityCheckAlert(event.detail?.timeSpent),
    [],
  );

  useEffect(() => {
    window.addEventListener(SG_TIME_ALERT_EVENT, handleRealityCheckAlert);

    return (): void => window.removeEventListener(SG_TIME_ALERT_EVENT, handleRealityCheckAlert);
  }, [handleRealityCheckAlert]);
};
