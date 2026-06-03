import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "./useNotifications";

jest.mock("../components/Betslip/betslip-mapper", () => ({
  isNotification: jest.fn().mockImplementation((notification) => !!notification),
}));

function renderUseNotifications(marketErrorNotification, placeErrorNotification, runner) {
  return renderHook(() => useNotifications(marketErrorNotification, placeErrorNotification, runner));
}

describe("useNotifications", () => {
  it("should be defined", () => {
    expect(useNotifications).toBeDefined();
  });

  describe("return object", () => {
    describe("addNotifications", () => {
      it("should be included in return object", () => {
        const { result } = renderUseNotifications();
        const { addNotifications } = result.current;

        expect(addNotifications).toBeDefined();
      });

      describe("when called", () => {
        it("should add a notification", () => {
          const { result } = renderUseNotifications();
          const { addNotifications, notifications } = result.current;

          expect(notifications).toEqual([]);

          act(() => {
            addNotifications({ market: { message: "someMarketNotification" } });
          });

          expect(result.current.notifications).toEqual([{ message: "someMarketNotification" }]);
        });

        it("should replace an existing notification", () => {
          const { result } = renderUseNotifications({ message: "someMarketNotification" });
          const { addNotifications, notifications } = result.current;

          expect(notifications).toEqual([{ message: "someMarketNotification" }]);

          act(() => {
            addNotifications({ market: { message: "someOtherMarketNotification" } });
          });

          expect(result.current.notifications).toEqual([{ message: "someOtherMarketNotification" }]);
        });
      });
    });

    describe("clearNotifications", () => {
      it("should be included in return object", () => {
        const { result } = renderUseNotifications();
        const { clearNotifications } = result.current;

        expect(clearNotifications).toBeDefined();
      });

      describe("when called with no parameters", () => {
        it("should clear all notifications", () => {
          const { result } = renderUseNotifications({ message: "someMarketNotification" });
          const { clearNotifications, notifications } = result.current;

          expect(notifications).toEqual([{ message: "someMarketNotification" }]);

          act(() => {
            clearNotifications();
          });

          expect(result.current.notifications).toEqual([]);
        });
      });

      describe("when called with some key", () => {
        it("should remove only that specific key from the notifications", () => {
          const { result } = renderUseNotifications({ message: "someMarketNotification" });
          const { clearNotifications, addNotifications, notifications } = result.current;

          expect(notifications).toEqual([{ message: "someMarketNotification" }]);

          act(() => {
            addNotifications({ place: { message: "somePlaceNotification" } });
          });

          expect(result.current.notifications).toEqual([
            { message: "someMarketNotification" },
            { message: "somePlaceNotification" },
          ]);

          act(() => {
            clearNotifications("market");
          });

          expect(result.current.notifications).toEqual([{ message: "somePlaceNotification" }]);
        });
      });
    });

    describe("notifications", () => {
      it("should be included in return object", () => {
        const { result } = renderUseNotifications({ message: "someMarketNotification" });

        expect(result.current.notifications).toEqual([{ message: "someMarketNotification" }]);
      });
    });

    describe("when runner is defined", () => {
      it("should add place notifications", () => {
        const { result, rerender } = renderHook(
          ({ marketErrorNotification, placeErrorNotification, runner }) =>
            useNotifications(marketErrorNotification, placeErrorNotification, runner),
          {
            initialProps: { placeErrorNotification: { message: "somePlaceNotification" } },
          },
        );

        expect(result.current.notifications).toEqual([]);

        rerender({ placeErrorNotification: { message: "somePlaceNotification" }, runner: "some_runner_urn" });

        expect(result.current.notifications).toEqual([{ message: "somePlaceNotification" }]);
      });
    });

    describe("when market error notifications are added", () => {
      it("should clear Price and Size notifications", () => {
        const { result, rerender } = renderHook(
          ({ marketErrorNotification, placeErrorNotification, runner }) =>
            useNotifications(marketErrorNotification, placeErrorNotification, runner),
          {
            initialProps: {},
          },
        );

        expect(result.current.notifications).toEqual([]);

        act(() => {
          result.current.addNotifications({
            price: { message: "somePriceNotification" },
            size: { message: "someSizeNotification" },
          });
        });

        expect(result.current.notifications).toEqual([
          { message: "somePriceNotification" },
          { message: "someSizeNotification" },
        ]);

        rerender({ marketErrorNotification: { message: "someMarketNotification" } });

        expect(result.current.notifications).toEqual([{ message: "someMarketNotification" }]);
      });
    });
  });
});
