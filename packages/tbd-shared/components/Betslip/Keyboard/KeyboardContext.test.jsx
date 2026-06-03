import { renderHook } from "@testing-library/react";
import "jest-dom/extend-expect";

import { KeyboardContext, KeyboardProvider } from "./KeyboardContext";

function renderKeyboardProvider({ children = "children" } = {}) {
  const { result } = renderHook(() => KeyboardProvider({ children }));

  return result;
}

describe("KeyboardContext", () => {
  it("should create context with default values", () => {
    expect(KeyboardContext._currentValue).toEqual({
      focusedKeyboardControls: {
        focusedCombinationId: null,
        focusedInputId: null,
        focusedInputRef: null,
        focusedTargetRef: null,
      },
      setFocusedKeyboardControls: expect.any(Function),
    });
  });
});

describe("KeyboardProvider", () => {
  it("should have expected values", () => {
    const result = renderKeyboardProvider();

    expect(result.current.props.value).toEqual({
      focusedKeyboardControls: {
        focusedCombinationId: null,
        focusedInputId: null,
        focusedInputRef: null,
        focusedTargetRef: null,
      },
      setFocusedKeyboardControls: expect.any(Function),
    });
  });

  it("should have expected children", () => {
    const result = renderKeyboardProvider();

    expect(result.current.props.children).toEqual("children");
  });
});
