import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";

type ActionTypes = FetchAppContextSuccessAction;

export default (currentState: string | null | undefined, action: ActionTypes): string | null => {
  const state = currentState || null;

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const productId = action.payload.initialState?.entities?.productId;

      if (productId) {
        return productId;
      }

      return state;
    }
    default:
      return state;
  }
};
