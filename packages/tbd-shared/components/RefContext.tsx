import { createContext, Dispatch, FC, ReactElement, SetStateAction, useMemo, useState } from "react";

import * as React from "react";

export type RefContextValues = readonly [HTMLElement | null, Dispatch<SetStateAction<HTMLElement | null>>];

const defaults: RefContextValues = [null, () => {}];

export const RefContext = createContext<RefContextValues>(defaults);

export const RefProvider: FC<{ children: React.ReactNode }> = ({
  children,
}): ReactElement<RefContextValues, typeof RefContext> => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const value: RefContextValues = useMemo(() => [ref, setRef], [ref]);
  return <RefContext.Provider value={value}>{children}</RefContext.Provider>;
};
