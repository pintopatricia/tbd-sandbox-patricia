import type { FunctionComponent, RefObject } from "react";
import { useCallback, useContext } from "react";
import { View, type ViewStyle } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { type KeyboardKeysMap, KeyboardSeparator } from "@ppb/the-wall-common/types";
import { type CustomKeyboardProps } from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";
import type { NumberInputFieldHandles } from "@ppb/the-wall-common/types/InputsAndControls/NumberInputField.types";
import { Keyboard } from "@ppb/the-wall-native";

import { updateInputValue } from "./keyboard-mapper";
import { KeyboardContext } from "./KeyboardContext";
import { KEYBOARD_CONTAINER, KEYBOARD_WRAPPER } from "./withKeyboard.native.selectors";

type Props = Omit<CustomKeyboardProps, "children"> & {
  inputRef?: RefObject<NumberInputFieldHandles | null>;
  style?: ViewStyle;
  isSingleBetslip?: boolean;
};

export const FooterCustomKeyboard: FunctionComponent<Props> = ({
  prefix,
  separator = KeyboardSeparator.Dot,
  isDisabled,
  style,
  isSingleBetslip = false,
}) => {
  const {
    focusedKeyboardControls: { focusedInputRef, focusedInputId },
  } = useContext(KeyboardContext);

  const onKeyPress = useCallback(
    (key: KeyboardKeysMap, isLongPress: boolean): void => {
      if (focusedInputRef?.current !== null && !isDisabled) {
        focusedInputRef?.current.transformValue((currentValue: string) =>
          updateInputValue(currentValue, key, isLongPress, separator),
        );
      }
    },
    [isDisabled, focusedInputRef, separator],
  );

  const isKeyboardOpen = focusedInputId != null || isSingleBetslip;

  return (
    <View {...getTestProps(KEYBOARD_WRAPPER, false)} style={style}>
      {isKeyboardOpen ? (
        <View testID={KEYBOARD_CONTAINER}>
          {prefix}
          <Keyboard isDisabled={isDisabled} onKeyPress={onKeyPress} separator={separator} />
        </View>
      ) : null}
    </View>
  );
};
