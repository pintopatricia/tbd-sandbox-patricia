import type { JSX } from "react";
import { ReactNode, createContext, useMemo, useState, useCallback } from "react";

type GamingContextProps = {
  deepLinkUrn?: string;
  deepLinkUrl?: string;
  recentlyPlayedUrn?: string;
  setDeepLinkUrn: (value?: string | undefined) => void;
  setDeepLinkUrl: (value?: string | undefined) => void;
  setRecentlyPlayedUrn: (value?: string | undefined) => void;
};

const GamingContext = createContext<GamingContextProps>({
  deepLinkUrn: undefined,
  deepLinkUrl: undefined,
  recentlyPlayedUrn: undefined,
  setDeepLinkUrn: () => {},
  setDeepLinkUrl: () => {},
  setRecentlyPlayedUrn: () => {},
});
GamingContext.displayName = "GamingContext";

export const GamingContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [deepLinkUrn, setDeepLinkUrnState] = useState<string | undefined>(undefined);
  const [deepLinkUrl, setDeepLinkUrlState] = useState<string | undefined>(undefined);
  const [recentlyPlayedUrn, setRecentlyPlayedUrnState] = useState<string | undefined>(undefined);

  const setDeepLinkUrn = useCallback((value?: string) => {
    setDeepLinkUrnState(value);
  }, []);

  const setDeepLinkUrl = useCallback((value?: string) => {
    setDeepLinkUrlState(value);
  }, []);

  const setRecentlyPlayedUrn = useCallback((value?: string) => {
    setRecentlyPlayedUrnState(value);
  }, []);

  const gamingState: GamingContextProps = useMemo(
    () => ({
      deepLinkUrn,
      setDeepLinkUrn,
      deepLinkUrl,
      setDeepLinkUrl,
      recentlyPlayedUrn,
      setRecentlyPlayedUrn,
    }),
    [deepLinkUrn, setDeepLinkUrn, deepLinkUrl, setDeepLinkUrl, recentlyPlayedUrn, setRecentlyPlayedUrn],
  );

  return <GamingContext.Provider value={gamingState}>{children}</GamingContext.Provider>;
};

export default GamingContext;
