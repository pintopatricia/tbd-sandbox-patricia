import { FunctionComponent } from "react";

export type ErrorPageProps = {
  error: string;
};

// TODO: Will be replaced by the "real" error page
const ErrorPage: FunctionComponent<ErrorPageProps> = ({ error }) => (
  <div style={{ marginTop: 150 }}>
    <h1 style={{ color: "var(--neutrals-text-default)" }}>{error}</h1>
  </div>
);

export default ErrorPage;
