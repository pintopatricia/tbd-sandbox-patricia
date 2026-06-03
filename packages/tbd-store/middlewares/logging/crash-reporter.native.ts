/* eslint-disable no-console */
import { AnyAction, Dispatch, Middleware } from "redux";
import { ApplicationState } from "../../state/ApplicationState.types";
import { FETCH_CATALOGUE_FAILURE, FetchCatalogueFailureAction } from "../../actions/catalogue";

type ExpectedActions = FetchCatalogueFailureAction;

export const crashReporter: Middleware<Record<string, never>, ApplicationState, Dispatch<AnyAction>> =
  () => (next: Dispatch<ExpectedActions>) => (action: ExpectedActions) => {
    const returnValue = next(action);

    if (action.type === FETCH_CATALOGUE_FAILURE) {
      const { error } = action.payload;
      const isValidErrorObject = error && error.stack && error.message;
      if (!isValidErrorObject) {
        console.error("ERROR IN LOGGING AN ERROR, PLEASE ONLY LOG VALID JAVASCRIPT ERRORS");
      } else {
        console.error(FETCH_CATALOGUE_FAILURE);
        // when the message is too long it can crash the logbox so we use a regular log message
        console.log(error.message);
      }
    }

    return returnValue;
  };
