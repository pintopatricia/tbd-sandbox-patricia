import { render, act } from "@testing-library/react-native";

import { useContext } from "react";
import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { Keyboard } from "@ppb/the-wall-native";
import { Text } from "react-native";
import { KeyboardProvider } from "./KeyboardContext";
import { FooterCustomKeyboard } from "./FooterCustomKeyboard.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

jest.mock("./keyboard-mapper", () => ({
  updateInputValue: jest.fn(() => "42"),
}));

const mockFocusedInputRef = {
  current: {
    transformValue: jest.fn(),
  },
};

const mockFocusedTargetRef = {
  current: {},
};

jest.mock("@ppb/the-wall-native", () => ({
  Keyboard: jest.fn(({ props }) => <keyboard-mock {...props} />),
  SCROLL_INTO_KEYBOARD_EVENT_NAME: "BETSLIP_SCROLL_INTO_KEYBOARD",
}));

function renderFooterCustomKeyboard({ id, prefix, separator = KeyboardSeparator.Dot, isDisabled = false, style } = {}) {
  return render(
    <KeyboardProvider>
      <FooterCustomKeyboard id={id} separator={separator} isDisabled={isDisabled} prefix={prefix} style={style} />
    </KeyboardProvider>,
  );
}

describe("FooterCustomKeyboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContext.mockImplementation(() => ({
      focusedKeyboardControls: {
        focusedInputRef: mockFocusedInputRef,
        focusedInputId: "test-input-id",
        focusedTargetRef: mockFocusedTargetRef,
      },
      setFocusedKeyboardControls: jest.fn(),
    }));
  });
  it("should render the prefix content", () => {
    const { queryByText } = renderFooterCustomKeyboard({ prefix: <Text>Test Prefix</Text> });
    expect(queryByText("Test Prefix")).not.toBeNull();
  });

  describe("Keyboard rendering", () => {
    it("should render Keyboard with correct props", () => {
      renderFooterCustomKeyboard();
      expect(Keyboard).toHaveBeenCalledWith(
        expect.objectContaining({
          separator: KeyboardSeparator.Dot,
          isDisabled: false,
          onKeyPress: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should use the provided separator", () => {
      renderFooterCustomKeyboard({ separator: KeyboardSeparator.Comma });

      expect(Keyboard).toHaveBeenCalledWith(
        expect.objectContaining({
          separator: KeyboardSeparator.Comma,
        }),
        undefined,
      );
    });
  });

  describe("Keyboard interaction", () => {
    it("should call transformValue when a key is pressed", () => {
      renderFooterCustomKeyboard();

      const keyboardProps = Keyboard.mock.calls[0][0];
      const mockKey = { value: "1" };

      act(() => {
        keyboardProps.onKeyPress(mockKey, false);
      });

      expect(mockFocusedInputRef.current.transformValue).toHaveBeenCalledWith(expect.any(Function));
    });
    it("should not call transformValue when disabled", () => {
      renderFooterCustomKeyboard({ isDisabled: true });

      const keyboardProps = Keyboard.mock.calls[0][0];
      const mockKey = { value: "1" };

      act(() => {
        keyboardProps.onKeyPress(mockKey, false);
      });

      expect(mockFocusedInputRef.current.transformValue).not.toHaveBeenCalled();
    });
  });
});
