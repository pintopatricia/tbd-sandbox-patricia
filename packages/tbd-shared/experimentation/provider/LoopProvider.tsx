import type { LoopClient } from "@flutter-global/loop-client-javascript-sdk/src/client/types";
import type { ApplicationState } from "@ppb/tbd-store";
import { createContext, FunctionComponent, PropsWithChildren } from "react";
import type { Store } from "redux";
import { useLoopProviderValue } from "./useLoopProviderValue";

export const LoopContext = createContext<LoopClient | null>(null);

export const LoopProvider: FunctionComponent<
  PropsWithChildren<{
    store: Store<ApplicationState>;
    visitorIdResolver: () => string | null;
  }>
> = ({ store, visitorIdResolver, children }) => {
  const client = useLoopProviderValue(store, visitorIdResolver);

  return <LoopContext.Provider value={client}>{children}</LoopContext.Provider>;
};
