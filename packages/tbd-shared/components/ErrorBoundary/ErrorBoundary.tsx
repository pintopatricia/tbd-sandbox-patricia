import type { JSX } from "react";
import { FunctionComponent, PropsWithChildren, ReactNode, useCallback, useContext } from "react";
import * as React from "react";
import { ErrorBoundaryContext } from "./error-boundary-context";

type ErrorProps = {
  children: ReactNode;
  urn?: string;
  Fallback?: ({ error }: { error: Error }) => JSX.Element;
  onError?: (err: Error, errorInfo: React.ErrorInfo) => void;
};
type ErrorState = { error: Error | undefined };

class InternalErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // report error if newrelic is available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { error };
  }

  render(): ReactNode {
    const { error } = this.state;
    const { Fallback, children } = this.props;
    if (error) {
      return Fallback ? <Fallback error={error} /> : <></>;
    }

    return children;
  }
}

export const ErrorBoundary: FunctionComponent<PropsWithChildren<ErrorProps>> = ({ children, Fallback, urn }) => {
  const errorBoundaryContext = useContext(ErrorBoundaryContext);
  const onError = useCallback(
    (err: Error, errorInfo: React.ErrorInfo) => {
      if (!errorBoundaryContext) {
        return undefined;
      }
      return errorBoundaryContext.onError(err, errorInfo, urn);
    },
    [errorBoundaryContext, urn],
  );

  return (
    <InternalErrorBoundary Fallback={Fallback} onError={onError} urn={urn}>
      {children}
    </InternalErrorBoundary>
  );
};
