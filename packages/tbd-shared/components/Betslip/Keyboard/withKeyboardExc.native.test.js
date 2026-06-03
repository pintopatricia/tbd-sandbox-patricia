import { Platform, View, Text, DeviceEventEmitter } from "react-native";
import { render, act } from "@testing-library/react-native";

import { KeyboardKeysMap, KeyboardSeparator } from "@ppb/the-wall-common/types";
import {
  CUSTOM_KEYBOARD__INPUT_DISABLED,
  CUSTOM_KEYBOARD__INPUT_FOCUS,
  CUSTOM_KEYBOARD__VALUE_UPDATE,
} from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";
import { Keyboard } from "@ppb/the-wall-native";
import { updateInputValue } from "./keyboard-mapper";

import { KeyboardProvider } from "./KeyboardContext";
import { withKeyboardExc } from "./withKeyboardExc.native";

const CUSTOM_KEYBOARD__INPUT_VALUE_RESET = "CUSTOM_KEYBOARD__INPUT_VALUE_RESET";

jest.mock("@ppb/the-wall-native", () => ({
  Keyboard: jest.fn(() => <keyboard-mock />),
}));

jest.mock("./keyboard-mapper", () => ({
  updateInputValue: jest.fn(() => "mappedValue"),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

function WrappedComponent() {
  return (
    <View testID="wrapped-component">
      <Text testID="some-text">text</Text>
    </View>
  );
}

function LayoutComponent({ component, keyboard }) {
  return (
    <>
      {component}
      {keyboard}
    </>
  );
}

function renderWithKeyboard({ useCustomKeyboard = false, platform = "ios" } = {}) {
  Platform.OS = platform;

  const WrappedComponentWithKeyboard = withKeyboardExc(WrappedComponent, LayoutComponent);

  return render(
    <KeyboardProvider useCustomKeyboard={useCustomKeyboard}>
      <WrappedComponentWithKeyboard />
    </KeyboardProvider>,
  );
}

const INTERACTABLE_DELAY = 100;

const { OS } = Platform;

jest.useFakeTimers();

describe("withKeyboardExc", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DeviceEventEmitter.removeAllListeners();
  });

  afterAll(() => {
    Platform.OS = OS;
  });

  describe("when useCustomKeyboard is true and Platform is iOS", () => {
    describe("when an interactable input element is focused", () => {
      it("should call Keyboard", () => {
        const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

        act(() => {
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "value", disabled: false });
        });

        expect(Keyboard).toHaveBeenCalledWith(
          {
            separator: KeyboardSeparator.Dot,
            isDisabled: false,
            onKeyPress: expect.any(Function),
          },
          undefined,
        );
        expect(Keyboard).toHaveBeenCalledTimes(1);

        unmount();
      });

      describe("when a keyboard key is pressed", () => {
        it("should not dismiss Keyboard", () => {
          const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "value", disabled: false });
            jest.advanceTimersByTime(INTERACTABLE_DELAY);
          });

          Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

          expect(Keyboard).toHaveBeenCalledTimes(1);

          unmount();
        });

        it("should dispatch a CUSTOM_KEYBOARD__VALUE_UPDATE action", () => {
          jest.spyOn(DeviceEventEmitter, "emit");
          const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "value", disabled: false });
            jest.advanceTimersByTime(INTERACTABLE_DELAY);
          });

          Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

          expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(CUSTOM_KEYBOARD__VALUE_UPDATE, {
            id: "id",
            value: "mappedValue",
          });

          unmount();
        });

        it("should use latest cached value after external CUSTOM_KEYBOARD__VALUE_UPDATE", () => {
          const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "2", disabled: false });
            jest.advanceTimersByTime(INTERACTABLE_DELAY);
          });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__VALUE_UPDATE, { id: "id", value: "50" });
          });

          Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

          expect(updateInputValue).toHaveBeenCalledWith("50", KeyboardKeysMap.ONE, undefined, KeyboardSeparator.Dot);

          unmount();
        });

        it("should ignore external CUSTOM_KEYBOARD__VALUE_UPDATE for a different input id", () => {
          const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "2", disabled: false });
            jest.advanceTimersByTime(INTERACTABLE_DELAY);
          });

          act(() => {
            DeviceEventEmitter.emit(CUSTOM_KEYBOARD__VALUE_UPDATE, { id: "other-id", value: "50" });
          });

          Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

          expect(updateInputValue).toHaveBeenCalledWith("2", KeyboardKeysMap.ONE, undefined, KeyboardSeparator.Dot);

          unmount();
        });
      });
    });

    describe("when a non-interactable input element is focused", () => {
      it("should call Keyboard", () => {
        const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

        act(() => {
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { disabled: true });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        expect(Keyboard).not.toHaveBeenCalled();

        unmount();
      });
    });

    describe("when input disabled state changes", () => {
      it("should call Keyboard with disabled state updated", () => {
        const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

        act(() => {
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "value", disabled: false });
          jest.advanceTimersByTime();
        });

        act(() => {
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_DISABLED, { id: "id", disabled: true });
          jest.advanceTimersByTime();
        });

        act(() => {
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_DISABLED, { id: "id", disabled: false });
          jest.advanceTimersByTime();
        });

        expect(Keyboard).toHaveBeenCalledTimes(3);
        expect(Keyboard).toHaveBeenNthCalledWith(
          1,
          {
            separator: KeyboardSeparator.Dot,
            isDisabled: false,
            onKeyPress: expect.any(Function),
          },
          undefined,
        );
        expect(Keyboard).toHaveBeenNthCalledWith(
          2,
          {
            separator: KeyboardSeparator.Dot,
            isDisabled: true,
            onKeyPress: expect.any(Function),
          },
          undefined,
        );
        expect(Keyboard).toHaveBeenNthCalledWith(
          3,
          {
            separator: KeyboardSeparator.Dot,
            isDisabled: false,
            onKeyPress: expect.any(Function),
          },
          undefined,
        );

        unmount();
      });
    });

    describe("when value reset is emitted", () => {
      it("should store pending reset and apply on next focus event", () => {
        jest.spyOn(DeviceEventEmitter, "emit");
        const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

        act(() => {
          // Initial focus with old value
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "oldValue", disabled: false });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        act(() => {
          // Emit reset event to clear the value
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, { id: "id", value: "" });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        act(() => {
          // Next focus event should apply the reset value
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "oldValue", disabled: false });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        // Press a key - should start from empty value, not old value
        Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

        expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(CUSTOM_KEYBOARD__VALUE_UPDATE, {
          id: "id",
          value: "mappedValue",
        });

        unmount();
      });

      it("should apply pending reset on key press if no focus event received", () => {
        jest.spyOn(DeviceEventEmitter, "emit");
        const { unmount } = renderWithKeyboard({ useCustomKeyboard: true });

        act(() => {
          // Initial focus with old value
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_FOCUS, { id: "id", value: "oldValue", disabled: false });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        act(() => {
          // Emit reset event to clear the value
          DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, { id: "id", value: "" });
          jest.advanceTimersByTime(INTERACTABLE_DELAY);
        });

        // Press a key without another focus event - should still start from empty value
        Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

        expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(CUSTOM_KEYBOARD__VALUE_UPDATE, {
          id: "id",
          value: "mappedValue",
        });

        unmount();
      });
    });
  });

  describe("when useCustomKeyboard is false or Platform is not iOS", () => {
    it("should not call Keyboard", () => {
      const { unmount } = renderWithKeyboard({ useCustomKeyboard: false, platform: "android" });

      expect(Keyboard).not.toHaveBeenCalled();

      unmount();
    });
  });
});
