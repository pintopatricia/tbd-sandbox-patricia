import {
  ConfirmationAccept,
  ConfirmationAction,
  ConfirmationRefuse,
  UI__ACCEPT_CONFIRMATION,
  UI__ACTION_CONFIRMATION,
  UI__REFUSE_CONFIRMATION,
} from "../../actions/confirmation";
import { ConfirmationState } from "./Confirmation.types";

type ActionTypes = ConfirmationAccept | ConfirmationAction | ConfirmationRefuse;

const INITIAL_STATE = null;

export default (currentState: undefined | ConfirmationState, action: ActionTypes): ConfirmationState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case UI__ACTION_CONFIRMATION: {
      const { id, refuseActions, acceptActions } = action.payload;

      return {
        ...state,
        id,
        refuseActions,
        acceptActions,
      };
    }
    case UI__REFUSE_CONFIRMATION:
    case UI__ACCEPT_CONFIRMATION: {
      return null;
    }
    default:
      return state;
  }
};
