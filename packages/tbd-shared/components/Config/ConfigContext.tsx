import { FunctionComponent, createContext } from "react";
import * as React from "react";

type ConfigContextProps = {
  isDesktopLayout: boolean;
};

export const ConfigContext = createContext<ConfigContextProps>({
  isDesktopLayout: false,
});
ConfigContext.displayName = "ConfigContext";

export const ConfigContextProvider: FunctionComponent<Props> = ({ children, value }) => (
  <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
);

type Props = {
  children: React.ReactNode;
  value: {
    isDesktopLayout: boolean;
  };
};
