import {
  NETWORK__UNREAD_NOTIFICATIONS_FAILURE,
  NETWORK__UNREAD_NOTIFICATIONS_SUCCESS,
  UnreadNotificationsFailureAction,
  UnreadNotificationsSuccessAction,
} from "../../actions/notifications-center";
import { NotificationsCenterState } from "./NotificationsCenterState.types";

const INITIAL_STATE: NotificationsCenterState = {
  unreadNotificationsCount: 0,
};

type ActionTypes = UnreadNotificationsSuccessAction | UnreadNotificationsFailureAction;

export default (currentState: undefined | NotificationsCenterState, action: ActionTypes): NotificationsCenterState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__UNREAD_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        unreadNotificationsCount: action.payload.unreadNotificationsCount,
      };
    }

    case NETWORK__UNREAD_NOTIFICATIONS_FAILURE: {
      return {
        ...state,
        unreadNotificationsCount: 0,
      };
    }

    default:
      return state;
  }
};
