import { KeyboardKeysMap, KeyboardSeparator, KEYBOARD_KEYS_VALUES } from "@ppb/the-wall-common/types";

const deleteAll = "";

const deleteChar = (value: string): string => value.substring(0, value.length - 1);

/**
 * @name updateInputValue
 * @description
 * Function that maps the keyboard pressed key and
 * returns a new value to be appended to an input
 * element.
 *
 * @param {string} value Original input value
 * @param {KeyboardKeysMap} key Keyboard key pressed
 * @param {boolean} isLongPress If the keyboard key was long pressed
 * @param {KeyboardSeparator} separator Separator used based on user locale
 *
 * @returns {string} Updated input value with keyboard interaction
 */
export const updateInputValue = (
  value: string,
  key: KeyboardKeysMap,
  isLongPress: boolean,
  separator = KeyboardSeparator.Dot,
): string => {
  if (key === KeyboardKeysMap.DELETE) {
    return isLongPress ? deleteAll : deleteChar(value);
  }

  if (key === KeyboardKeysMap.SEPARATOR) {
    // Treat the other separator as a grouping separator and ignore it
    // when checking for an existing decimal separator. This avoids
    // blocking the decimal key when the displayed value contains
    // thousands/grouping separators (e.g. "1,000").
    const groupingSeparator = separator === KeyboardSeparator.Dot ? KeyboardSeparator.Comma : KeyboardSeparator.Dot;
    const numericWithoutGrouping = value.split(groupingSeparator).join("");
    const hasDecimalSeparator = numericWithoutGrouping.includes(separator);

    if (hasDecimalSeparator) {
      return value;
    }

    return `${value}${separator}`;
  }

  return `${value}${KEYBOARD_KEYS_VALUES[key]}`;
};
