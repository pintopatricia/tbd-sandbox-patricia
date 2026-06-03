import { Middleware } from "redux";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_RATE_LIMIT_FAILURE,
  FetchCatalogueFailureAction,
  FetchCatalogueRateLimitFailureAction,
} from "../actions/catalogue";
import { isHttpResponseError } from "../helpers/error-parsing";
import { ApplicationState } from "../state/ApplicationState.types";
import { isOnlineUserDetails } from "../state";

export const catalogueFailureMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: FetchCatalogueFailureAction) => {
    switch (action.type) {
      case FETCH_CATALOGUE_FAILURE:
        if (isHttpResponseError(action.payload.error) && action.payload.error.status === 429) {
          const state: ApplicationState = getState();
          const { loggedIn } = state.entities.userdetails;

          dispatch<FetchCatalogueRateLimitFailureAction>({
            type: FETCH_CATALOGUE_RATE_LIMIT_FAILURE,
            payload: { loggedIn },
          });

          const accountId = isOnlineUserDetails(state.entities.userdetails)
            ? state.entities.userdetails.accountId
            : null;

          console.error(`Rate limit achieved for user ${accountId}`);
        }
        break;
      default:
        break;
    }

    return next(action);
  };
