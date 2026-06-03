import { useRef } from "react";
import { NativeModules } from "react-native";
import { firebase } from "@react-native-firebase/crashlytics";
import { trace } from "@opentelemetry/api";
import { renderHook } from "@testing-library/react-native";
import config from "../config/app-configuration.native";
import { useAppStartupTimeReporter } from "./useAppStartupTimeReporter.native";

const mockSpan = {
  setAttribute: jest.fn(),
};

jest.mock("../config/app-configuration.native", () => ({
  appConfig: {
    TBDN_RELEASE_MODE: "production",
  },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn().mockReturnValue({
    current: false,
  }),
}));

jest.mock("react-native", () => ({
  NativeModules: {
    StartupTime: {
      getTimeSinceStartup: jest.fn(() => Promise.resolve({ isColdStartup: true, time: 0 })),
    },
  },
}));

jest.mock("@react-native-firebase/crashlytics", () => ({
  firebase: {
    crashlytics: jest.fn().mockReturnValue({
      recordError: jest.fn(),
    }),
  },
}));

describe("useAppStartupTimeReporter", () => {
  beforeEach(jest.clearAllMocks);

  it("should be defined", () => {
    expect(useAppStartupTimeReporter).toBeDefined();
  });

  describe("when isLoading is false", () => {
    describe("and startup report has not been sent", () => {
      beforeEach(() => {
        useRef.mockReturnValue({ current: false });
      });

      describe("and TBDN_RELEASE_MODE is production", () => {
        beforeEach(() => {
          config.appConfig.TBDN_RELEASE_MODE = "production";
        });

        describe("and is cold startup", () => {
          beforeEach(() => {
            jest.spyOn(trace, "getActiveSpan").mockReturnValue(mockSpan);
            NativeModules.StartupTime.getTimeSinceStartup.mockResolvedValue({
              isColdStartup: true,
              time: 7000,
            });
            renderHook(() => useAppStartupTimeReporter(false));
          });

          it("should set signalfx customAppStartupTime attribute", () => {
            expect(mockSpan.setAttribute).toHaveBeenCalledWith("customAppStartupTime", 7000);
          });
        });

        describe("and is warmed startup", () => {
          beforeEach(() => {
            jest.spyOn(trace, "getActiveSpan").mockReturnValue(mockSpan);
            NativeModules.StartupTime.getTimeSinceStartup.mockResolvedValue({
              isColdStartup: false,
              time: 7000,
            });
            renderHook(() => useAppStartupTimeReporter(false));
          });

          it("should not set signalfx customAppStartupTime attribute", () => {
            expect(mockSpan.setAttribute).not.toHaveBeenCalled();
          });
        });

        describe("and an error is caught", () => {
          beforeEach(() => {
            mockSpan.setAttribute = undefined;
            NativeModules.StartupTime.getTimeSinceStartup.mockResolvedValue({
              isColdStartup: true,
              time: 7000,
            });
            renderHook(() => useAppStartupTimeReporter(false));
          });

          it("should report error to firebase", () => {
            expect(firebase.crashlytics().recordError).toHaveBeenCalled();
          });
        });
      });

      describe("and TBDN_RELEASE_MODE is internal", () => {
        beforeEach(() => {
          config.appConfig.TBDN_RELEASE_MODE = "internal";
          renderHook(() => useAppStartupTimeReporter(false));
        });

        it("should not call getTimeSinceStartup", () => {
          expect(NativeModules.StartupTime.getTimeSinceStartup).not.toHaveBeenCalled();
        });
      });
    });

    describe("and startup report has already been sent", () => {
      beforeEach(() => {
        useRef.mockReturnValue({ current: true });
        renderHook(() => useAppStartupTimeReporter(false));
      });
      it("should not call getTimeSinceStartup", () => {
        expect(NativeModules.StartupTime.getTimeSinceStartup).not.toHaveBeenCalled();
      });
    });
  });

  describe("when isLoading is true", () => {
    beforeEach(() => {
      renderHook(() => useAppStartupTimeReporter(true));
    });
    it("should not call getTimeSinceStartup", () => {
      expect(NativeModules.StartupTime.getTimeSinceStartup).not.toHaveBeenCalled();
    });
  });
});
