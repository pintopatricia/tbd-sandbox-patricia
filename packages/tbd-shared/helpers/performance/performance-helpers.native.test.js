import { AppState } from "react-native";
import * as performanceUtils from "./performance-utils.native";
import * as performanceHelpers from "./performance-helpers.native";

describe("Performance helpers", () => {
  jest.useFakeTimers();

  // let sendEventLoopTraceMock;
  let calculateDelayMock;
  let calculateSmoothingDelayMock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("App is active and showing", () => {
    it("should calculate delays and check if app is busy", () => {
      AppState.currentState = "active";
      // sendEventLoopTraceMock = jest.spyOn(performanceUtils, "sendEventLoopTrace");
      calculateDelayMock = jest.spyOn(performanceUtils, "calculateDelay");
      calculateSmoothingDelayMock = jest.spyOn(performanceUtils, "calculateSmoothingDelay");

      performanceHelpers.startEventLoop("ppb:tbd:view:generic");

      jest.runOnlyPendingTimers();

      expect(calculateDelayMock).toHaveBeenCalled();
      expect(calculateSmoothingDelayMock).toHaveBeenCalled();
    });

    beforeEach(() => {
      AppState.currentState = "active";
      // sendEventLoopTraceMock = jest.spyOn(performanceUtils, "sendEventLoopTrace");
      calculateDelayMock = jest.spyOn(performanceUtils, "calculateDelay").mockReturnValue(150);
      calculateSmoothingDelayMock = jest.spyOn(performanceUtils, "calculateSmoothingDelay").mockReturnValue(150);
    });

    // it("should record metric", () => {
    //   performanceHelpers.startEventLoop("ppb:tbd:view:generic");
    //
    //   jest.runOnlyPendingTimers();
    //
    //   expect(sendEventLoopTraceMock).toHaveBeenCalledWith(150);
    // });
  });

  describe("App is in background", () => {
    it("shouldn't calculate delays and check if app is busy", () => {
      AppState.currentState = "background";
      // sendEventLoopTraceMock = jest.spyOn(performanceUtils, "sendEventLoopTrace");
      calculateDelayMock = jest.spyOn(performanceUtils, "calculateDelay");
      calculateSmoothingDelayMock = jest.spyOn(performanceUtils, "calculateSmoothingDelay");

      performanceHelpers.startEventLoop("ppb:tbd:view:generic");

      jest.runOnlyPendingTimers();

      expect(calculateDelayMock).not.toHaveBeenCalled();
      expect(calculateSmoothingDelayMock).not.toHaveBeenCalled();
    });
  });
});
