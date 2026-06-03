import { useState, useCallback, useContext, useEffect, useMemo, useRef } from "react";

import * as React from "react";
import { View, DeviceEventEmitter } from "react-native";

import {
  CUSTOM_KEYBOARD__INPUT_DISABLED,
  CUSTOM_KEYBOARD__INPUT_FOCUS,
  CUSTOM_KEYBOARD__VALUE_UPDATE,
  NativeCustomKeyboardInputDisabledPayload,
  NativeCustomKeyboardInputFocusPayload,
  NativeCustomKeyboardValueUpdatePayload,
} from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";

import { KeyboardSeparator, KeyboardKeysMap, KeyboardWrap, LayoutProps } from "@ppb/the-wall-common/types";

import { Keyboard } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { KeyboardContext } from "./KeyboardContext";
import { updateInputValue } from "./keyboard-mapper";
import { KEYBOARD_WRAPPER } from "./withKeyboard.native.selectors";

const isValidInput = ({ id, disabled }: NativeCustomKeyboardInputFocusPayload): boolean => !!id && !disabled;
const CUSTOM_KEYBOARD__INPUT_VALUE_RESET = "CUSTOM_KEYBOARD__INPUT_VALUE_RESET";

export const CUSTOM_KEYBOARD__EXTERNAL_VALUE_SYNC = "CUSTOM_KEYBOARD/EXTERNAL_VALUE_SYNC";

const DefaultLayoutComponent: React.FunctionComponent<LayoutProps> = ({ component, keyboard }) => (
  <>
    {component}
    {keyboard}
  </>
);

export function withKeyboardExc<U>(
  WrappedComponent: React.FunctionComponent<U>,
  options: {
    layout?: React.FunctionComponent<LayoutProps>;
  } = {},
): (props: U & KeyboardWrap) => React.ReactElement<U & KeyboardWrap> {
  const LayoutComponent = options.layout || DefaultLayoutComponent;

  return function KeyboardWrapper(props) {
    const {
      focusedKeyboardControls: { focusedInputId },
      setFocusedKeyboardControls,
    } = useContext(KeyboardContext);

    const inputRef = useRef<NativeCustomKeyboardInputFocusPayload | null>(null);
    const pendingResetRef = useRef<{ id: string; value: string } | null>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(
      () => () => {
        inputRef.current = null;
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: null,
          focusedInputRef: null,
        }));
      },
      [setFocusedKeyboardControls],
    );

    const handleInputFocus = useCallback(
      (input: NativeCustomKeyboardInputFocusPayload): void => {
        setIsDisabled(input.disabled ?? false);
        if (!isValidInput(input)) {
          return;
        }

        if (pendingResetRef.current && pendingResetRef.current.id === input.id) {
          const pendingValue = pendingResetRef.current.value;

          // Prefer incoming non-empty focus value over an empty pending reset.
          if (pendingValue === "" && input.value != null && `${input.value}` !== "") {
            inputRef.current = input;
          } else {
            inputRef.current = { ...input, value: pendingValue };
          }

          pendingResetRef.current = null;
        } else {
          inputRef.current = input;
        }

        const wrapperFocusedInputRef = {
          current: {
            transformValue: (fn: (currentValue: string) => string) => {
              const rawValue = inputRef.current?.value ?? "";
              const currentValue = typeof rawValue === "string" ? rawValue : `${rawValue}`;
              const next = fn(currentValue);
              if (inputRef.current) {
                inputRef.current.value = `${next}`;
                DeviceEventEmitter.emit(CUSTOM_KEYBOARD__VALUE_UPDATE, { id: inputRef.current.id, value: `${next}` });
              }
              return next;
            },
          },
        } as unknown as React.RefObject<any>;

        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: input.id,
          focusedInputRef: prev?.focusedInputRef ?? wrapperFocusedInputRef,
        }));
      },
      [setFocusedKeyboardControls, setIsDisabled],
    );

    useEffect(() => {
      const valueResetSubscription = DeviceEventEmitter.addListener(
        CUSTOM_KEYBOARD__INPUT_VALUE_RESET,
        ({ id, value }: { id: string; value: string }) => {
          pendingResetRef.current = { id, value };
        },
      );

      return () => {
        valueResetSubscription?.remove();
      };
    }, []);

    useEffect(() => {
      const eventSubscription = DeviceEventEmitter.addListener(CUSTOM_KEYBOARD__INPUT_FOCUS, handleInputFocus);
      const inputDisabledSubscription = DeviceEventEmitter.addListener(
        CUSTOM_KEYBOARD__INPUT_DISABLED,
        ({ id, disabled }: NativeCustomKeyboardInputDisabledPayload) => {
          if (id === focusedInputId) {
            setIsDisabled(disabled);
          }
        },
      );

      return () => {
        eventSubscription?.remove();
        inputDisabledSubscription?.remove();
      };
    }, [handleInputFocus, setIsDisabled, focusedInputId]);

    useEffect(() => {
      const valueUpdateSubscription = DeviceEventEmitter.addListener(
        CUSTOM_KEYBOARD__VALUE_UPDATE,
        ({ id: inputId, value: newValue }: NativeCustomKeyboardValueUpdatePayload) => {
          if (inputRef.current && inputRef.current.id === inputId) {
            inputRef.current.value = `${newValue}`;
          }
        },
      );

      const externalSyncSubscription = DeviceEventEmitter.addListener(
        CUSTOM_KEYBOARD__EXTERNAL_VALUE_SYNC,
        ({ id: inputId, value: newValue }: NativeCustomKeyboardValueUpdatePayload) => {
          if (inputRef.current && inputRef.current.id === inputId) {
            inputRef.current.value = `${newValue}`;
          }
        },
      );

      return () => {
        valueUpdateSubscription?.remove();
        externalSyncSubscription?.remove();
      };
    }, []);

    const keyboardSeparator = KeyboardSeparator.Dot;

    const handleOnKeyPress = useCallback((key: KeyboardKeysMap, isLongPress: boolean): void => {
      if (!inputRef.current || !!inputRef.current.disabled) {
        return;
      }

      if (pendingResetRef.current && pendingResetRef.current.id === inputRef.current.id) {
        inputRef.current.value = pendingResetRef.current.value;
        pendingResetRef.current = null;
      }

      const { id, value } = inputRef.current;
      const newValue = updateInputValue(`${value}`, key, isLongPress, keyboardSeparator);
      inputRef.current.value = newValue;

      const payload: NativeCustomKeyboardValueUpdatePayload = { id, value: newValue };
      DeviceEventEmitter.emit(CUSTOM_KEYBOARD__VALUE_UPDATE, payload);
    }, []);

    const KeyboardComponent = useMemo(
      () => <Keyboard separator={keyboardSeparator} isDisabled={isDisabled} onKeyPress={handleOnKeyPress} />,
      [handleOnKeyPress, isDisabled],
    );

    const isSameInputId = inputRef.current?.id === focusedInputId;

    return (
      <View {...getTestProps(KEYBOARD_WRAPPER, false)}>
        <LayoutComponent
          component={<WrappedComponent {...(props as React.PropsWithChildren<U>)} />}
          keyboard={isSameInputId ? KeyboardComponent : null}
        />
      </View>
    );
  };
}
