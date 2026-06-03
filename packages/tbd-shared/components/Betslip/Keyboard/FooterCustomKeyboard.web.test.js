import { screen, render, act } from "@testing-library/react";

import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { Keyboard } from "@ppb/the-wall-web";
import { KeyboardContext } from "./KeyboardContext";
import { FooterCustomKeyboard } from "./FooterCustomKeyboard.web";
import { ConfigContext } from "../../Config/ConfigContext";

jest.mock("./keyboard-mapper", () => ({
  updateInputValue: jest.fn(() => "42"),
}));

const mockFocusedInputRef = {
  current: {
    transformValue: jest.fn(),
  },
};

const mockFocusedTargetRef = {
  current: {
    scrollIntoView: jest.fn(),
  },
};

jest.mock("@ppb/the-wall-web", () => ({
  Keyboard: jest.fn(({ props }) => <keyboard-mock {...props} />),
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation(() => ({
      matches: false,
    })),
  });
});

const MockProvider = ({ children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout: true }}>
    <KeyboardContext.Provider
      value={{
        focusedKeyboardControls: {
          focusedInputId: "test-input-id",
          focusedInputRef: mockFocusedInputRef,
          focusedTargetRef: mockFocusedTargetRef,
        },
      }}
    >
      {children}
    </KeyboardContext.Provider>
  </ConfigContext.Provider>
);

const renderFooterCustomKeyboard = ({
  id = "1234",
  separator = KeyboardSeparator.Dot,
  prefix,
  isDisabled = false,
  className = "test-class",
  shouldScrollIntoView = true,
  isSingleBetslip = false,
} = {}) => {
  return render(
    <FooterCustomKeyboard
      id={id}
      separator={separator}
      isDisabled={isDisabled}
      prefix={prefix}
      className={className}
      shouldScrollIntoView={shouldScrollIntoView}
      isSingleBetslip={isSingleBetslip}
    />,
    {
      wrapper: MockProvider,
    },
  );
};

beforeEach(() => {
  jest.clearAllMocks();

  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === "(any-pointer:coarse)",
  }));
});

describe("FooterCustomKeyboard", () => {
  it("should render with the provided className", () => {
    const { container } = renderFooterCustomKeyboard();
    expect(container.firstChild.className).toContain("test-class");
  });

  it("should render the prefix content", () => {
    renderFooterCustomKeyboard({ prefix: <span>Test Prefix</span> });
    expect(screen.queryByText("Test Prefix")).not.toBeNull();
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

    it("should not render the keyboard component if is not a touch device", () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(any-pointer:fine)",
      }));

      renderFooterCustomKeyboard();

      expect(Keyboard).not.toHaveBeenCalled();
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

  describe("Keyboard focus behavior", () => {
    it("should scroll focused target into view after delay", () => {
      jest.useFakeTimers();
      renderFooterCustomKeyboard();

      act(() => jest.runAllTimers());

      expect(mockFocusedTargetRef.current.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "end",
      });

      jest.useRealTimers();
    });

    it("should not scroll into view", () => {
      renderFooterCustomKeyboard({ shouldScrollIntoView: false });

      expect(mockFocusedTargetRef.current.scrollIntoView).not.toHaveBeenCalled();
    });
  });
});
