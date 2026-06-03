import { ExperimentsState } from "./Experiments.types";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";

type ActionTypes = FetchAppContextSuccessAction;

export default (currentState: undefined | ExperimentsState, action: ActionTypes): ExperimentsState => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const { experiments } = action.payload.initialState?.entities || {};
      if (experiments) {
        return {
          ...experiments,
        };
      }

      return state;
    }
    default:
      return state;
  }
};
