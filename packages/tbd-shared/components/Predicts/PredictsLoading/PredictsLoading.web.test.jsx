import { act, render } from "@testing-library/react";
import PredictsLoading from "./PredictsLoading.web";
import styles from "./PredictsLoading.web.css";
import {
  ANIMATION_END_BUFFER_MS,
  ANIMATION_TOTAL_MS,
  FADE_OUT_MS,
  PREDICTS_LOADING_LABEL,
} from "./PredictsLoading.config";

const matchMediaMock = (matches) =>
  jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

describe("PredictsLoading.web", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.matchMedia = matchMediaMock(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the dots and an initial NO label", () => {
    const { container, getByText } = render(<PredictsLoading isLoading onDismiss={jest.fn()} />);

    expect(getByText(PREDICTS_LOADING_LABEL.NO)).not.toBeNull();
    expect(container.querySelectorAll(`.${styles.dot}`).length).toBe(3);
  });

  it("applies the NO button-wrap modifier while showing NO", () => {
    const { container } = render(<PredictsLoading isLoading onDismiss={jest.fn()} />);

    const wrap = container.querySelector(`.${styles.buttonWrap}`);
    expect(wrap.className.includes(styles.buttonWrapNo)).toBe(true);
  });

  it("renders YES immediately when prefers-reduced-motion is set", () => {
    window.matchMedia = matchMediaMock(true);

    const { getByText } = render(<PredictsLoading isLoading onDismiss={jest.fn()} />);

    expect(getByText(PREDICTS_LOADING_LABEL.YES)).not.toBeNull();
  });

  it("does not call onDismiss while still loading", () => {
    const onDismiss = jest.fn();
    render(<PredictsLoading isLoading onDismiss={onDismiss} minDisplayMs={1000} />);

    act(() => {
      jest.advanceTimersByTime(ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS + FADE_OUT_MS + 1000);
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("calls onDismiss after animation, minDisplay and fade-out once loading is false", () => {
    const onDismiss = jest.fn();
    const { rerender } = render(<PredictsLoading isLoading onDismiss={onDismiss} minDisplayMs={500} />);

    act(() => {
      jest.advanceTimersByTime(ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    rerender(<PredictsLoading isLoading={false} onDismiss={onDismiss} minDisplayMs={500} />);

    act(() => {
      jest.advanceTimersByTime(FADE_OUT_MS);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("waits for minDisplayMs even after the animation and loading complete", () => {
    const onDismiss = jest.fn();
    render(<PredictsLoading isLoading={false} onDismiss={onDismiss} minDisplayMs={5000} />);

    act(() => {
      jest.advanceTimersByTime(ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS + FADE_OUT_MS);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    act(() => {
      jest.advanceTimersByTime(FADE_OUT_MS);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
