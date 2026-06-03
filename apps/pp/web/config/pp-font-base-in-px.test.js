import { initPPFontBaseinPx } from "./pp-font-base-in-px";

// Mock DOM methods
const mockSetProperty = jest.fn();
const mockRemoveProperty = jest.fn();
const mockGetPropertyValue = jest.fn();
const mockGetComputedStyle = jest.fn();

// Mock document.documentElement
Object.defineProperty(document, "documentElement", {
  value: {
    style: {
      setProperty: mockSetProperty,
      removeProperty: mockRemoveProperty,
    },
  },
  writable: true,
});

// Mock getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  value: mockGetComputedStyle,
  writable: true,
});

describe("initPPFontBaseinPx", () => {
  let mockStore;
  let mockUnsubscribe;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock unsubscribe function
    mockUnsubscribe = jest.fn();

    // Setup mock store
    mockStore = {
      getState: jest.fn(),
      subscribe: jest.fn().mockReturnValue(mockUnsubscribe),
    };

    // Setup default getComputedStyle mock
    mockGetComputedStyle.mockReturnValue({
      fontSize: "16px",
      getPropertyValue: mockGetPropertyValue,
    });

    mockGetPropertyValue.mockImplementation((prop) => {
      if (prop === "--page-px-base") return "14px";
      if (prop === "--page-px-min") return "12px";
      if (prop === "--page-px-max") return "24px";
      return "";
    });
  });

  describe("when throttle is initially active", () => {
    beforeEach(() => {
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });
    });

    it("should set up font scaling with fixed boundaries and scalable baseline", () => {
      initPPFontBaseinPx(mockStore);

      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-min-px", "12px");
      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-max-px", "24px");
      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "0.875"); // 14/16
      expect(mockSetProperty).toHaveBeenCalledTimes(3);
      expect(mockRemoveProperty).not.toHaveBeenCalled();
    });

    it("should subscribe to store changes", () => {
      const unsubscribe = initPPFontBaseinPx(mockStore);

      expect(mockStore.subscribe).toHaveBeenCalledTimes(1);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe("when throttle is initially inactive", () => {
    beforeEach(() => {
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: false,
            },
          },
        },
      });
    });

    it("should disable font scaling by locking all values to base size", () => {
      initPPFontBaseinPx(mockStore);

      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-min-px", "14px");
      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-max-px", "14px");
      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "0");
      expect(mockSetProperty).toHaveBeenCalledTimes(3);
      expect(mockRemoveProperty).not.toHaveBeenCalled();
    });
  });

  describe("when state changes", () => {
    it("should update font scaling when throttle becomes active", () => {
      // Start with inactive state
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: false,
            },
          },
        },
      });

      initPPFontBaseinPx(mockStore);

      // Clear the initial calls
      mockSetProperty.mockClear();
      mockRemoveProperty.mockClear();

      // Change to active state
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });

      // Trigger the subscription callback
      const subscriptionCallback = mockStore.subscribe.mock.calls[0][0];
      subscriptionCallback();

      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-min-px", "12px");
      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-max-px", "24px");
      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "0.875");
      expect(mockRemoveProperty).not.toHaveBeenCalled();
    });

    it("should disable font scaling when throttle becomes inactive", () => {
      // Start with active state
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });

      initPPFontBaseinPx(mockStore);

      // Clear the initial calls
      mockSetProperty.mockClear();
      mockRemoveProperty.mockClear();

      // Change to inactive state
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: false,
            },
          },
        },
      });

      // Trigger the subscription callback
      const subscriptionCallback = mockStore.subscribe.mock.calls[0][0];
      subscriptionCallback();

      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-min-px", "14px");
      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-max-px", "14px");
      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "0");
    });

    it("should not update when state remains the same", () => {
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });

      initPPFontBaseinPx(mockStore);

      // Clear the initial calls
      mockSetProperty.mockClear();
      mockRemoveProperty.mockClear();

      // Trigger the subscription callback with same state
      const subscriptionCallback = mockStore.subscribe.mock.calls[0][0];
      subscriptionCallback();

      expect(mockSetProperty).not.toHaveBeenCalled();
      expect(mockRemoveProperty).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle missing store state gracefully", () => {
      mockStore.getState.mockReturnValue(null);

      expect(() => initPPFontBaseinPx(mockStore)).not.toThrow();
    });

    it("should handle missing throttles gracefully", () => {
      mockStore.getState.mockReturnValue({
        entities: {},
      });

      expect(() => initPPFontBaseinPx(mockStore)).not.toThrow();
    });

    it("should handle missing ALLOW_FONT_SCALING throttle gracefully", () => {
      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {},
        },
      });

      expect(() => initPPFontBaseinPx(mockStore)).not.toThrow();
    });

    it("should work with different px token values and calculate correct factors", () => {
      // Mock different brand token values
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--page-px-base") return "16px";
        if (prop === "--page-px-min") return "10px";
        if (prop === "--page-px-max") return "28px";
        return "";
      });

      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });

      initPPFontBaseinPx(mockStore);

      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-min-px", "10px");
      expect(mockSetProperty).toHaveBeenCalledWith("--font-scale-max-px", "28px");
      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "1"); // 16/16 = 1
    });

    it("should handle missing CSS custom properties with fallback", () => {
      mockGetPropertyValue.mockReturnValue("");

      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: false,
            },
          },
        },
      });

      expect(() => initPPFontBaseinPx(mockStore)).not.toThrow();
    });

    it("should calculate brand base factor correctly for different brand bases", () => {
      // Test Betfair-like brand (13px base)
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--page-px-base") return "13px";
        if (prop === "--page-px-min") return "10px";
        if (prop === "--page-px-max") return "24px";
        return "";
      });

      mockStore.getState.mockReturnValue({
        entities: {
          throttles: {
            ALLOW_FONT_SCALING: {
              isActive: true,
            },
          },
        },
      });

      initPPFontBaseinPx(mockStore);

      expect(mockSetProperty).toHaveBeenCalledWith("--brand-base-factor", "0.8125"); // 13/16 = 0.8125
    });
  });
});
