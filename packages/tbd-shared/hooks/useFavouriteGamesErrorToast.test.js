import { renderHook, act, waitFor } from "@testing-library/react";
import { useFavouriteGamesErrorToast } from "./useFavouriteGamesErrorToast";

describe("useFavouriteGamesErrorToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should not show toast when there is no error timestamp", () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: null,
        errorGameId: null,
        gameId: "game-1",
      }),
    );

    expect(result.current.isVisible).toBe(false);
  });

  it("should not show toast when errorGameId does not match gameId", () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: 123456,
        errorGameId: "game-2",
        gameId: "game-1",
      }),
    );

    expect(result.current.isVisible).toBe(false);
  });

  it("should show toast when timestamp is present and gameId matches", () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: 123456,
        errorGameId: "game-1",
        gameId: "game-1",
        autoHideDuration: 3000,
      }),
    );

    expect(result.current.isVisible).toBe(true);
  });

  it("should auto-hide toast after autoHideDuration", async () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: 123456,
        errorGameId: "game-1",
        gameId: "game-1",
        autoHideDuration: 3000,
      }),
    );

    expect(result.current.isVisible).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.isVisible).toBe(false);
    });
  });

  it("should hide toast immediately when hideToast is called", () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: 123456,
        errorGameId: "game-1",
        gameId: "game-1",
        autoHideDuration: 5000,
      }),
    );

    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.isVisible).toBe(false);
  });

  it("should not show the same error twice (same timestamp)", async () => {
    const { result, rerender } = renderHook(
      ({ errorTimestamp, errorGameId, gameId }) =>
        useFavouriteGamesErrorToast({
          errorTimestamp,
          errorGameId,
          gameId,
        }),
      {
        initialProps: {
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
        },
      },
    );

    expect(result.current.isVisible).toBe(true);

    // Auto-hide after duration
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.isVisible).toBe(false);
    });

    // Re-render with the same timestamp (simulates Redux update with same error)
    rerender({
      errorTimestamp: 123456, // Same timestamp
      errorGameId: "game-1",
      gameId: "game-1",
    });

    // Should still be hidden (already shown this error)
    expect(result.current.isVisible).toBe(false);
  });

  it("should show a new error when timestamp changes", async () => {
    const { result, rerender } = renderHook(
      ({ errorTimestamp, errorGameId, gameId }) =>
        useFavouriteGamesErrorToast({
          errorTimestamp,
          errorGameId,
          gameId,
        }),
      {
        initialProps: {
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
        },
      },
    );

    expect(result.current.isVisible).toBe(true);

    // Auto-hide
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.isVisible).toBe(false);
    });

    // Re-render with NEW timestamp (new error occurred)
    rerender({
      errorTimestamp: 789012, // Different timestamp
      errorGameId: "game-1",
      gameId: "game-1",
    });

    // Should show again because it's a new error
    expect(result.current.isVisible).toBe(true);
  });

  it("should use custom autoHideDuration when provided", async () => {
    const { result } = renderHook(() =>
      useFavouriteGamesErrorToast({
        errorTimestamp: 123456,
        errorGameId: "game-1",
        gameId: "game-1",
        autoHideDuration: 5000, // Custom duration
      }),
    );

    expect(result.current.isVisible).toBe(true);

    // Should still be visible after 3000ms
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.isVisible).toBe(true);

    // Should hide after full 5000ms
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.isVisible).toBe(false);
    });
  });

  describe("onDismiss callback", () => {
    it("should call onDismiss when toast auto-hides", async () => {
      const onDismiss = jest.fn();

      renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 3000,
          onDismiss,
        }),
      );

      expect(onDismiss).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    it("should call onDismiss when hideToast is called manually", () => {
      const onDismiss = jest.fn();

      const { result } = renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 5000,
          onDismiss,
        }),
      );

      expect(onDismiss).not.toHaveBeenCalled();

      act(() => {
        result.current.hideToast();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("should only call onDismiss once even if hideToast is called multiple times", () => {
      const onDismiss = jest.fn();

      const { result } = renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 5000,
          onDismiss,
        }),
      );

      act(() => {
        result.current.hideToast();
      });

      act(() => {
        result.current.hideToast();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("should only call onDismiss once when hideToast is called before auto-hide", async () => {
      const onDismiss = jest.fn();

      const { result } = renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 3000,
          onDismiss,
        }),
      );

      // Manually hide before auto-hide triggers
      act(() => {
        result.current.hideToast();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);

      // Run remaining timers (auto-hide would have triggered)
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      // Should still only be called once
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("should call onDismiss again for a new error after the first was dismissed", () => {
      const onDismiss = jest.fn();

      const { result, rerender } = renderHook(
        ({ errorTimestamp, errorGameId, gameId, onDismiss: onDismissCallback }) =>
          useFavouriteGamesErrorToast({
            errorTimestamp,
            errorGameId,
            gameId,
            autoHideDuration: 3000,
            onDismiss: onDismissCallback,
          }),
        {
          initialProps: {
            errorTimestamp: 123456,
            errorGameId: "game-1",
            gameId: "game-1",
            onDismiss,
          },
        },
      );

      // Dismiss first error
      act(() => {
        result.current.hideToast();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);

      // New error occurs
      rerender({
        errorTimestamp: 789012, // Different timestamp
        errorGameId: "game-1",
        gameId: "game-1",
        onDismiss,
      });

      expect(result.current.isVisible).toBe(true);

      // Dismiss second error
      act(() => {
        result.current.hideToast();
      });

      expect(onDismiss).toHaveBeenCalledTimes(2);
    });

    it("should not throw when onDismiss is not provided and toast auto-hides", async () => {
      const { result } = renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 3000,
        }),
      );

      expect(result.current.isVisible).toBe(true);

      // Should not throw when auto-hide triggers without onDismiss
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.isVisible).toBe(false);
      });
    });

    it("should not throw when hideToast is called without onDismiss", () => {
      const { result } = renderHook(() =>
        useFavouriteGamesErrorToast({
          errorTimestamp: 123456,
          errorGameId: "game-1",
          gameId: "game-1",
          autoHideDuration: 5000,
        }),
      );

      // Should not throw
      act(() => {
        result.current.hideToast();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe("error state reset", () => {
    it("should hide toast when errorTimestamp becomes null", () => {
      const { result, rerender } = renderHook(
        ({ errorTimestamp, errorGameId, gameId }) =>
          useFavouriteGamesErrorToast({
            errorTimestamp,
            errorGameId,
            gameId,
          }),
        {
          initialProps: {
            errorTimestamp: 123456,
            errorGameId: "game-1",
            gameId: "game-1",
          },
        },
      );

      expect(result.current.isVisible).toBe(true);

      // Error state is cleared (e.g., CLEAR_USER_FAVOURITE_GAMES_ERROR dispatched)
      rerender({
        errorTimestamp: null,
        errorGameId: null,
        gameId: "game-1",
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("should hide toast when errorGameId changes to a different game", () => {
      const { result, rerender } = renderHook(
        ({ errorTimestamp, errorGameId, gameId }) =>
          useFavouriteGamesErrorToast({
            errorTimestamp,
            errorGameId,
            gameId,
          }),
        {
          initialProps: {
            errorTimestamp: 123456,
            errorGameId: "game-1",
            gameId: "game-1",
          },
        },
      );

      expect(result.current.isVisible).toBe(true);

      // Error for a different game
      rerender({
        errorTimestamp: 789012,
        errorGameId: "game-2", // Different game
        gameId: "game-1",
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("should clear timer when error state is reset", async () => {
      const onDismiss = jest.fn();

      const { rerender } = renderHook(
        ({ errorTimestamp, errorGameId, gameId, onDismiss: onDismissCallback }) =>
          useFavouriteGamesErrorToast({
            errorTimestamp,
            errorGameId,
            gameId,
            autoHideDuration: 5000,
            onDismiss: onDismissCallback,
          }),
        {
          initialProps: {
            errorTimestamp: 123456,
            errorGameId: "game-1",
            gameId: "game-1",
            onDismiss,
          },
        },
      );

      // Error state is cleared before auto-hide
      rerender({
        errorTimestamp: null,
        errorGameId: null,
        gameId: "game-1",
        onDismiss,
      });

      // Run all timers - onDismiss should NOT be called because timer was cleared
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
