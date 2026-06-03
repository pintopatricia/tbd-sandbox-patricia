/**
 * Network Information API helper for web platform
 *
 * Provides network condition telemetry to correlate with bet rejections and other user actions.
 * Note: Network Information API is only supported in Chrome, Edge, Opera, and Android Browser.
 * Safari and Firefox will return undefined values (graceful degradation).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
 * @see https://wicg.github.io/netinfo/
 */

// Type definitions for Network Information API (not available in standard TypeScript lib)
interface NetworkInformation extends EventTarget {
  readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  readonly type: "bluetooth" | "cellular" | "ethernet" | "wifi" | "wimax" | "none" | "other" | "unknown";
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation;
}

export interface NetworkAttributes {
  [key: string]: string | number | boolean | undefined;
  customNetworkType: string | undefined;
  customNetworkEffectiveType: string | undefined;
  customNetworkIsConnected: boolean;
  customNetworkDownlink: number | undefined;
  customNetworkRtt: number | undefined;
  customNetworkSaveData: boolean | undefined;
}

/**
 * Get current network attributes from the Network Information API
 *
 * @returns NetworkAttributes object with current network state
 */
export function getNetworkAttributes(): NetworkAttributes {
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection;

  return {
    customNetworkType: connection?.type,
    customNetworkEffectiveType: connection?.effectiveType,
    customNetworkIsConnected: navigator.onLine,
    customNetworkDownlink: connection?.downlink,
    customNetworkRtt: connection?.rtt,
    customNetworkSaveData: connection?.saveData,
  };
}
