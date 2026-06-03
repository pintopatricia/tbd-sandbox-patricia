import { AnyAction, Dispatch, Middleware } from "redux";
import { ApplicationState } from "../../state/ApplicationState.types";
import { FETCH_CATALOGUE_FAILURE, FetchCatalogueFailureAction } from "../../actions/catalogue";

type ExpectedActions = FetchCatalogueFailureAction;

export const crashReporter: Middleware<Record<string, never>, ApplicationState, Dispatch<AnyAction>> =
  () => (next: Dispatch<ExpectedActions>) => (action: ExpectedActions) => {
    const returnValue = next(action);

    if (action.type === FETCH_CATALOGUE_FAILURE) {
      throw action.payload.error;
    }

    return returnValue;
  };
