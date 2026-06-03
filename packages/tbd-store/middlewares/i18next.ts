import { Middleware } from "redux";
import i18next from "i18next";
import { ApplicationState } from "../state/ApplicationState.types";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";

type ActionTypes = FetchAppContextSuccessAction;

export const i18nextMiddleware: Middleware<Record<string, never>, ApplicationState> =
  () => (next) => async (action: ActionTypes) => {
    const { type, payload } = action;

    if (type === NETWORK__FETCH_APP_CONTEXT_SUCCESS) {
      const { userdetails } = payload.initialState?.entities || {};

      if (userdetails) {
        i18next.changeLanguage(userdetails.localeCodeBcp47);
      }
    }

    return next(action);
  };
