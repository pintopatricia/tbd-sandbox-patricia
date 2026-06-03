import { createContext, useState, useMemo, useContext } from "react";
import * as React from "react";

type RefreshEnabledContextAPI = {
  refreshEnabled: boolean;
  setRefreshEnabled: (enabled: boolean) => void;
};

const defaultValue: RefreshEnabledContextAPI = {
  refreshEnabled: true,
  setRefreshEnabled: () => {},
};

const RefreshEnabledContext = createContext<RefreshEnabledContextAPI>(defaultValue);

const RefreshEnabledProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const value = useMemo(() => ({ refreshEnabled, setRefreshEnabled }), [refreshEnabled, setRefreshEnabled]);

  return <RefreshEnabledContext.Provider value={value}>{children}</RefreshEnabledContext.Provider>;
};

function useRefreshEnabled(): RefreshEnabledContextAPI {
  const { refreshEnabled, setRefreshEnabled } = useContext(RefreshEnabledContext);

  const context = useMemo<RefreshEnabledContextAPI>(
    () => ({
      refreshEnabled,
      setRefreshEnabled,
    }),
    [refreshEnabled, setRefreshEnabled],
  );

  return context;
}

export { RefreshEnabledProvider, useRefreshEnabled, RefreshEnabledContext };
