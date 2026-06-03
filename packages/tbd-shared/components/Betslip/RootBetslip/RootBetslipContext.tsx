import { createContext, useState, useMemo, useEffect } from "react";
import * as React from "react";

type CollapseListener = () => void;
type CollapseListenerUnregister = () => void;

export type RootBetslipContextAPI = {
  onCollapseListeners: CollapseListener[];
  registerCollapseListener: (listener: CollapseListener) => CollapseListenerUnregister;
  isBetConfirmationStep: boolean;
  setIsBetConfirmationStep: (isBetConfirmationStep: boolean) => void;
};

const defaultValue: RootBetslipContextAPI = {
  onCollapseListeners: [],
  registerCollapseListener: () => {
     
    console.warn("not defined: using default value of provider");
    return () => {};
  },
  isBetConfirmationStep: false,
  setIsBetConfirmationStep: (): void => {},
};

const registerCollapseListener = (
  currentListeners: CollapseListener[],
  listener: CollapseListener,
): CollapseListenerUnregister => {
  currentListeners.push(listener);
  return () => {
    const position = currentListeners.indexOf(listener);
    if (position > -1) {
      currentListeners.splice(position, 1);
    }
  };
};

export function useRootBetslip(isCollapsed: boolean): RootBetslipContextAPI {
  const [isBetConfirmationStep, setIsBetConfirmationStep] = useState<boolean>(false);

  const context = useMemo<RootBetslipContextAPI>(() => {
    const onCollapseListeners: CollapseListener[] = [];

    return {
      onCollapseListeners,
      registerCollapseListener: registerCollapseListener.bind(null, onCollapseListeners),
      isBetConfirmationStep,
      setIsBetConfirmationStep,
    };
  }, [isBetConfirmationStep]);

  useEffect(() => {
    if (isCollapsed) {
      context.onCollapseListeners.forEach((listener) => listener());
    }
  }, [isCollapsed, context]);

  return context;
}

export const RootBetslipContext = createContext<RootBetslipContextAPI>(defaultValue);

export const RootBetslipContextProvider: React.FunctionComponent<{
  isCollapsed: boolean;
  children: React.ReactNode;
}> = ({ isCollapsed, children }) => {
  const rootBetslipContext = useRootBetslip(isCollapsed);

  return <RootBetslipContext.Provider value={rootBetslipContext}>{children}</RootBetslipContext.Provider>;
};
