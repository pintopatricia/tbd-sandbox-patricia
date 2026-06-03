import { PushAction } from "@ppb/tbd-store/actions/router";
import { NativeModules } from "react-native";
import { Dispatch, Middleware } from "redux";
import { startEventLoop } from "./performance-helpers.native";

const { TBDPerformanceModule } = NativeModules;

let currentUrn: string;

export const createPerformanceMetricsMiddleware: Middleware =
  () => (next: Dispatch<PushAction>) => (action: PushAction) => {
    const viewUrn = action.payload?.viewUrn;

    if (viewUrn && currentUrn !== viewUrn) {
      currentUrn = viewUrn;

      startEventLoop();
      TBDPerformanceModule.startUIFpsTracking();
    }

    return next(action);
  };
