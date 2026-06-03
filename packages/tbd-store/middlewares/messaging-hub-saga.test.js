import { MessageCode, MessageType } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import { BETTING__SBK_INVALID_LEGS_AMOUNT } from "../actions/betting";
import { MESSAGING__ADD, MESSAGING__REMOVE } from "../actions/messaging";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
} from "../actions/my-bets";
import { NETWORK__INVALID_SESSION } from "../actions/app-context";
import {
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
} from "../actions/push-notifications";
import {
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
  UI__VIRTUAL_SUSPENDED_SBK_CLICK,
} from "../actions/sportsbook-markets";
import { NETWORK__REALITY_CHECK_ALERT } from "../actions/notification";
import { UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../actions/navigation";
import { UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY, UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY } from "../actions/betslip";
import { NETWORK__CASHOUT_TAKE_FAILURE_SBK } from "../actions/cashout";
import { FETCH_CATALOGUE_RATE_LIMIT_FAILURE } from "../actions";

const createAction = (action) => ({
  type: action,
  payload: {},
});

const getSaga = () => {
  let saga;

  jest.isolateModules(() => {
    ({ messageHubSaga: saga } = require("./messaging-hub-saga"));
  });

  return saga;
};

const messagingConfigMock = {
  [BETTING__SBK_INVALID_LEGS_AMOUNT]: () => ({
    code: MessageCode.INVALID_LEGS_AMOUNT,
    type: MessageType.Info,
    title: "A",
    description: "B",
    timeout: 4000,
  }),
  [NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS]: () => ({
    code: MessageCode.CANCEL_UNMATCHED_BET_SUCCESS,
    type: MessageType.Success,
    title: "Cancel Unmatched",
    description: "Cancelled unmatched bet",
    timeout: 4000,
  }),
  [NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS]: () => ({
    code: MessageCode.CANCEL_ALL_UNMATCHED_BETS_SUCCESS,
    type: MessageType.Success,
    title: "Cancel All",
    description: "Cancelled all unmatched bets",
    timeout: 4000,
  }),
  [PN_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: "Sucesso",
    description: "Foi fixe",
    timeout: 4000,
  }),
  [LA_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: "LA Subscribed",
    description: "LA are alive!",
    timeout: 4000,
  }),
  [LA_UNSUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_UNSUBSCRIBED,
    type: MessageType.Info,
    title: "LA Unsubscribed",
    description: "LA are gone!",
    timeout: 4000,
  }),
  [PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: "Sucesso parcial",
    description: "Foi parcialmente fixe",
    timeout: 4000,
  }),
  [PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS]: () => ({
    code: MessageCode.NOTIFICATIONS_SUBSCRIBED_SUCCESS,
    type: MessageType.Success,
    title: "Sucesso não suportado",
    description: "Não foi fixe",
    timeout: 4000,
  }),
  [PN_UNSUBSCRIBE_EVENTS]: () => ({
    code: MessageCode.NOTIFICATIONS_UNSUBSCRIBED,
    type: MessageType.NotificationsUnsubscribed,
    title: "Unsubscribed title",
    description: "Unsubscribed description",
    icon: "icon",
    timeout: 4000,
  }),
  [UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: "ID copied",
    timeout: 3500,
  }),
  [UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: "ID copied",
    timeout: 3500,
  }),
  [UI__MY_BETS_COPY_BET_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: "ID copied",
    timeout: 3500,
  }),
  [UI__MY_BETS_COPY_REGULATOR_BET_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: "IDAux Copied",
    timeout: 2001,
  }),
  [UI__MY_BETS_COPY_DEVICE_ID]: () => ({
    code: MessageCode.COPY_ID_INFO,
    type: MessageType.Info,
    title: "Device ID Copied",
    timeout: 3500,
  }),
  [NETWORK__INVALID_SESSION]: () => ({
    code: MessageCode.INVALID_SESSION,
    type: MessageType.Info,
    title: "Your Session has expired",
    description: "Please login again to place your bets",
    timeout: 4000,
  }),
  [NETWORK__REALITY_CHECK_ALERT]: () => ({
    code: MessageCode.REALITY_CHECK_ALERT,
    type: MessageType.Success,
    icon: "System--safer-gambling",
    iconCentered: true,
    title: "Playing for 60 minutes. Consider a break.",
    timeout: 4000,
  }),
  [UI__CLOSED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON,
    type: MessageType.Info,
    title: "Closed",
    timeout: 3000,
  }),
  [UI__SUSPENDED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON,
    type: MessageType.Info,
    title: "Suspended",
    timeout: 3000,
  }),
  [UI__VIRTUAL_SUSPENDED_SBK_CLICK]: () => ({
    code: MessageCode.CLICK_INACTIVE_SBK_BUTTON_VIRTUALS,
    type: MessageType.Info,
    title: "In Play",
    timeout: 3000,
  }),
  [NETWORK__CASHOUT_TAKE_FAILURE_SBK]: () => ({
    code: MessageCode.CASHOUT_FAILURE,
    type: MessageType.Info,
    title: "Cashout Failed",
    timeout: 4000,
  }),
  [FETCH_CATALOGUE_RATE_LIMIT_FAILURE]: () => ({
    code: MessageCode.INVALID_SESSION,
    type: MessageType.Error,
    title: "Too many requests in a short time period",
    description: "Please contact support",
    icon: "System--notification-error",
    timeout: 4000,
  }),
};

describe("messagingHubSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe.each(Object.keys(messagingConfigMock))("when action is %s", (actionType) => {
    const messageConfig = messagingConfigMock[actionType]();

    it("should put a MESSAGING/ADD action", async () => {
      const saga = setupSagaMocks(getSaga(), messagingConfigMock);
      const action = createAction(actionType);
      await saga.putActions([action]);

      expect(saga.dispatch).toHaveBeenCalledWith({
        type: MESSAGING__ADD,
        payload: {
          code: messageConfig.code,
          type: messageConfig.type,
          title: messageConfig.title,
          description: messageConfig.description,
          icon: messageConfig.icon,
          iconCentered: messageConfig.iconCentered,
        },
      });

      saga.stopSaga();
    });

    it("should put a MESSAGING/REMOVE action after the configured time", async () => {
      const saga = setupSagaMocks(getSaga(), messagingConfigMock);
      const action = createAction(actionType);
      await saga.putActions([action], messageConfig.timeout);

      expect(saga.dispatch).toHaveBeenCalledWith({
        type: MESSAGING__REMOVE,
        payload: {
          code: messageConfig.code,
        },
      });

      saga.stopSaga();
    });

    it("should emit a additional MESSAGING/REMOVE when a another message is removed before the timeout", async () => {
      const saga = setupSagaMocks(getSaga(), messagingConfigMock);
      const action = createAction(actionType);
      await saga.putActions([action], 2000);

      await saga.putActions([{ type: MESSAGING__REMOVE, payload: { code: "konami" } }], 2000);

      expect(saga.dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: MESSAGING__ADD,
        }),
      );

      expect(saga.dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: MESSAGING__REMOVE,
        }),
      );

      expect(saga.dispatch).toHaveBeenCalledTimes(2);

      saga.stopSaga();
    });

    it("should not emit any additional MESSAGING/REMOVE when a message is removed before the timeout", async () => {
      const saga = setupSagaMocks(getSaga(), messagingConfigMock);
      const action = createAction(actionType);
      await saga.putActions([action], 2000);

      await saga.putActions([{ type: MESSAGING__REMOVE, payload: { code: messageConfig.code } }], 2000);

      expect(saga.dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: MESSAGING__ADD,
        }),
      );

      expect(saga.dispatch).toHaveBeenCalledTimes(1);

      saga.stopSaga();
    });

    describe("when an additional message is added before the timeout", () => {
      it("should cancel previous timeout if the message has the same code", async () => {
        const saga = setupSagaMocks(getSaga(), messagingConfigMock);
        const action = createAction(actionType);
        await saga.putActions([action], messageConfig.timeout / 2);
        await saga.putActions([{ type: MESSAGING__ADD, payload: { code: messageConfig.code } }]);
        await saga.putActions([action], messageConfig.timeout);

        expect(saga.dispatch).toHaveBeenCalledTimes(3);
        expect(saga.dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            type: MESSAGING__ADD,
          }),
        );
        expect(saga.dispatch).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            type: MESSAGING__ADD,
          }),
        );
        expect(saga.dispatch).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            type: MESSAGING__REMOVE,
          }),
        );

        saga.stopSaga();
      });
    });

    it("should not cancel previous timeout if the message has not the same code", async () => {
      const saga = setupSagaMocks(getSaga(), messagingConfigMock);
      const action = createAction(actionType);
      await saga.putActions([action], messageConfig.timeout / 2);
      await saga.putActions([{ type: MESSAGING__ADD, payload: { code: "dummyCode" } }]);
      await saga.putActions([action], messageConfig.timeout);

      expect(saga.dispatch).toHaveBeenCalledTimes(4);
      expect(saga.dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: MESSAGING__ADD,
        }),
      );
      expect(saga.dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: MESSAGING__ADD,
        }),
      );
      expect(saga.dispatch).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          type: MESSAGING__REMOVE,
        }),
      );
      expect(saga.dispatch).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          type: MESSAGING__REMOVE,
        }),
      );

      saga.stopSaga();
    });
  });

  describe("when timeout is not defined", () => {
    const messageConfigNoTimeout = {
      [BETTING__SBK_INVALID_LEGS_AMOUNT]: () => ({
        code: MessageCode.INVALID_LEGS_AMOUNT,
        type: MessageType.Info,
        title: "A",
        description: "B",
      }),
      [FETCH_CATALOGUE_RATE_LIMIT_FAILURE]: () => ({
        code: MessageCode.INVALID_SESSION,
        type: MessageType.Error,
        title: "Too many requests in a short time period",
        description: "Please contact support",
        icon: "System--notification-error",
      }),
      [UI__NAVIGATE_TO_EVENT_FIRST_TIME]: () => ({
        code: MessageCode.BELL_EVENT_NOTIFICATION,
        type: MessageType.Info,
        title: "Navigate to Event First Time",
        icon: "Bell Icon",
      }),
    };

    it.each(Object.keys(messageConfigNoTimeout))(
      "should terminate after put a MESSAGING/ADD action",
      async (actionName) => {
        const saga = setupSagaMocks(getSaga(), messageConfigNoTimeout);
        const action = createAction(actionName);
        await saga.putActions([action]);

        expect(saga.dispatch).toHaveBeenCalledTimes(1);
        expect(saga.dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            type: MESSAGING__ADD,
          }),
        );

        saga.stopSaga();
      },
    );
  });

  describe("when message builder returns undefined", () => {
    it("should not dispatch any messaging action", async () => {
      const messageConfigReturnsUndefined = {
        ...messagingConfigMock,
        [PN_UNSUBSCRIBE_EVENTS]: () => undefined,
      };

      const saga = setupSagaMocks(getSaga(), messageConfigReturnsUndefined);
      const action = createAction(PN_UNSUBSCRIBE_EVENTS);
      await saga.putActions([action]);

      expect(saga.dispatch).not.toHaveBeenCalled();

      saga.stopSaga();
    });
  });
});
