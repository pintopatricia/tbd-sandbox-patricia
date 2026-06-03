import { act, renderHook } from "@testing-library/react";
import { useVisibilityObserver } from "./useVisibilityObserver.web";

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();
const node = {
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
};
const takeRecords = jest.fn(() => [{ target: { ...node, urn: "urn:2" } }]);

let onIntersectCb;

window.IntersectionObserver = jest.fn((callback) => {
  onIntersectCb = callback;

  return {
    observe,
    unobserve,
    disconnect,
    takeRecords,
  };
});

function setup({ onFirstShow, onShow, onHide } = {}, forceUpdate = false) {
  return renderHook(() =>
    useVisibilityObserver(
      {
        onFirstShow,
        onShow,
        onHide,
      },
      forceUpdate,
    ),
  );
}

describe("useVisibilityObserver", () => {
  beforeEach(jest.clearAllMocks);

  it("should observe every node that uses the callback reference", () => {
    const { result } = setup();

    const node1 = { ...node };
    const node2 = { ...node };
    const node3 = { ...node };

    result.current.observe(node1, "urn:1");
    result.current.observe(node2, "urn:2");
    result.current.observe(node3, "urn:3");

    expect(observe).toHaveBeenNthCalledWith(1, node1);
    expect(observe).toHaveBeenNthCalledWith(2, node2);
    expect(observe).toHaveBeenNthCalledWith(3, node3);
  });

  it("should call callback action when intersecting", () => {
    const fakeOnFirstShow = jest.fn();
    const fakeOnShow = jest.fn();
    const fakeOnHide = jest.fn();

    const node1 = { ...node };
    const node2 = { ...node };

    const { result } = setup({
      onShow: fakeOnShow,
      onHide: fakeOnHide,
      onFirstShow: fakeOnFirstShow,
    });

    result.current.observe(node1, "urn:1");
    result.current.observe(node2, "urn:2");

    act(() => {
      onIntersectCb([{ isIntersecting: true, target: node2 }]);
      onIntersectCb([{ isIntersecting: false, target: node1 }]);
    });

    expect(fakeOnShow).toHaveBeenCalledWith("urn:2");
    expect(fakeOnHide).not.toHaveBeenCalled();
    expect(fakeOnFirstShow).toHaveBeenCalledWith("urn:2");
  });

  it("should call callback onFirstShow only once", () => {
    const fakeOnFirstShow = jest.fn();

    const node1 = { ...node };

    const { result, rerender } = setup({
      onFirstShow: fakeOnFirstShow,
    });

    result.current.observe(node1, "urn:1");

    act(() => {
      onIntersectCb([{ isIntersecting: true, target: node1 }]);
      rerender();
    });

    act(() => {
      onIntersectCb([{ isIntersecting: true, target: node1 }]);
    });

    expect(fakeOnFirstShow).toHaveBeenCalledTimes(1);
  });

  it("should reset on force update", () => {
    const fakeOnFirstShow = jest.fn();

    const node1 = { ...node };

    const { result } = setup(
      {
        onFirstShow: fakeOnFirstShow,
      },
      true,
    );

    result.current.observe(node1, "urn:1");

    act(() => {
      onIntersectCb([{ isIntersecting: true, target: node1 }]);
    });

    expect(fakeOnFirstShow).toHaveBeenCalledTimes(1);
  });
});
