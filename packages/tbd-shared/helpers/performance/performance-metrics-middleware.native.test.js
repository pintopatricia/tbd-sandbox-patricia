import { PUSH } from "@ppb/tbd-store/actions/router";
import { createPerformanceMetricsMiddleware } from "./performance-metrics-middleware.native";
import * as performanceHelpers from "./performance-helpers.native";

jest.mock("react-native", () => ({
  NativeModules: {
    TBDPerformanceModule: {
      startUIFpsTracking: jest.fn(),
    },
  },
}));

const GENERIC_VIEW_PAYLOAD = {
  viewUrn: "ppb:tbd:view:generic",
};

const HOME_VIEW_PAYLOAD = {
  viewUrn: "ppb:tbd:view:home",
};

const FAILING_VIEW_PAYLOAD = {
  viewUrn: undefined,
};

const nextMock = jest.fn();

describe("PerformanceMetrics Middleware", () => {
  jest.useFakeTimers();

  describe("when middleware starts", () => {
    it("should not startEventLoop if push action has a invalid viewUrn", () => {
      const startEventLoopMock = jest.spyOn(performanceHelpers, "startEventLoop");

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: FAILING_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).not.toHaveBeenCalled();
    });

    it("should startEventLoop if push action has a valid viewUrn", () => {
      const startEventLoopMock = jest.spyOn(performanceHelpers, "startEventLoop");

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: GENERIC_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).toHaveBeenCalledWith();
    });

    it("should check the flow if current urn changes", () => {
      const startEventLoopMock = jest.spyOn(performanceHelpers, "startEventLoop");

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: GENERIC_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).toHaveBeenCalledWith();

      jest.clearAllMocks();
      // it shouldn't call startEventLoop since currentUrn is the same

      createPerformanceMetricsMiddleware()(jest.fn())({
        type: PUSH,
        payload: GENERIC_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).not.toHaveBeenCalled();

      jest.clearAllMocks();
      // it should call startEventLoop since currentUrn is different

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: HOME_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).toHaveBeenCalledWith();
    });

    it("should check tthe flow if ccurrent urn changes", () => {
      const startEventLoopMock = jest.spyOn(performanceHelpers, "startEventLoop").mockImplementation(() => {});

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: GENERIC_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).toHaveBeenCalledWith();

      jest.clearAllMocks();
      // it shouldn't call startEventLoop since currentUrn is the same

      createPerformanceMetricsMiddleware()(jest.fn())({
        type: PUSH,
        payload: GENERIC_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).not.toHaveBeenCalledWith();

      jest.clearAllMocks();
      // it should call startEventLoop since currentUrn is different

      createPerformanceMetricsMiddleware()(nextMock)({
        type: PUSH,
        payload: HOME_VIEW_PAYLOAD,
      });

      expect(startEventLoopMock).toHaveBeenCalledWith();
    });
  });
});
