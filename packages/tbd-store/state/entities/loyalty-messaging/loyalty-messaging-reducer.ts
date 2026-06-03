import { LoyaltyMessage, LoyaltyMessagingState } from "./LoyaltyMessaging.types";
import {
  LOYALTY__ACKNOWLEDGE_MESSAGE,
  LOYALTY__DISMISS_MESSAGE,
  LOYALTY__RECEIVE_MESSAGE,
  AcknowledgeLoyaltyMessageAction,
  DismissLoyaltyMessageAction,
  ReceiveLoyaltyMessageAction,
} from "../../../actions/loyalty-messaging";

type ActionTypes = ReceiveLoyaltyMessageAction | AcknowledgeLoyaltyMessageAction | DismissLoyaltyMessageAction;

const INITIAL_STATE = {
  messages: [],
};

export default (currentState: undefined | LoyaltyMessagingState, action: ActionTypes): LoyaltyMessagingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case LOYALTY__RECEIVE_MESSAGE: {
      return <LoyaltyMessagingState>{
        ...state,
        messages: [{ ...action.payload }, ...state.messages],
      };
    }
    case LOYALTY__ACKNOWLEDGE_MESSAGE: {
      const currentMessage: LoyaltyMessage | undefined = state.messages.find(
        (stackedMessage): boolean =>
          !stackedMessage.acknowledged && action.payload.message.urn === stackedMessage.content.message.urn,
      );

      if (currentMessage) {
        currentMessage.acknowledged = true;
      }

      return {
        ...state,
      };
    }
    case LOYALTY__DISMISS_MESSAGE: {
      const currentMessage: LoyaltyMessage | undefined = state.messages.find(
        (stackedMessage): boolean =>
          stackedMessage.isDisplayed && action.payload.message.urn === stackedMessage.content.message.urn,
      );

      if (currentMessage) {
        currentMessage.isDisplayed = false;
      }

      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
