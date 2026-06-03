import { NumberInputFieldHandles } from "@ppb/the-wall-common/types/InputsAndControls/NumberInputField.types";

import { FunctionComponent, createContext, useState, useMemo, RefObject } from "react";

import * as React from "react";

type KeyboardContextProps = {
  focusedKeyboardControls: FocusedKeyboardControls;
  setFocusedKeyboardControls: (
    update: FocusedKeyboardControls | ((prev: FocusedKeyboardControls) => FocusedKeyboardControls),
  ) => void;
};

export const KeyboardContext = createContext<KeyboardContextProps>({
  focusedKeyboardControls: {
    focusedCombinationId: null,
    focusedInputId: null,
    focusedInputRef: null,
    focusedTargetRef: null,
  },
  setFocusedKeyboardControls: (): void => {},
});

type TransformValueFn = (currentValue: string) => string;

type InputRefType =
  | NumberInputFieldHandles
  | (HTMLDivElement & {
      transformValue: (fn: TransformValueFn) => void;
    });

type TargetRefType = HTMLDivElement;

export type FocusedKeyboardControls = {
  focusedCombinationId: string | null;
  focusedInputId: string | null;
  focusedInputRef: RefObject<InputRefType | null> | null;
  focusedTargetRef: RefObject<TargetRefType | null> | null;
};

KeyboardContext.displayName = "KeyboardContext";

export const KeyboardProvider: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FocusedKeyboardControls>({
    focusedCombinationId: null,
    focusedInputId: null,
    focusedInputRef: null,
    focusedTargetRef: null,
  });

  const value = useMemo(
    () => ({
      focusedKeyboardControls: state,
      setFocusedKeyboardControls: setState,
    }),
    [state],
  );

  return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>;
};
