import { SagaIterator } from "redux-saga";
import { all, call, put, select, spawn, takeLatest } from "redux-saga/effects";

import { FabricError } from "@flutter-global/uki-channels-http-clients";
import { AppContextResponse, AuthError, TerritoryBlockingData } from "../clients/app-context/app-context-client";
import { getAppContextFromBFF, getAppVersion } from "../services/app-context-service";
import { isHttpResponseError } from "../helpers/error-parsing";

import {
  APP_CONTEXT__FETCH,
  FetchAppContextAction,
  FetchAppContextAuthFailureAction,
  FetchAppContextFailureAction,
  FetchAppContextSuccessAction,
  FetchAppContextTerritoryBlockingAction,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
  SESSION__TOKEN_CHANGED,
  SessionTokenChangedAction,
} from "../actions/app-context";
import { buildAppContext } from "../clients/catalogue/app-context-builder";
import { AppContextQuery } from "../clients/catalogue/catalogue-response-types";
import { buildEnvironmentForJurisdiction, getAppEnvironment } from "../helpers";
import { AppVersion, ApplicationState, EnvironmentJSON, ThrottleOverrides, getOverridenThrottles } from "../state";
import {
  FetchAppVersionInProgressAction,
  NETWORK__FETCH_APP_VERSION_IN_PROGRESS,
  FetchAppVersionSuccessAction,
  NETWORK__FETCH_APP_VERSION_SUCCESS,
  FetchAppVersionFailureAction,
  NETWORK__FETCH_APP_VERSION_FAILURE,
} from "../actions/app-version";
import { mapAppVersion } from "../helpers/app-version";

let lastFetchPayload: FetchAppContextAction["payload"] | null = null;

const isBlockedTerritoryData = (payload: AppContextResponse): payload is TerritoryBlockingData =>
  "details" in payload && !!payload.details.isBlockedTerritory;

type FabricErrorType = Error & {
  status: number;
  code: string;
};

function isFabricError(error: Error): error is FabricErrorType {
  return (
    (error instanceof FabricError &&
      "status" in error &&
      "code" in error &&
      typeof error.status === "number" &&
      typeof error.code === "string") ||
    error.name === FabricError.name
  );
}

function* requestAppVersion(endpoint?: string): SagaIterator {
  const throttleOverrides: ThrottleOverrides = yield select((state: ApplicationState) =>
    getOverridenThrottles(state.entities),
  );

  const appVersion: Awaited<ReturnType<typeof getAppVersion>> = yield call(getAppVersion, endpoint, throttleOverrides);

  return mapAppVersion(appVersion);
}

function* fetchAppVersion(endpoint?: string): SagaIterator {
  try {
    yield put<FetchAppVersionInProgressAction>({
      type: NETWORK__FETCH_APP_VERSION_IN_PROGRESS,
    });

    const payload: AppVersion = yield call(requestAppVersion, endpoint);

    yield put<FetchAppVersionSuccessAction>({
      type: NETWORK__FETCH_APP_VERSION_SUCCESS,
      payload,
    });
  } catch (error) {
    yield put<FetchAppVersionFailureAction>({
      type: NETWORK__FETCH_APP_VERSION_FAILURE,
      payload: {
        error: `${error}`,
      },
    });
  }
}

function* requestAppContext(action: FetchAppContextAction): SagaIterator {
  const throttleOverrides: ThrottleOverrides = yield select((state: ApplicationState) =>
    getOverridenThrottles(state.entities),
  );

  yield spawn(fetchAppVersion, action.payload?.latestBffEndpoint);

  const [response, environment]: [AppContextQuery, EnvironmentJSON] = yield all([
    call(
      getAppContextFromBFF,
      action.payload?.defaultBffEndpoint,
      action.payload?.authenticationToken,
      throttleOverrides,
    ),
    call(getAppEnvironment, action.payload?.defaultAppEnv, action.payload?.buildNumber),
  ]);

  const treatedEnvironment = buildEnvironmentForJurisdiction(
    environment,
    response.AppContext.userdetails.jurisdiction.jurisdiction,
  );
  return buildAppContext({ appContextResponse: response, environment: treatedEnvironment });
}

function* fetchAppContext(action: FetchAppContextAction): SagaIterator {
  lastFetchPayload = action.payload;

  try {
    const payload: AppContextResponse = yield call(requestAppContext, action);

    if (isBlockedTerritoryData(payload)) {
      yield put<FetchAppContextTerritoryBlockingAction>({
        type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
        payload,
      });
    } else {
      if (!payload.initialState?.entities?.userdetails?.loggedIn && action.payload?.timezone) {
        payload.initialState.entities.userdetails.timezone = action.payload.timezone;
      }

      yield put<FetchAppContextSuccessAction>({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload,
      });
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      yield put<FetchAppContextFailureAction>({
        type: NETWORK__FETCH_APP_CONTEXT_FAILURE,
        payload: {
          error: `Unknown error ${error}`,
        },
      });

      return;
    }

    if (error instanceof AuthError || (error instanceof Error && error.name === AuthError.name)) {
      yield put<FetchAppContextAuthFailureAction>({
        type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
      });

      return;
    }

    if (isFabricError(error) || isHttpResponseError(error)) {
      if (error.status === 401) {
        yield put<FetchAppContextAuthFailureAction>({
          type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
        });

        return;
      }

      if (error.status === 403) {
        yield put<FetchAppContextTerritoryBlockingAction>({
          type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
          payload: {
            details: {
              isBlockedTerritory: true,
              failed: false,
            },
          },
        });

        return;
      }
    }

    yield put<FetchAppContextFailureAction>({
      type: NETWORK__FETCH_APP_CONTEXT_FAILURE,
      payload: {
        error: error.message,
      },
    });
  }
}

function* handleSessionTokenChanged(action: SessionTokenChangedAction): SagaIterator {
  // Somehow this was being called before app boots up
  if (!lastFetchPayload) {
    return;
  }

  // If the token is the same as the last fetch, don't fetch again
  if (action.payload.authenticationToken === lastFetchPayload.authenticationToken) {
    return;
  }

  yield call(fetchAppContext, {
    type: APP_CONTEXT__FETCH,
    payload: {
      ...lastFetchPayload,
      authenticationToken: action.payload.authenticationToken,
    },
  });
}

export function* appContextSaga(): SagaIterator {
  yield takeLatest(APP_CONTEXT__FETCH, fetchAppContext);
  yield takeLatest(SESSION__TOKEN_CHANGED, handleSessionTokenChanged);
}
