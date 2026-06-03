import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  type JSX,
} from "react";

import * as React from "react";

import { KeyboardSeparator, KeyboardKeysMap, LayoutProps } from "@ppb/the-wall-common/types";

import { Keyboard } from "@ppb/the-wall-web";
import { useInputDisabledListener } from "@ppb/the-wall-web/hooks/useInputDisabledListener";

import { KeyboardContext } from "./KeyboardContext";
import { updateInputValue } from "./keyboard-mapper";
import { useWindowScrollIntoView } from "../../../hooks/useScrollIntoView.web";

const isValidInputNode = (e: React.FocusEvent<HTMLInputElement>): boolean => {
  if (!e?.target) {
    return false;
  }

  const { tagName, inputMode, readOnly, disabled } = e.target;
  return tagName === "INPUT" && inputMode === "none" && !readOnly && !disabled;
};

const DefaultLayoutComponent: FunctionComponent<LayoutProps> = ({ component, keyboard }) => (
  <>
    {component}
    {keyboard}
  </>
);

type KeyboardWrap = {
  keyboardPrefix?: JSX.Element;
  scrollIntoViewOptions?: Parameters<typeof useWindowScrollIntoView>[0];
};

export function withKeyboard<U>(
  WrappedComponent: FunctionComponent<U>,
  LayoutComponent: FunctionComponent<LayoutProps> = DefaultLayoutComponent,
): (props: U & KeyboardWrap) => React.ReactElement<U & KeyboardWrap> {
  return function KeyboardWrapper({ keyboardPrefix, scrollIntoViewOptions = { offset: 0 }, ...props }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
      focusedKeyboardControls: { focusedInputId },
      setFocusedKeyboardControls,
    } = useContext(KeyboardContext);
    const keyboardWrapperRef = useRef<HTMLDivElement | null>(null);
    const [keyboardNode, setKeyboardNode] = useState<HTMLDivElement | null>(null);

    const isDisabled = useInputDisabledListener(inputRef.current);
    const scrollIntoView = useWindowScrollIntoView(scrollIntoViewOptions);

    useLayoutEffect(() => {
      if (keyboardNode) {
        scrollIntoView(keyboardWrapperRef.current);
      }
    }, [scrollIntoView, keyboardNode, keyboardWrapperRef]);

    useEffect(
      () => () => {
        inputRef.current = null;
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: null,
        }));
      },
      [setFocusedKeyboardControls],
    );

    const handleOnFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>): void => {
        if (!isValidInputNode(e)) {
          return;
        }

        inputRef.current = e.target;
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: e.target.id,
        }));
      },
      [setFocusedKeyboardControls],
    );

    const handleOnKeyPress = useCallback((key: KeyboardKeysMap, isLongPress: boolean): void => {
      if (!inputRef.current || !!inputRef.current.disabled) {
        return;
      }

      const { value } = inputRef.current;
      const newValue = updateInputValue(value, key, isLongPress);

      inputRef.current.value = newValue;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }, []);

    const KeyboardComponent = useMemo(
      () => (
        <div ref={setKeyboardNode}>
          {keyboardPrefix}
          <Keyboard separator={KeyboardSeparator.Dot} isDisabled={isDisabled} onKeyPress={handleOnKeyPress} />
        </div>
      ),
      [handleOnKeyPress, isDisabled, keyboardPrefix],
    );

    return (
      <div ref={keyboardWrapperRef} onFocus={handleOnFocus}>
        <LayoutComponent
          component={<WrappedComponent {...(props as React.PropsWithChildren<U>)} />}
          keyboard={focusedInputId ? KeyboardComponent : null}
        />
      </div>
    );
  };
}
