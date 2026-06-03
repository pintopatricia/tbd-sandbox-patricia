import { getNetworkStatus } from "./network-status-selectors";

describe("getNetworkStatus", () => {
  it("should return app network status", () => {
    const state = { network: { networkStatus: "ONLINE" } };

    expect(getNetworkStatus(state)).toBe("ONLINE");
  });
});
