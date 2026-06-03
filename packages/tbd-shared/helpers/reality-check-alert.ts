import { NETWORK__REALITY_CHECK_ALERT, type RealityCheckAlertAction } from "@ppb/tbd-store/actions/notification";
import { getStore } from "@ppb/tbd-store/create-store";

export const dispatchRealityCheckAlert = (timeSpent: unknown): void => {
  if (typeof timeSpent !== "number" && typeof timeSpent !== "string") {
    return;
  }

  const duration = Number(timeSpent);

  if (!Number.isInteger(duration) || duration <= 0) {
    return;
  }

  getStore().dispatch<RealityCheckAlertAction>({
    type: NETWORK__REALITY_CHECK_ALERT,
    payload: { duration },
  });
};
