import { createGetThrottleSelector } from "@ppb/tbd-store";

let checkAndDownloadOtaUpdate;
let mockSession;
let mockStartOtaSession;
let mockGetThrottle;
let mockGetLaunchArguments;

const mockThrottles = {};

function setupModule({
  isEnabled = true,
  releaseMode = "production",
  throttle = { isActive: true },
  launchArgOtaEnabled = false,
} = {}) {
  jest.resetModules();

  mockSession = {
    trackManifestCheck: jest.fn().mockResolvedValue({ isAvailable: false, isRollBackToEmbedded: false }),
    trackFetch: jest.fn().mockResolvedValue({ isNew: false }),
    recordError: jest.fn(),
    end: jest.fn(),
  };
  mockStartOtaSession = jest.fn(() => mockSession);
  mockGetThrottle = jest.fn().mockReturnValue(throttle);
  mockGetLaunchArguments = jest.fn().mockResolvedValue(launchArgOtaEnabled ? { ENABLE_OTA_UPDATES: true } : {});

  jest.doMock("expo-updates", () => ({ isEnabled }));
  jest.doMock("./ota-telemetry.native", () => ({ startOtaSession: mockStartOtaSession }));
  jest.doMock("@ppb/tbd-store", () => ({ createGetThrottleSelector: jest.fn(() => mockGetThrottle) }));
  jest.doMock("../../config/app-configuration.native", () => ({
    appConfig: { TBDN_RELEASE_MODE: releaseMode },
  }));
  jest.doMock("react-native", () => ({
    NativeModules: {
      LaunchArgumentsModule: { getLaunchArguments: mockGetLaunchArguments },
    },
  }));

  ({ checkAndDownloadOtaUpdate } = require("./ota-updates.native"));
}

beforeEach(() => {
  setupModule();
  global.__DEV__ = false;
});

afterEach(() => {
  global.__DEV__ = true;
});

describe("checkAndDownloadOtaUpdate", () => {
  describe("when all conditions are met", () => {
    it("starts an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
    });

    it("checks for an available update", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.trackManifestCheck).toHaveBeenCalledTimes(1);
    });

    it("passes the ENABLE_OTA_UPDATES throttle key to the selector", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockGetThrottle).toHaveBeenCalledWith(mockThrottles, "ENABLE_OTA_UPDATES");
    });

    it("skips the launch args fetch on the fast path", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockGetLaunchArguments).not.toHaveBeenCalled();
    });

    it("ends the session regardless of outcome", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.end).toHaveBeenCalledTimes(1);
    });

    it("does not fetch when no update is available", async () => {
      mockSession.trackManifestCheck.mockResolvedValue({ isAvailable: false, isRollBackToEmbedded: false });

      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.trackFetch).not.toHaveBeenCalled();
    });

    it("fetches the update when one is available", async () => {
      mockSession.trackManifestCheck.mockResolvedValue({ isAvailable: true, isRollBackToEmbedded: false });

      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.trackFetch).toHaveBeenCalledTimes(1);
    });

    it("fetches when a rollback-to-embedded is available", async () => {
      mockSession.trackManifestCheck.mockResolvedValue({ isAvailable: false, isRollBackToEmbedded: true });

      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.trackFetch).toHaveBeenCalledTimes(1);
    });

    it("records errors and still ends the session", async () => {
      const error = new Error("network timeout");
      mockSession.trackManifestCheck.mockRejectedValue(error);

      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockSession.recordError).toHaveBeenCalledWith(error);
      expect(mockSession.end).toHaveBeenCalledTimes(1);
    });

    it("does not start a new session on a second call within the same session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
    });
  });

  describe("when __DEV__ is true", () => {
    it("returns without starting an OTA session", async () => {
      global.__DEV__ = true;

      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when Updates.isEnabled is false", () => {
    beforeEach(() => {
      setupModule({ isEnabled: false });
    });

    it("returns without starting an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when the release mode is not production", () => {
    beforeEach(() => {
      setupModule({ releaseMode: "staging" });
    });

    it("returns without starting an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when the OTA throttle is inactive", () => {
    beforeEach(() => {
      setupModule({ throttle: { isActive: false } });
    });

    it("returns without starting an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when the OTA throttle is undefined", () => {
    beforeEach(() => {
      setupModule({ throttle: null });
    });

    it("returns without starting an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when getLaunchArguments throws", () => {
    beforeEach(() => {
      setupModule({ throttle: { isActive: false } });
      mockGetLaunchArguments.mockRejectedValue(new Error("native module unavailable"));
    });

    it("returns without starting an OTA session", async () => {
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).not.toHaveBeenCalled();
    });
  });

  describe("when the ENABLE_OTA_UPDATES launch arg is true", () => {
    describe("and __DEV__ is true", () => {
      beforeEach(() => {
        setupModule({ launchArgOtaEnabled: true });
        global.__DEV__ = true;
      });

      it("starts an OTA session", async () => {
        await checkAndDownloadOtaUpdate(mockThrottles);

        expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("and Updates.isEnabled is false", () => {
      beforeEach(() => {
        setupModule({ isEnabled: false, launchArgOtaEnabled: true });
      });

      it("starts an OTA session", async () => {
        await checkAndDownloadOtaUpdate(mockThrottles);

        expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the release mode is not production", () => {
      beforeEach(() => {
        setupModule({ releaseMode: "staging", launchArgOtaEnabled: true });
      });

      it("starts an OTA session", async () => {
        await checkAndDownloadOtaUpdate(mockThrottles);

        expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the throttle is inactive", () => {
      beforeEach(() => {
        setupModule({ throttle: { isActive: false }, launchArgOtaEnabled: true });
      });

      it("starts an OTA session", async () => {
        await checkAndDownloadOtaUpdate(mockThrottles);

        expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the throttle is undefined", () => {
      beforeEach(() => {
        setupModule({ throttle: null, launchArgOtaEnabled: true });
      });

      it("starts an OTA session", async () => {
        await checkAndDownloadOtaUpdate(mockThrottles);

        expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
      });
    });

    it("does not start a new session on a second call within the same session", async () => {
      setupModule({ throttle: { isActive: false }, launchArgOtaEnabled: true });

      await checkAndDownloadOtaUpdate(mockThrottles);
      await checkAndDownloadOtaUpdate(mockThrottles);

      expect(mockStartOtaSession).toHaveBeenCalledTimes(1);
    });
  });
});
