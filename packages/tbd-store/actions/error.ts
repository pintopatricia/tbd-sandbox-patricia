import { ErrorView } from "../state/layout/views/View.types";

export const ERROR_VIEW__ADD = "ERROR_VIEW/ADD";

export type ErrorViewAddPayload = Pick<
  ErrorView,
  "urn" | "errorType" | "helpCenterUrl" | "bffEndpoint" | "latestBffEndpoint" | "appEnv"
>;

export type ErrorViewAddAction = {
  type: typeof ERROR_VIEW__ADD;
  payload: ErrorViewAddPayload;
};
