import { NetworkStatus } from "../state/network-status/NetworkStatusState.types";

export const NETWORK_STATUS__UPDATE = "NETWORK_STATUS/UPDATE";

export type NetworkStatusUpdateAction = {
  type: typeof NETWORK_STATUS__UPDATE;
  payload: {
    networkStatus: NetworkStatus;
  };
};
