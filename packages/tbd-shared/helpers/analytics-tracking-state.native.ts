import { NativeModules } from "react-native";
import { AnalyticsTrackingState } from "@flutter-global/react-native-cet-framework";

const { IFDATracking } = NativeModules;

type TrackingStatus = "unavailable" | "denied" | "authorized" | "restricted" | "not-determined";

type IFDAtoCETStatus = {
  [status in TrackingStatus]: AnalyticsTrackingState;
};

const MappedTrackingState: IFDAtoCETStatus = {
  authorized: "enabled",
  restricted: "disabled",
  denied: "disabled",
  unavailable: "unset",
  "not-determined": "unset",
};

export const getAnalyticsTrackingState = async (): Promise<AnalyticsTrackingState> => {
  const ifdaStatus = (await IFDATracking.getTrackingStatus()) as TrackingStatus;

  return MappedTrackingState[ifdaStatus];
};
