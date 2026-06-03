import { NativeModules } from "react-native";
import { getAnalyticsTrackingState } from "./analytics-tracking-state.native";

jest.mock("react-native", () => ({
  NativeModules: {
    IFDATracking: {
      getTrackingStatus: jest.fn(),
    },
  },
}));

describe.each([
  ["authorized", "enabled"],
  ["restricted", "disabled"],
  ["denied", "disabled"],
  ["unavailable", "unset"],
  ["not-determined", "unset"],
])("when IFDA state is %s", (ifdaStatus, mappedStatus) => {
  it(`should map to ${mappedStatus}`, async () => {
    NativeModules.IFDATracking.getTrackingStatus.mockResolvedValue(ifdaStatus);

    const result = await getAnalyticsTrackingState();

    expect(result).toEqual(mappedStatus);
  });
});
