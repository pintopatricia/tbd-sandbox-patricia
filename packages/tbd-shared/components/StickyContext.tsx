import type { JSX } from "react";
import { createContext, ReactNode, useState, useMemo } from "react";
import * as React from "react";

type StickyValue = {
  currentSticky?: string;
  setCurrentSticky: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const StickyContext = createContext<StickyValue>({ currentSticky: undefined, setCurrentSticky: () => {} });

const StickyContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [currentSticky, setCurrentSticky] = useState<string | undefined>(undefined);
  const stickyState = useMemo(() => ({ currentSticky, setCurrentSticky }), [currentSticky]);

  return <StickyContext.Provider value={stickyState}>{children}</StickyContext.Provider>;
};

export { StickyContext, StickyContextProvider };
