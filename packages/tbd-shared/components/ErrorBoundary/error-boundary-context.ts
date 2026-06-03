import { createContext } from "react";

export type ErrorBoundaryContextType = {
  onError: (err: Error, errorInfo: React.ErrorInfo, urn: string | undefined) => void;
};

export const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(null);
