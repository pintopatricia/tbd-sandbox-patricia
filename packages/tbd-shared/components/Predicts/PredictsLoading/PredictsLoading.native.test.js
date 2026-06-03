import { act, render } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

import PredictsLoading from "./PredictsLoading.native";
import {
  ANIMATION_END_BUFFER_MS,
  ANIMATION_TOTAL_MS,
  FADE_OUT_MS,
  PREDICTS_LOADING_LABEL,
} from "./PredictsLoading.config";

const flushReducedMotionPromise = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe("PredictsLoading.native", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders the slot column with all labels and the loading screen", async () => {
    const { getAllByText, getByTestId } = render(<PredictsLoading isLoading onDismiss={jest.fn()} />);
    await flushReducedMotionPromise();

    expect(getAllByText(PREDICTS_LOADING_LABEL.NO).length).toBeGreaterThan(0);
    expect(getAllByText(PREDICTS_LOADING_LABEL.YES).length).toBeGreaterThan(0);
    expect(getByTestId("predicts-loading-screen")).toBeTruthy();
  });

  it("renders the slot column when reduced motion is enabled", async () => {
    AccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);

    const { getAllByText, getByTestId } = render(<PredictsLoading isLoading onDismiss={jest.fn()} />);
    await flushReducedMotionPromise();

    expect(getAllByText(PREDICTS_LOADING_LABEL.YES).length).toBeGreaterThan(0);
    expect(getByTestId("predicts-loading-screen")).toBeTruthy();
  });

  it("does not dismiss while still loading", async () => {
    const onDismiss = jest.fn();
    render(<PredictsLoading isLoading onDismiss={onDismiss} minDisplayMs={500} />);
    await flushReducedMotionPromise();

    act(() => {
      jest.advanceTimersByTime(ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS + FADE_OUT_MS + 1000);
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("dismisses after animation completes, loading is false and minDisplay has elapsed", async () => {
    AccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);
    const onDismiss = jest.fn();

    const { rerender } = render(<PredictsLoading isLoading onDismiss={onDismiss} minDisplayMs={300} />);
    await flushReducedMotionPromise();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    rerender(<PredictsLoading isLoading={false} onDismiss={onDismiss} minDisplayMs={300} />);

    act(() => {
      jest.advanceTimersByTime(FADE_OUT_MS);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
