import { AppContextData, TerritoryBlockingData } from "../clients/app-context/app-context-client";

export const APP_CONTEXT__FETCH = "APP_CONTEXT/FETCH";
export const NETWORK__FETCH_APP_CONTEXT_SUCCESS = "NETWORK/FETCH_APP_CONTEXT_SUCCESS";
export const NETWORK__FETCH_APP_CONTEXT_FAILURE = "NETWORK/FETCH_APP_CONTEXT_FAILURE";
export const NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE = "NETWORK/FETCH_APP_CONTEXT_AUTH_FAILURE";
export const NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING = "NETWORK/FETCH_APP_CONTEXT_TERRITORY_BLOCKING";
export const SESSION__TOKEN_CHANGED = "SESSION/TOKEN_CHANGED";
export const NETWORK__INVALID_SESSION = "NETWORK/INVALID_SESSION";

export type FetchAppContextSuccessAction = {
  type: typeof NETWORK__FETCH_APP_CONTEXT_SUCCESS;
  payload: AppContextData;
};

export type FetchAppContextFailureAction = {
  type: typeof NETWORK__FETCH_APP_CONTEXT_FAILURE;
  payload: {
    error: string;
  };
};

export type FetchAppContextAuthFailureAction = {
  type: typeof NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE;
};

export type FetchAppContextTerritoryBlockingAction = {
  type: typeof NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING;
  payload: TerritoryBlockingData;
};

export type InvalidSessionAction = {
  type: typeof NETWORK__INVALID_SESSION;
};

export type SessionTokenChangedAction = {
  type: typeof SESSION__TOKEN_CHANGED;
  payload: {
    authenticationToken: string | null;
  };
};

export type FetchAppContextAction = {
  type: typeof APP_CONTEXT__FETCH;
  payload: {
    defaultBffEndpoint?: string;
    defaultAppEnv: string;
    latestBffEndpoint?: string;
    timezone?: string;
    authenticationToken?: string | null;
    excEnabled?: boolean;
    buildNumber?: string;
  };
};
