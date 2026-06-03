import type { FunctionComponent } from "react";
import { useCallback, useContext, useLayoutEffect, useMemo } from "react";
import * as React from "react";
import classNames from "classnames";

import { type KeyboardKeysMap, KeyboardSeparator } from "@ppb/the-wall-common/types";
import type { CustomKeyboardProps } from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";
import { Keyboard } from "@ppb/the-wall-web";

import { updateInputValue } from "./keyboard-mapper";
import { KeyboardContext } from "./KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";

import useDebounce from "../../../hooks/useDebounce";

import styles from "./FooterCustomKeyboard.web.css";

type Props = Omit<CustomKeyboardProps, "id"> & {
  className?: string;
  shouldScrollIntoView?: boolean;
  isSingleBetslip?: boolean;
};

const FOCUS_TARGET_DELAY = 100;
const DEBOUNCE_DELAY = 10;

export const FooterCustomKeyboard: FunctionComponent<Props> = ({
  prefix,
  separator = KeyboardSeparator.Dot,
  isDisabled,
  className,
  shouldScrollIntoView = false,
  isSingleBetslip = false,
}) => {
  const {
    focusedKeyboardControls: { focusedInputId, focusedInputRef, focusedTargetRef },
  } = useContext(KeyboardContext);
  const { isDesktopLayout } = useContext(ConfigContext);
  const isTouchDevice = useCallback(() => {
    const isTouchScreen = window.matchMedia("(any-pointer:coarse)").matches;
    const isMouseScreen = window.matchMedia("(any-pointer:fine)").matches;

    return !isDesktopLayout || (isTouchScreen && !isMouseScreen);
  }, [isDesktopLayout]);

  const debouncedFocusedInputId = useDebounce(focusedInputId, DEBOUNCE_DELAY);
  const debouncedFocusedTargetRef = useDebounce(focusedTargetRef, DEBOUNCE_DELAY);

  // move focus to keyboard's target element
  useLayoutEffect(() => {
    if (!debouncedFocusedTargetRef || !shouldScrollIntoView) return;

    setTimeout(
      () =>
        debouncedFocusedTargetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        }),
      FOCUS_TARGET_DELAY,
    );
  }, [debouncedFocusedTargetRef, shouldScrollIntoView]);

  const onKeyPress = useCallback(
    (key: KeyboardKeysMap, isLongPressed: boolean) => {
      if (focusedInputRef && !isDisabled) {
        focusedInputRef.current?.transformValue((currentValue) =>
          updateInputValue(currentValue, key, isLongPressed, separator),
        );
      }
    },
    [isDisabled, focusedInputRef, separator],
  );

  /**
   * When inputs lose focus, the keyboard should be hidden. However, the blur event on the input is triggered before the
   * click event on the target element, which can cause the keyboard to hide before the click event is processed and the
   * target element not to register the click. To prevent this, an artificial delay is added before hiding the keyboard,
   * allowing the click event to be processed first.
   */
  const isKeyboardOpen = isTouchDevice() && (debouncedFocusedInputId != null || isSingleBetslip);

  const KeyboardComponent = useMemo(
    () => (
      <div
        tabIndex={-1}
        className={classNames(styles.footerCustomKeyboard, {
          [styles.open]: isKeyboardOpen,
        })}
      >
        {prefix}
        <Keyboard separator={separator} isDisabled={isDisabled} onKeyPress={onKeyPress} />
      </div>
    ),
    [isKeyboardOpen, prefix, separator, isDisabled, onKeyPress],
  );

  const onMouseDown: React.MouseEventHandler = useCallback((evt) => {
    evt.preventDefault();
  }, []);

  return (
    <div className={className} onMouseDown={onMouseDown} role="presentation">
      {isKeyboardOpen ? KeyboardComponent : null}
    </div>
  );
};
