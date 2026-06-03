import { useEffect } from "react";
import NetInfo, { NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";
import { NETWORK_STATUS__UPDATE, NetworkStatusUpdateAction } from "@ppb/tbd-store/actions/network-status";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { setInternetStatus } from "@ppb/tbd-store/middlewares/http-poller/internet-status";
import { IModuleStore } from "redux-dynamic-modules";
import { SplunkRum } from "@splunk/otel-react-native";
import { getNetworkAttributesFromState } from "../helpers/network-info.native";

const useNetworkStateListener = (store?: IModuleStore<ApplicationState>): void => {
  useEffect(() => {
    let removeListener: NetInfoSubscription | undefined;

    if (store && !removeListener) {
      // Adding listener for network state changes
      removeListener = NetInfo.addEventListener((state: NetInfoState) => {
        // we're evaluating offline only when isInternetReachable is false because there's an intermediate state
        // where isInternetReachable is null (in that state we consider the user is ONLINE, othewise we'll be showing
        // the offline notification while opening the app, even if the user is online).
        // https://github.com/react-native-netinfo/react-native-netinfo/blob/v7.1.12/src/internal/types.ts#L51
        //
        // We added a validation to check if isConnected is false because there were reports where users had internet
        // but the isInternetReachable was returning false. We did state.isConnected === false because isConnected can be null in a lot of situations where we have internet.
        // The package @react-native-community/netinfo is facing some problems, if an update solves all the issues please delete this comment.
        const isOffline = state.isInternetReachable === false && state.isConnected === false;

        store.dispatch<NetworkStatusUpdateAction>({
          type: NETWORK_STATUS__UPDATE,
          payload: {
            networkStatus: isOffline ? "OFFLINE" : "ONLINE",
          },
        });

        setInternetStatus(!isOffline);

        // Update Splunk global attributes with current network state for telemetry correlation
        try {
          const networkAttributes = getNetworkAttributesFromState(state);
          SplunkRum.instance.globalAttributes.setAll(networkAttributes);
        } catch (error) {
          console.error("Failed to set network attributes for Splunk:", error);
        }
      });
    }

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [store]);
};

export default useNetworkStateListener;
