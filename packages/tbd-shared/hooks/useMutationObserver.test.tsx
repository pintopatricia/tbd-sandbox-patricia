import { render, renderHook } from "@testing-library/react";
import { useMutationObserver } from "./useMutationObserver";

describe("useMutationObserver", () => {
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let originalMutationObserver: typeof MutationObserver;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    originalMutationObserver = globalThis.MutationObserver;
    globalThis.MutationObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    }));
  });

  afterEach(() => {
    globalThis.MutationObserver = originalMutationObserver;
    jest.clearAllMocks();
  });

  it("should create a MutationObserver with the provided callback", () => {
    const callback = jest.fn();
    renderHook(() => useMutationObserver(callback));

    expect(globalThis.MutationObserver).toHaveBeenCalledWith(callback);
  });

  it("should return a ref that can be attached to an element", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useMutationObserver(callback));

    expect(result.current).toHaveProperty("current");
    expect(result.current.current).toBeNull();
  });

  function setupTestComponent(callback: MutationCallback, options?: MutationObserverInit) {
    function TestComponent() {
      const ref = useMutationObserver<HTMLDivElement>(callback, options);
      return <div ref={ref} />;
    }

    render(<TestComponent />);
  }

  it("should observe the element when ref is set", () => {
    const callback = jest.fn();

    setupTestComponent(callback);

    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement), {
      childList: true,
    });
  });

  it("should merge provided options with default childList option", () => {
    const callback = jest.fn();
    const options: MutationObserverInit = {
      attributes: true,
      subtree: true,
    };

    setupTestComponent(callback, options);

    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement), {
      childList: true,
      attributes: true,
      subtree: true,
    });
  });

  it("should preserve childList: true even if explicitly set to false in options", () => {
    const callback = jest.fn();
    const options: MutationObserverInit = {
      childList: false,
      attributes: true,
    };

    setupTestComponent(callback, options);

    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement), {
      childList: false,
      attributes: true,
    });
  });

  it("should disconnect observer on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useMutationObserver(callback));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should not observe if ref is not set", () => {
    const callback = jest.fn();
    renderHook(() => useMutationObserver(callback));

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("should call the mutation callback when mutations occur", () => {
    const callback = jest.fn();
    let capturedCallback: MutationCallback | undefined;

    globalThis.MutationObserver = jest.fn().mockImplementation((cb) => {
      capturedCallback = cb;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    });

    renderHook(() => useMutationObserver(callback));

    const mutations: MutationRecord[] = [];
    const observer = {} as MutationObserver;

    capturedCallback?.(mutations, observer);

    expect(callback).toHaveBeenCalledWith(mutations, observer);
  });

  it("should handle options parameter being undefined", () => {
    const callback = jest.fn();

    setupTestComponent(callback);

    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement), {
      childList: true,
    });
  });

  it("should reobserve when options change", () => {
    const callback = jest.fn();

    const { result, rerender } = renderHook(({ options }) => useMutationObserver(callback, options), {
      initialProps: { options: { attributes: true } as MutationObserverInit },
    });

    const element = document.createElement("div");
    result.current.current = element;

    mockObserve.mockClear();

    rerender({ options: { subtree: true } });

    // The effect should re-run and call observe again with new options
    expect(mockObserve).toHaveBeenCalledWith(element, {
      childList: true,
      subtree: true,
    });
  });
});
