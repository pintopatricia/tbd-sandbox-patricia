import { PUSH, REFRESH, type PushAction, type RefreshAction } from "../../../actions";
import {
  MESSAGING__ADD,
  MESSAGING__REMOVE,
  UI__MESSAGING_REMOVE,
  type MessagingAdd,
  type MessagingRemove,
  type MessagingUIRemove,
} from "../../../actions/messaging";
import { UI__BETSLIP_SET_COLLAPSE_ACTION, type BetslipCollapseToggleAction } from "../../../actions/betslip";
import { UI__MY_BETS_ORDER_TYPE_FILTER_CLICK, type MyBetsOrderTypeFilterClick } from "../../../actions/my-bets";
import {
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  type PNPartialSubscribeEventsSuccessAction,
  type PNSubscribeEventsSuccessAction,
  type LASubscribeEventsSuccessAction,
  type PNUnsubscribeEventsAction,
  type PNUnsupportedSubscribeEventsSuccessAction,
  type LAUnsubscribeEventsSuccessAction,
} from "../../../actions/push-notifications";

import type { Messages } from "./Messages.types";

type ActionTypes =
  | BetslipCollapseToggleAction
  | MessagingAdd
  | MessagingRemove
  | MessagingUIRemove
  | MyBetsOrderTypeFilterClick
  | PNPartialSubscribeEventsSuccessAction
  | PNSubscribeEventsSuccessAction
  | LASubscribeEventsSuccessAction
  | LAUnsubscribeEventsSuccessAction
  | PNUnsubscribeEventsAction
  | PNUnsupportedSubscribeEventsSuccessAction
  | PushAction
  | RefreshAction;

const INITIAL_STATE: Messages = { messagesByTypeOrder: new Set([]) };

const clearAllMessages = (state: Messages): Messages => {
  const { messagesByTypeOrder } = state;

  messagesByTypeOrder.clear();

  return { messagesByTypeOrder };
};

export default (currentState: undefined | Messages, action: ActionTypes): Messages => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case MESSAGING__ADD: {
      const { messagesByTypeOrder } = state;

      messagesByTypeOrder.delete(action.payload.code);
      messagesByTypeOrder.add(action.payload.code);

      return {
        ...state,
        [action.payload.code]: {
          ...state[action.payload.code],
          code: action.payload.code,
          type: action.payload.type,
          title: action.payload.title,
          description: action.payload.description,
          icon: action.payload.icon,
          iconCentered: action.payload.iconCentered,
        },
        messagesByTypeOrder,
      };
    }
    case UI__MESSAGING_REMOVE:
    case MESSAGING__REMOVE: {
      const { [action.payload.code]: _, messagesByTypeOrder, ...rest } = state;

      messagesByTypeOrder.delete(action.payload.code);

      return {
        messagesByTypeOrder,
        ...rest,
      };
    }
    case UI__BETSLIP_SET_COLLAPSE_ACTION: {
      if (action.payload.collapse) {
        return state;
      }

      return clearAllMessages(state);
    }
    case PN_UNSUBSCRIBE_EVENTS:
      return action.payload.showToastMessage ? clearAllMessages(state) : state;
    case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK:
    case PN_SUBSCRIBE_EVENTS_SUCCESS:
    case LA_SUBSCRIBE_EVENTS_SUCCESS:
    case LA_UNSUBSCRIBE_EVENTS_SUCCESS:
    case PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS:
    case PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS:
    case PUSH:
    case REFRESH:
      return clearAllMessages(state);
    default:
      return state;
  }
};
