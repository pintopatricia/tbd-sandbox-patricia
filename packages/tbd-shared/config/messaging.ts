import { FETCH_CATALOGUE_RATE_LIMIT_FAILURE, MessageCode, MessageType } from "@ppb/tbd-store";
import {
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
} from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_INVALID_LEGS_AMOUNT } from "@ppb/tbd-store/actions/betting";
import { UI__FAVOURITE_MARKETS_LIMIT_REACHED } from "@ppb/tbd-store/actions/favourite-markets";
import {
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
} from "@ppb/tbd-store/actions/my-bets";
import { NETWORK__CASHOUT_TAKE_FAILURE_SBK } from "@ppb/tbd-store/actions/cashout";
import {
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
} from "@ppb/tbd-store/actions/push-notifications";
import { NETWORK__INVALID_SESSION } from "@ppb/tbd-store/actions/app-context";
import {
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
  UI__VIRTUAL_SUSPENDED_SBK_CLICK,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "@ppb/tbd-store/actions/navigation";
import { NETWORK__REALITY_CHECK_ALERT } from "@ppb/tbd-store/actions/notification";
import { UI__OBB_INPLAY_BET_CLICK } from "@ppb/tbd-store/actions/obb";
import { OutboundMessageMap } from "@ppb/tbd-store/middlewares/messaging-hub-saga";
import { SystemIconName } from "@ppb/the-wall-icons";
import { getErrorMessageTranslatedKey } from "@ppb/tbd-store/helpers/receipt";
import { buildMessageTitle } from "@ppb/tbd-store/helpers/obb";

import { i18n } from "../helpers/i18n";
import { TranslationKey } from "../translations/keys";

export const MESSAGE_CONFIG_MAP: OutboundMessageMap = {
  [BETTING__SBK_INVALID_LEGS_AMOUNT]: (action) => ({
    code: MessageCode.INVALID_LEGS_AMOUNT,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.MAX_SELECTIONS_EXCEEDED",
    }),
    description: i18n({
      key: "I18N.MESSAGING.DESCRIPTION.MAX_SELECTIONS_EXCEEDED",
      interpolationValues: { selections: action.payload.limit },
    }),
    timeout: 4000,
  }),
  [NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS]: ({ payload }) => ({
    code: MessageCode.CANCEL_UNMATCHED_BET_SUCCESS,
    type: MessageType.Success,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.SINGLE_BET_CANCELLED",
    }),
    description: i18n({
      key: "I18N.MESSAGING.DESCRIPTION.SINGLE_BET_CANCELLED",
      interpolationValues: { selection: payload.selectionName },
    }),
    timeout: 4000,
  }),
  [NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS]: ({ payload }) => ({
    code: MessageCode.CANCEL_ALL_UNMATCHED_BETS_SUCCESS,
    type: MessageType.Success,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.MULTI_BETS_CANCELLED",
    }),
    description: i18n({
      key: "I18N.MESSAGING.DESCRIPTION.MULTI_BETS_CANCELLED",
      interpolationValues: {
        nbets: payload.numberOfBets,
        market: payload.marketName,
        event: payload.event ?? "",
      },
    }),
    timeout: 4000,
  }),
  [PN_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: i18n({
      key: "I18N.NOTIFICATION.SUBSCRIPTION_SUCCESS_TITLE",
    }),
    description: i18n({
      key: "I18N.NOTIFICATION.SUBSCRIPTION_SUCCESS_DESCRIPTION",
    }),
    icon: SystemIconName.NOTIFICATION_ON,
    timeout: 4000,
  }),
  [LA_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.LIVE_ACTIVITY_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: i18n({
      key: "I18N.EVENT.LIVE_ACTIVITIES_SUBSCRIBED",
    }),
    description: i18n({
      key: "I18N.EVENT.LIVE_ACTIVITIES_SUBSCRIBED_DESC",
    }),
    timeout: 4000,
  }),
  [LA_UNSUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.LIVE_ACTIVITY_UNSUBSCRIBED_SUCCESS,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.EVENT.LIVE_ACTIVITIES_UNSUBSCRIBED",
    }),
    description: i18n({
      key: "I18N.EVENT.LIVE_ACTIVITIES_UNSUBSCRIBED_DESC",
    }),
    timeout: 4000,
  }),
  [PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: i18n({
      key: "I18N.NOTIFICATION.SUBSCRIPTION_PARTIAL_TITLE",
    }),
    description: i18n({
      key: "I18N.NOTIFICATION.SUBSCRIPTION_PARTIAL_DESCRIPTION",
    }),
    icon: SystemIconName.NOTIFICATION_PARTIAL,
    timeout: 4000,
  }),
  [PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.NOTIFICATION.SUBSCRIPTION_UNAVAILABLE",
    }),
    icon: SystemIconName.NOTIFICATION_UNAVAILABLE,
    timeout: 4000,
  }),
  [PN_UNSUBSCRIBE_EVENTS]: ({ payload }) =>
    payload.showToastMessage
      ? {
          code: MessageCode.NOTIFICATIONS_UNSUBSCRIBED,
          type: MessageType.Info,
          title: i18n({
            key: "I18N.NOTIFICATION.UNSUBSCRIPTION_TITLE",
          }),
          description: i18n({
            key: "I18N.NOTIFICATION.UNSUBSCRIPTION_DESCRIPTION",
          }),
          icon: SystemIconName.NOTIFICATION_OFF,
          timeout: 4000,
        }
      : undefined,
  [UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MYBETS.BETID_COPY_MESSAGE",
    }),
    timeout: 3000,
  }),
  [UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MYBETS.BETID_AUX_COPY_MESSAGE",
    }),
    timeout: 3000,
  }),
  [UI__FAVOURITE_MARKETS_LIMIT_REACHED]: () => ({
    code: MessageCode.FAVOURITE_MARKETS_LIMIT_REACHED,
    type: MessageType.Info,
    icon: SystemIconName.FAVOURITE_OFF,
    title: i18n({
      key: "I18N.FAVOURITE_MARKETS.LIMIT_REACHED_MESSAGE.TITLE",
    }),
    description: i18n({
      key: "I18N.FAVOURITE_MARKETS.LIMIT_REACHED_MESSAGE.DESCRIPTION",
    }),
  }),
  [UI__MY_BETS_COPY_BET_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MYBETS.BETID_COPY_MESSAGE",
    }),
    timeout: 3000,
  }),
  [UI__MY_BETS_COPY_REGULATOR_BET_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MYBETS.BETID_AUX_COPY_MESSAGE",
    }),
    timeout: 3000,
  }),
  [UI__MY_BETS_COPY_DEVICE_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MYBETS.DEVICE_ID_COPY_MESSAGE",
    }),
    timeout: 3000,
  }),
  [UI__CLOSED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MARKET.CLOSED",
    }),
    timeout: 3000,
  }),
  [UI__SUSPENDED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MARKET.SUSPENDED",
    }),
    timeout: 3000,
  }),
  [UI__VIRTUAL_SUSPENDED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON_VIRTUALS,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.SPORT_EVENT.IN_PLAY",
    }),
    timeout: 3000,
  }),
  [UI__OBB_INPLAY_BET_CLICK]: ({ payload }) => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON,
    type: MessageType.Info,
    title: i18n({ key: buildMessageTitle(payload.legTemplateId).key as keyof TranslationKey }),
    description: i18n({ key: "I18N.OBB.GENERIC.DISABLED.MESSAGE" }),
    timeout: 3000,
  }),
  [NETWORK__INVALID_SESSION]: () => ({
    code: MessageCode.INVALID_SESSION,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.INVALID_SESSION",
    }),
    description: i18n({
      key: "I18N.MESSAGING.DESCRIPTION.INVALID_SESSION",
    }),
    timeout: 4000,
  }),
  [NETWORK__REALITY_CHECK_ALERT]: ({ payload }) => ({
    code: MessageCode.REALITY_CHECK_ALERT,
    type: MessageType.Success,
    icon: SystemIconName.SAFER_GAMBLING,
    iconCentered: true,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.SESSION_DURATION_REGULATORY_ALERT",
      interpolationValues: { duration: payload.duration },
    }),
    timeout: 5000,
  }),
  [UI__NAVIGATE_TO_EVENT_FIRST_TIME]: () => ({
    code: MessageCode.BELL_EVENT_NOTIFICATION,
    type: MessageType.Info,
    title: i18n({
      key: "I18N.NOTIFICATION.TITLE.BELL_EVENT_NOTIFICATION",
    }),
    icon: SystemIconName.NOTIFICATION_OFF,
    iconCentered: true,
  }),
  [NETWORK__CASHOUT_TAKE_FAILURE_SBK]: ({ payload }) => ({
    code: MessageCode.CASHOUT_FAILURE,
    type: MessageType.Info,
    title: i18n({
      key: getErrorMessageTranslatedKey(payload.errorCode).translate?.key as keyof TranslationKey,
    }),
    timeout: 4000,
  }),
  [FETCH_CATALOGUE_RATE_LIMIT_FAILURE]: ({ payload }) => ({
    code: MessageCode.INVALID_SESSION,
    type: MessageType.Error,
    title: i18n({
      key: "I18N.MESSAGING.TITLE.TOO_MANY_REQUESTS",
    }),
    description: i18n({
      key: payload.loggedIn
        ? "I18N.MESSAGING.DESCRIPTION.PLEASE_CONTACT_SUPPORT"
        : "I18N.MESSAGING.DESCRIPTION.PLEASE_LOGIN_TO_CONTINUE",
    }),
    icon: SystemIconName.NOTIFICATION_ERROR,
    iconCentered: true,
  }),
};
