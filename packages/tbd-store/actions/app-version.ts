import { AppVersion } from "../state";

export const NETWORK__FETCH_APP_VERSION_IN_PROGRESS = "NETWORK/FETCH_APP_VERSION_IN_PROGRESS";
export const NETWORK__FETCH_APP_VERSION_SUCCESS = "NETWORK/FETCH_APP_VERSION_SUCCESS";
export const NETWORK__FETCH_APP_VERSION_FAILURE = "NETWORK/FETCH_APP_VERSION_FAILURE";

export type FetchAppVersionInProgressAction = {
  type: typeof NETWORK__FETCH_APP_VERSION_IN_PROGRESS;
};

export type FetchAppVersionSuccessAction = {
  type: typeof NETWORK__FETCH_APP_VERSION_SUCCESS;
  payload: AppVersion;
};

export type FetchAppVersionFailureAction = {
  type: typeof NETWORK__FETCH_APP_VERSION_FAILURE;
  payload: {
    error: string;
  };
};
