export const URNStaleCheckTimestamps = new Map<string, number>();

export type RefreshComponentStalePayload = {
  urn: string;
};

export type RefreshComponentHookConfig = {
  urn: string;
  refreshAction: (payload: { urn: string; [key: string]: unknown }) => void | Promise<void>;
  refreshEnabled?: boolean;
  chefComponentName: string;
};

export const markUrnAsFresh = (urn: string) => {
  URNStaleCheckTimestamps.set(urn, Date.now());
};

export const ensureStaleTrackingForUrn = (urn: string) => {
  const hasEntry = URNStaleCheckTimestamps.has(urn);

  if (!hasEntry) {
    markUrnAsFresh(urn);
  }

  return hasEntry;
};

export const isUrnStale = (urn: string, timeoutInSeconds: number) => {
  if (timeoutInSeconds <= 0) {
    return true;
  }

  const lastRefreshTimestamp = URNStaleCheckTimestamps.get(urn);
  if (!lastRefreshTimestamp) {
    return false;
  }

  const elapsed = Date.now() - lastRefreshTimestamp;
  const isStale = elapsed >= timeoutInSeconds * 1000;

  return isStale;
};

const DEFAULT_REFRESH_TIMEOUT = 140;

export const refreshIfStale = (urn: string, chefComponentName: string) => {
  const chefSpecificKey =
    typeof window !== "undefined" ? window.__TBD_ENVIRONMENT__?.REFRESH_STALE_TIMEOUTS?.[chefComponentName] : undefined;

  const chefDefaultKey =
    typeof window !== "undefined" ? window.__TBD_ENVIRONMENT__?.REFRESH_STALE_TIMEOUTS?.default : undefined;

  const timeout = chefSpecificKey ?? chefDefaultKey ?? DEFAULT_REFRESH_TIMEOUT;

  if (!isUrnStale(urn, timeout)) {
    return false;
  }

  markUrnAsFresh(urn);

  return true;
};

export const resetRefreshTimestamps = () => {
  URNStaleCheckTimestamps.clear();
};
