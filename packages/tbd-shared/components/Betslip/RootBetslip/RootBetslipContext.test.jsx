import "jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";

import { useRootBetslip } from "./RootBetslipContext";

describe("RootBetslip", () => {
  beforeEach(jest.clearAllMocks);

  describe("API", () => {
    it("should expose a RootBetslipContextAPI context", () => {
      const { result } = renderHook(() => useRootBetslip(true));

      expect(result.current).toEqual({
        onCollapseListeners: [],
        registerCollapseListener: expect.any(Function),
        isBetConfirmationStep: false,
        setIsBetConfirmationStep: expect.any(Function),
      });
    });

    describe("registerCollapseListener", () => {
      it("should add listener", () => {
        const { result } = renderHook(() => useRootBetslip(true));
        const { onCollapseListeners, registerCollapseListener } = result.current;

        expect(onCollapseListeners.length).toBe(0);

        const spy = jest.fn();
        registerCollapseListener(spy);

        expect(onCollapseListeners.length).toBe(1);
        expect(onCollapseListeners[0]).toBe(spy);
      });

      it("should remove listener when calling deregister function", () => {
        const { result } = renderHook(() => useRootBetslip(true));
        const { onCollapseListeners, registerCollapseListener } = result.current;

        expect(onCollapseListeners.length).toBe(0);

        const deregister = registerCollapseListener(jest.fn());
        expect(onCollapseListeners.length).toBe(1);

        deregister();

        expect(onCollapseListeners.length).toBe(0);
      });
    });

    describe("when isCollapsed is true", () => {
      it("should call onCollapseListeners", () => {
        const { result, rerender } = renderHook(({ isCollapsed }) => useRootBetslip(isCollapsed), {
          initialProps: {
            isCollapsed: false,
          },
        });
        const { onCollapseListeners, registerCollapseListener } = result.current;

        expect(onCollapseListeners.length).toBe(0);

        const spies = [jest.fn(), jest.fn()];

        spies.forEach((spy) => registerCollapseListener(spy));

        rerender({ isCollapsed: true });

        expect(spies[0]).toHaveBeenCalledTimes(1);
        expect(spies[0]).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isCollapsed is false", () => {
      it("should not call onCollapseListeners", () => {
        const { result, rerender } = renderHook(({ isCollapsed }) => useRootBetslip(isCollapsed), {
          initialProps: {
            isCollapsed: true,
          },
        });
        const { onCollapseListeners, registerCollapseListener } = result.current;

        expect(onCollapseListeners.length).toBe(0);

        const spies = [jest.fn(), jest.fn()];

        spies.forEach((spy) => registerCollapseListener(spy));

        rerender({ isCollapsed: false });

        expect(spies[0]).not.toHaveBeenCalled();
        expect(spies[0]).not.toHaveBeenCalled();
      });
    });
  });
});
