import { renderHook, act } from "@testing-library/react";
import useViewportHeight from "./useViewportHeight.web";

// Mock the CSS object
global.CSS = {
  supports: jest.fn(),
};

const resize = () => {
  act(() => {
    global.dispatchEvent(new Event("resize"));
  });
};

const setup = (vh) => {
  global.innerHeight = vh;
  resize();
};

describe("useViewport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return innerHeight as vh value when svh is not supported", () => {
    global.CSS.supports.mockReturnValue(false);
    const { result } = renderHook(() => useViewportHeight());
    setup(768);

    expect(result.current.vh).toBe(768);
  });

  it("should not set vh when svh is supported", () => {
    global.CSS.supports.mockReturnValue(true);
    const { result } = renderHook(() => useViewportHeight());
    setup(768);

    expect(result.current.vh).toBeUndefined();
  });

  describe("when the window innerHeight changes", () => {
    it("should return new innerHeight as new vh value when svh is not supported", () => {
      global.CSS.supports.mockReturnValue(false);
      const { result } = renderHook(() => useViewportHeight());
      setup(768);

      global.innerHeight = 300;
      resize();

      expect(result.current.vh).toBe(300);
    });

    it("should not set vh when svh is supported and window innerHeight changes", () => {
      global.CSS.supports.mockReturnValue(true);
      const { result } = renderHook(() => useViewportHeight());
      setup(768);

      global.innerHeight = 300;
      resize();

      expect(result.current.vh).toBeUndefined();
    });
  });
});
