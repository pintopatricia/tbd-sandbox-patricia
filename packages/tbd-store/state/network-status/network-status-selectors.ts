import { ApplicationState } from "../ApplicationState.types";
import { NetworkStatus } from "./NetworkStatusState.types";

export const getNetworkStatus = (state: ApplicationState): NetworkStatus => state.network.networkStatus;
