/**
 * Network Information helper for React Native platform
 *
 * Provides network condition telemetry to correlate with bet rejections and other user actions.
 * Uses @react-native-community/netinfo which is already installed (v11.3.3).
 *
 * @see https://github.com/react-native-netinfo/react-native-netinfo
 */

import NetInfo, { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo";

export interface NetworkAttributes {
  [key: string]: string | number | boolean | undefined;
  customNetworkType: NetInfoStateType;
  customNetworkEffectiveType: string | undefined;
  customNetworkIsConnected: boolean | undefined;
  customNetworkIsInternetReachable: boolean | undefined;
  customNetworkIsExpensive: boolean | undefined;
}

/**
 * Maps NetInfoState to NetworkAttributes
 *
 * @param state NetInfoState from netinfo library
 * @returns NetworkAttributes object
 */
function mapNetInfoStateToAttributes(state: NetInfoState): NetworkAttributes {
  return {
    customNetworkType: state.type,
    customNetworkEffectiveType: state.type === "cellular" ? state.details?.cellularGeneration ?? undefined : undefined,
    customNetworkIsConnected: state.isConnected ?? undefined,
    customNetworkIsInternetReachable: state.isInternetReachable ?? undefined,
    customNetworkIsExpensive: state.details?.isConnectionExpensive ?? undefined,
  };
}

/**
 * Get current network attributes from NetInfo
 * Note: This is async because NetInfo.fetch() returns a Promise
 *
 * @returns Promise<NetworkAttributes> object with current network state
 */
export async function getNetworkAttributes(): Promise<NetworkAttributes> {
  const state: NetInfoState = await NetInfo.fetch();
  return mapNetInfoStateToAttributes(state);
}

/**
 * Synchronously get network attributes from a NetInfoState
 * Useful when you already have the state from a listener
 *
 * @param state NetInfoState from netinfo callback
 * @returns NetworkAttributes object
 */
export function getNetworkAttributesFromState(state: NetInfoState): NetworkAttributes {
  return mapNetInfoStateToAttributes(state);
}
