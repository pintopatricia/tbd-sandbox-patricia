import { REFRESH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

describe("PullRefresh map-state-to-props", () => {
  describe("state props", () => {
    it("should return the refresh state in isRefreshing", () => {
      expect(
        makeMapStateToProps()({
          router: {
            isRefreshing: true,
          },
        }).isRefreshing,
      ).toEqual(true);
    });
  });
  describe("dispatch props", () => {
    it("should export dispatchRefresh", () => {
      expect(mapDispatchToProps.dispatchRefresh).toEqual(expect.any(Function));
    });

    it("should return a REFRESH action when dispatchRefresh is called", () => {
      expect(mapDispatchToProps.dispatchRefresh("urn")).toEqual({ type: REFRESH, payload: { urn: "urn" } });
    });
  });
});
