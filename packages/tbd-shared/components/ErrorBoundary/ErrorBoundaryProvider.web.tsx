import { FunctionComponent, PropsWithChildren } from "react";
import { ErrorBoundaryContext, ErrorBoundaryContextType } from "./error-boundary-context";

const errorBoundaryContext: ErrorBoundaryContextType = {
  onError: (err, errorInfo, urn) => {
    const error = window?.SplunkRum?.error;

    if (!error) {
      return;
    }

    error(err, {
      // clamping the componentStack because long dimensions are left out by new relic
      ...errorInfo,
      ...(urn ? { urn } : undefined),
    });
  },
};

export const ErrorBoundaryProvider: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <ErrorBoundaryContext.Provider value={errorBoundaryContext}>{children}</ErrorBoundaryContext.Provider>
);
