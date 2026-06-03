import { SagaIterator } from "redux-saga";
import { call, delay, put, race, take, takeEvery } from "redux-saga/effects";

import { NETWORK__INVALID_SESSION, type InvalidSessionAction } from "../actions/app-context";
import {
  BetslipSportsbookReceiptBetIdCopyAction,
  BetslipSportsbookReceiptRegulatorBetIdCopyAction,
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
} from "../actions/betslip";
import { BettingSportsbookInvalidLegsAmountAction, BETTING__SBK_INVALID_LEGS_AMOUNT } from "../actions/betting";
import {
  UI__FAVOURITE_MARKETS_LIMIT_REACHED,
  type FavouriteMarketsLimitReachedAction,
} from "../actions/favourite-markets";
import { NETWORK__REALITY_CHECK_ALERT, type RealityCheckAlertAction } from "../actions/notification";
import { MessagingAdd, MessagingRemove, MESSAGING__ADD, MESSAGING__REMOVE } from "../actions/messaging";
import {
  MyBetsCancelAllExchangeBetsSuccessAction,
  MyBetsCancelExchangeBetSuccessAction,
  MyBetsCopyBetId,
  MyBetsCopyDeviceId,
  MyBetsCopyRegulatorBetId,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
} from "../actions/my-bets";
import { NavigateToEventViewFirstTime, UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../actions/navigation";
import {
  LASubscribeEventsSuccessAction,
  PNSubscribeEventsSuccessAction,
  PNPartialSubscribeEventsSuccessAction,
  PNUnsupportedSubscribeEventsSuccessAction,
  PNUnsubscribeEventsAction,
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  LAUnsubscribeEventsSuccessAction,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
} from "../actions/push-notifications";
import {
  ClosedSbkBetButtonCLickAction,
  SuspendedSbkBetButtonCLickAction,
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
  InPlaySbkBetButtonClickAction,
  UI__VIRTUAL_SUSPENDED_SBK_CLICK,
} from "../actions/sportsbook-markets";
import { MessageCode, MessageType } from "../state";
import { NETWORK__CASHOUT_TAKE_FAILURE_SBK, TakeCashoutFailureSbkAction } from "../actions/cashout";
import { ObbInPlayBetButtonClickAction, UI__OBB_INPLAY_BET_CLICK } from "../actions/obb";
import { FETCH_CATALOGUE_RATE_LIMIT_FAILURE, FetchCatalogueRateLimitFailureAction } from "../actions";

type MessageAddActions = BettingSportsbookInvalidLegsAmountAction;

type OutboundMessageConfig = {
  code: MessageCode;
  title: string;
  type: MessageType;
  description?: string;
  icon?: string;
  iconCentered?: boolean;
  timeout?: number;
};

type OutboundMessageBuilder<T> = (action: T) => OutboundMessageConfig | undefined;

/** A map of side effect action -> message builder */
export type OutboundMessageMap = {
  [BETTING__SBK_INVALID_LEGS_AMOUNT]: OutboundMessageBuilder<BettingSportsbookInvalidLegsAmountAction>;
  [NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS]: OutboundMessageBuilder<MyBetsCancelExchangeBetSuccessAction>;
  [NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS]: OutboundMessageBuilder<MyBetsCancelAllExchangeBetsSuccessAction>;
  [PN_SUBSCRIBE_EVENTS_SUCCESS]: OutboundMessageBuilder<PNSubscribeEventsSuccessAction>;
  [LA_SUBSCRIBE_EVENTS_SUCCESS]: OutboundMessageBuilder<LASubscribeEventsSuccessAction>;
  [LA_UNSUBSCRIBE_EVENTS_SUCCESS]: OutboundMessageBuilder<LAUnsubscribeEventsSuccessAction>;
  [PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS]: OutboundMessageBuilder<PNPartialSubscribeEventsSuccessAction>;
  [PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS]: OutboundMessageBuilder<PNUnsupportedSubscribeEventsSuccessAction>;
  [PN_UNSUBSCRIBE_EVENTS]: OutboundMessageBuilder<PNUnsubscribeEventsAction>;
  [UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY]: OutboundMessageBuilder<BetslipSportsbookReceiptBetIdCopyAction>;
  [UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY]: OutboundMessageBuilder<BetslipSportsbookReceiptRegulatorBetIdCopyAction>;
  [UI__FAVOURITE_MARKETS_LIMIT_REACHED]: OutboundMessageBuilder<FavouriteMarketsLimitReachedAction>;
  [UI__MY_BETS_COPY_BET_ID]: OutboundMessageBuilder<MyBetsCopyBetId>;
  [UI__MY_BETS_COPY_REGULATOR_BET_ID]: OutboundMessageBuilder<MyBetsCopyRegulatorBetId>;
  [UI__MY_BETS_COPY_DEVICE_ID]: OutboundMessageBuilder<MyBetsCopyDeviceId>;
  [NETWORK__INVALID_SESSION]: OutboundMessageBuilder<InvalidSessionAction>;
  [NETWORK__REALITY_CHECK_ALERT]: OutboundMessageBuilder<RealityCheckAlertAction>;
  [UI__CLOSED_SBK_CLICK]: OutboundMessageBuilder<ClosedSbkBetButtonCLickAction>;
  [UI__SUSPENDED_SBK_CLICK]: OutboundMessageBuilder<SuspendedSbkBetButtonCLickAction>;
  [UI__VIRTUAL_SUSPENDED_SBK_CLICK]: OutboundMessageBuilder<InPlaySbkBetButtonClickAction>;
  [UI__OBB_INPLAY_BET_CLICK]: OutboundMessageBuilder<ObbInPlayBetButtonClickAction>;
  [UI__NAVIGATE_TO_EVENT_FIRST_TIME]: OutboundMessageBuilder<NavigateToEventViewFirstTime>;
  [NETWORK__CASHOUT_TAKE_FAILURE_SBK]: OutboundMessageBuilder<TakeCashoutFailureSbkAction>;
  [FETCH_CATALOGUE_RATE_LIMIT_FAILURE]: OutboundMessageBuilder<FetchCatalogueRateLimitFailureAction>;
};

function getOutboundMessageConfig(
  action: MessageAddActions,
  messaging: OutboundMessageMap,
): OutboundMessageConfig | undefined {
  // Casting as any, since the map guarantees the action will match
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return messaging[action.type](action as any);
}

function* isMessageRemoved(code: MessageCode): SagaIterator {
  while (true) {
    const action: MessagingRemove = yield take(MESSAGING__REMOVE);

    if (action.payload.code === code) {
      return;
    }
  }
}

function* isNewMessageAdded(code: MessageCode): SagaIterator {
  while (true) {
    const action: MessagingAdd = yield take(MESSAGING__ADD);

    if (action.payload.code === code) {
      return;
    }
  }
}

function* scheduleMessageRemoval(code: MessageCode, timeout: number): SagaIterator {
  yield delay(timeout);

  yield put<MessagingRemove>({
    type: MESSAGING__REMOVE,
    payload: {
      code,
    },
  });
}

function* addMessage(messaging: OutboundMessageMap, action: MessageAddActions): SagaIterator {
  const message = getOutboundMessageConfig(action, messaging);

  if (!message) {
    return;
  }

  yield put<MessagingAdd>({
    type: MESSAGING__ADD,
    payload: {
      title: message.title,
      description: message.description,
      type: message.type,
      code: message.code,
      icon: message.icon,
      iconCentered: message.iconCentered,
    },
  });

  // Resolves when:
  // - Timeout passes
  // - Message has already removed by another side effect
  // - No timeout provided
  if (message.timeout) {
    yield race([
      call(scheduleMessageRemoval, message.code, message.timeout),
      call(isMessageRemoved, message.code),
      call(isNewMessageAdded, message.code),
    ]);
  }
}

export function* messageHubSaga(messaging: OutboundMessageMap): SagaIterator {
  yield takeEvery(
    [
      BETTING__SBK_INVALID_LEGS_AMOUNT,
      NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
      NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
      PN_SUBSCRIBE_EVENTS_SUCCESS,
      LA_SUBSCRIBE_EVENTS_SUCCESS,
      LA_UNSUBSCRIBE_EVENTS_SUCCESS,
      PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
      PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
      PN_UNSUBSCRIBE_EVENTS,
      UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
      UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
      UI__FAVOURITE_MARKETS_LIMIT_REACHED,
      UI__MY_BETS_COPY_BET_ID,
      UI__MY_BETS_COPY_REGULATOR_BET_ID,
      UI__MY_BETS_COPY_DEVICE_ID,
      NETWORK__INVALID_SESSION,
      NETWORK__REALITY_CHECK_ALERT,
      UI__CLOSED_SBK_CLICK,
      UI__SUSPENDED_SBK_CLICK,
      UI__VIRTUAL_SUSPENDED_SBK_CLICK,
      UI__OBB_INPLAY_BET_CLICK,
      UI__NAVIGATE_TO_EVENT_FIRST_TIME,
      NETWORK__CASHOUT_TAKE_FAILURE_SBK,
      FETCH_CATALOGUE_RATE_LIMIT_FAILURE,
    ],
    addMessage,
    messaging,
  );
}
