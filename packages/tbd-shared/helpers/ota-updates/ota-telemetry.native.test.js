let startOtaSession;

const mockTracer = {
  startSpan: jest.fn(),
};

jest.mock("expo-updates", () => ({
  runtimeVersion: "1.0.0",
  updateId: "abc-123",
  isEmergencyLaunch: false,
  emergencyLaunchReason: null,
}));

jest.mock("@opentelemetry/api", () => ({
  SpanKind: { CLIENT: 2 },
  SpanStatusCode: { ERROR: 2 },
  trace: {
    getTracer: jest.fn(() => mockTracer),
    setSpan: jest.fn(() => ({})),
  },
  context: {
    active: jest.fn(() => ({})),
  },
}));

beforeAll(() => {
  startOtaSession = require("./ota-telemetry.native").startOtaSession;
});

describe("startOtaSession", () => {
  let mockSessionSpan;
  let mockManifestSpan;
  let mockFetchSpan;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSessionSpan = {
      setAttribute: jest.fn(),
      recordException: jest.fn(),
      setStatus: jest.fn(),
      end: jest.fn(),
    };
    mockManifestSpan = { setAttribute: jest.fn(), end: jest.fn() };
    mockFetchSpan = { setAttribute: jest.fn(), end: jest.fn() };

    mockTracer.startSpan.mockImplementation((name) => {
      if (name.startsWith("ota.session.")) return mockSessionSpan;
      if (name === "ota.manifest") return mockManifestSpan;
      if (name === "ota.fetch") return mockFetchSpan;
      return { setAttribute: jest.fn(), end: jest.fn() };
    });
  });

  it("creates a session span named with the runtime version and update attributes", () => {
    startOtaSession();

    expect(mockTracer.startSpan).toHaveBeenCalledWith("ota.session.1.0.0", {
      kind: 2,
      attributes: {
        "workflow.name": "ota.session",
        "ota.current.update.id": "abc-123",
        "ota.emergency_launch": false,
        "ota.emergency_launch.reason": "no reason provided",
      },
    });
  });

  it("falls back to 'embedded' when updateId is null", () => {
    jest.resetModules();
    jest.doMock("expo-updates", () => ({
      runtimeVersion: "1.0.0",
      updateId: null,
      isEmergencyLaunch: false,
      emergencyLaunchReason: null,
    }));
    jest.doMock("@opentelemetry/api", () => ({
      SpanKind: { CLIENT: 2 },
      SpanStatusCode: { ERROR: 2 },
      trace: { getTracer: jest.fn(() => mockTracer), setSpan: jest.fn(() => ({})) },
      context: { active: jest.fn(() => ({})) },
    }));

    const { startOtaSession: startSession } = require("./ota-telemetry.native");
    startSession();

    expect(mockTracer.startSpan).toHaveBeenCalledWith(
      "ota.session.1.0.0",
      expect.objectContaining({
        attributes: expect.objectContaining({ "ota.current.update.id": "embedded" }),
      }),
    );

    jest.resetModules();
  });

  it("uses 'unknown' in the span name when runtimeVersion is null", () => {
    jest.resetModules();
    jest.doMock("expo-updates", () => ({
      runtimeVersion: null,
      updateId: "abc-123",
      isEmergencyLaunch: false,
      emergencyLaunchReason: null,
    }));
    jest.doMock("@opentelemetry/api", () => ({
      SpanKind: { CLIENT: 2 },
      SpanStatusCode: { ERROR: 2 },
      trace: { getTracer: jest.fn(() => mockTracer), setSpan: jest.fn(() => ({})) },
      context: { active: jest.fn(() => ({})) },
    }));

    const { startOtaSession: startSession } = require("./ota-telemetry.native");
    startSession();

    expect(mockTracer.startSpan).toHaveBeenCalledWith("ota.session.unknown", expect.any(Object));

    jest.resetModules();
  });

  describe("trackManifestCheck", () => {
    let session;

    beforeEach(() => {
      session = startOtaSession();
    });

    it("creates a manifest span with the workflow attribute", async () => {
      await session.trackManifestCheck(() =>
        Promise.resolve({ isAvailable: false, isRollBackToEmbedded: false, reason: "noUpdateAvailable" }),
      );

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "ota.manifest",
        { kind: 2, attributes: { "workflow.name": "ota.session" } },
        expect.any(Object),
      );
    });

    it("returns the result from the check callback", async () => {
      const checkResult = { isAvailable: true, isRollBackToEmbedded: false };

      const result = await session.trackManifestCheck(() => Promise.resolve(checkResult));

      expect(result).toBe(checkResult);
    });

    it("sets the ota.manifest.available attribute on the span", async () => {
      await session.trackManifestCheck(() => Promise.resolve({ isAvailable: true, isRollBackToEmbedded: false }));

      expect(mockManifestSpan.setAttribute).toHaveBeenCalledWith("ota.manifest.available", true);
    });

    it("ends the manifest span in the finally block", async () => {
      await session.trackManifestCheck(() =>
        Promise.resolve({ isAvailable: false, isRollBackToEmbedded: false, reason: "noUpdateAvailable" }),
      );

      expect(mockManifestSpan.end).toHaveBeenCalled();
    });

    describe("when no update is available and it is not a rollback", () => {
      beforeEach(async () => {
        await session.trackManifestCheck(() =>
          Promise.resolve({ isAvailable: false, isRollBackToEmbedded: false, reason: "noUpdateAvailable" }),
        );
      });

      it("creates a sub-span named after the reason", () => {
        expect(mockTracer.startSpan).toHaveBeenCalledWith(
          "ota.manifest.not_available.noUpdateAvailable",
          { kind: 2, attributes: { "workflow.name": "ota.session" } },
          expect.any(Object),
        );
      });

      it("sets the session outcome to not_available", () => {
        expect(mockSessionSpan.setAttribute).toHaveBeenCalledWith("ota.session.outcome", "not_available");
      });
    });

    describe("when an update is available", () => {
      it("does not create a not_available sub-span", async () => {
        await session.trackManifestCheck(() => Promise.resolve({ isAvailable: true, isRollBackToEmbedded: false }));

        expect(mockTracer.startSpan).not.toHaveBeenCalledWith(
          expect.stringContaining("not_available"),
          expect.any(Object),
          expect.any(Object),
        );
      });
    });

    describe("when the result is a rollback-to-embedded", () => {
      it("does not create a not_available sub-span", async () => {
        await session.trackManifestCheck(() => Promise.resolve({ isAvailable: false, isRollBackToEmbedded: true }));

        expect(mockTracer.startSpan).not.toHaveBeenCalledWith(
          expect.stringContaining("not_available"),
          expect.any(Object),
          expect.any(Object),
        );
      });
    });
  });

  describe("trackFetch", () => {
    let session;

    beforeEach(() => {
      session = startOtaSession();
    });

    it("creates a fetch span with the workflow attribute", async () => {
      await session.trackFetch(() => Promise.resolve({ isNew: false, isRollBackToEmbedded: false }));

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "ota.fetch",
        { kind: 2, attributes: { "workflow.name": "ota.session" } },
        expect.any(Object),
      );
    });

    it("returns the result from the fetch callback", async () => {
      const fetchResult = { isNew: false, isRollBackToEmbedded: false };

      const result = await session.trackFetch(() => Promise.resolve(fetchResult));

      expect(result).toBe(fetchResult);
    });

    it("ends the fetch span in the finally block", async () => {
      await session.trackFetch(() => Promise.resolve({ isNew: false, isRollBackToEmbedded: false }));

      expect(mockFetchSpan.end).toHaveBeenCalled();
    });

    describe("when the fetched result is a new update", () => {
      const manifest = { id: "update-abc" };

      beforeEach(async () => {
        await session.trackFetch(() => Promise.resolve({ isNew: true, isRollBackToEmbedded: false, manifest }));
      });

      it("sets ota.fetch.success to true", () => {
        expect(mockFetchSpan.setAttribute).toHaveBeenCalledWith("ota.fetch.success", true);
      });

      it("sets the update id attribute", () => {
        expect(mockFetchSpan.setAttribute).toHaveBeenCalledWith("ota.fetch.update.id", "update-abc");
      });

      it("sets the session outcome to downloaded", () => {
        expect(mockSessionSpan.setAttribute).toHaveBeenCalledWith("ota.session.outcome", "downloaded");
      });
    });

    describe("when the new update manifest includes createdAt", () => {
      it("sets the ota.fetch.manifest.created_at attribute", async () => {
        const manifest = { id: "update-abc", createdAt: "2024-01-15T10:30:00Z" };

        await session.trackFetch(() => Promise.resolve({ isNew: true, isRollBackToEmbedded: false, manifest }));

        expect(mockFetchSpan.setAttribute).toHaveBeenCalledWith(
          "ota.fetch.manifest.created_at",
          "2024-01-15T10:30:00Z",
        );
      });
    });

    describe("when the result is a rollback-to-embedded", () => {
      it("sets the session outcome to rollback_to_embedded", async () => {
        await session.trackFetch(() => Promise.resolve({ isNew: false, isRollBackToEmbedded: true }));

        expect(mockSessionSpan.setAttribute).toHaveBeenCalledWith("ota.session.outcome", "rollback_to_embedded");
      });
    });

    describe("when there is no change", () => {
      it("sets the session outcome to no_change", async () => {
        await session.trackFetch(() => Promise.resolve({ isNew: false, isRollBackToEmbedded: false }));

        expect(mockSessionSpan.setAttribute).toHaveBeenCalledWith("ota.session.outcome", "no_change");
      });
    });
  });

  describe("recordError", () => {
    let session;

    beforeEach(() => {
      session = startOtaSession();
    });

    it("records the exception on the session span", () => {
      const error = new Error("network timeout");

      session.recordError(error);

      expect(mockSessionSpan.recordException).toHaveBeenCalledWith(error);
    });

    it("sets the session span status to ERROR", () => {
      const error = new Error("network timeout");

      session.recordError(error);

      expect(mockSessionSpan.setStatus).toHaveBeenCalledWith({ code: 2, message: "network timeout" });
    });

    it("sets the session outcome to error", () => {
      const error = new Error("network timeout");

      session.recordError(error);

      expect(mockSessionSpan.setAttribute).toHaveBeenCalledWith("ota.session.outcome", "error");
    });
  });

  describe("end", () => {
    it("ends the session span", () => {
      const session = startOtaSession();

      session.end();

      expect(mockSessionSpan.end).toHaveBeenCalled();
    });
  });
});
