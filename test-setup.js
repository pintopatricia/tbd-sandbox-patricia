const noop = () => {};
Object.defineProperty(window, "EventSource", {
  value: jest.fn().mockReturnValue({ close: jest.fn() }),
  writable: true,
});
Object.defineProperty(window, "scrollTo", { value: noop, writable: true });
Object.defineProperty(window, "screen", {
  value: {
    orientation: {
      type: "mocked-orientation-type",
    },
  },
  writable: true,
});
Object.defineProperty(window, "matchMedia", {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true,
});
Object.defineProperty(navigator, "share", { value: noop, writable: true });
Object.defineProperty(window, "newrelic", {
  value: {
    noticeError: jest.fn(),
  },
  writable: true,
});
Object.defineProperty(window, "SplunkRum", {
  value: {
    error: jest.fn(),
  },
  writable: true,
});
