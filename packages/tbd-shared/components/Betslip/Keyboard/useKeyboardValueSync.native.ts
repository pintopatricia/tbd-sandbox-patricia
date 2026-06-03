import { useEffect, useRef } from "react";
import { DeviceEventEmitter } from "react-native";

import { CUSTOM_KEYBOARD__EXTERNAL_VALUE_SYNC } from "./withKeyboardExc.native";

/**
 * Keeps the custom keyboard wrapper's tracked value in sync with a controlled
 * input's `value` prop. Emit a sync event whenever the value changes from any
 * source other than the keyboard itself (nudge, quick stake, programmatic
 * redux update). Without this, the wrapper's internal `inputRef.current.value`
 * goes stale, and the next keypress appends to the old value.
 *
 * Why: the wrapper holds its own copy of the value (updated on focus or on
 * `CUSTOM_KEYBOARD__VALUE_UPDATE`). Prop-driven mutations sync the input's
 * displayed value but not the wrapper's copy. This hook closes that gap
 * generically — any future non-keyboard mutation is covered automatically.
 */
export function useKeyboardValueSync(id: string | undefined, value: number | undefined): void {
  const prevValueRef = useRef<number | undefined>(value);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (prevValueRef.current === value) {
      return;
    }

    prevValueRef.current = value;
    DeviceEventEmitter.emit(CUSTOM_KEYBOARD__EXTERNAL_VALUE_SYNC, {
      id,
      value: value == null ? "" : `${value}`,
    });
  }, [id, value]);
}
