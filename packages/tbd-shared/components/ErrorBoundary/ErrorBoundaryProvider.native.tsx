import { FunctionComponent, PropsWithChildren } from "react";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { ErrorBoundaryContext, ErrorBoundaryContextType } from "./error-boundary-context";

const errorBoundaryContext: ErrorBoundaryContextType = {
  onError: (err) => {
    const span = trace.getActiveSpan();
    if (span) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(err?.message || err) });
    }
  },
};

export const ErrorBoundaryProvider: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <ErrorBoundaryContext.Provider value={errorBoundaryContext}>{children}</ErrorBoundaryContext.Provider>
);
