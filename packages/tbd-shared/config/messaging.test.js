import { FETCH_CATALOGUE_RATE_LIMIT_FAILURE, MessageCode, MessageType } from "@ppb/tbd-store";
import {
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
} from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_INVALID_LEGS_AMOUNT } from "@ppb/tbd-store/actions/betting";
import {
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
} from "@ppb/tbd-store/actions/my-bets";
import { NETWORK__INVALID_SESSION } from "@ppb/tbd-store/actions/app-context";
import { UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "@ppb/tbd-store/actions/navigation";
import { NETWORK__REALITY_CHECK_ALERT } from "@ppb/tbd-store/actions/notification";
import { NETWORK__CASHOUT_TAKE_FAILURE_SBK } from "@ppb/tbd-store/actions/cashout";
import { getErrorMessageTranslatedKey } from "@ppb/tbd-store/helpers/receipt";
import {
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
  UI__VIRTUAL_SUSPENDED_SBK_CLICK,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { UI__OBB_INPLAY_BET_CLICK } from "@ppb/tbd-store/actions/obb";

import { i18n } from "../helpers/i18n";

import { MESSAGE_CONFIG_MAP } from "./messaging";

import { SystemIconName } from "@ppb/the-wall-icons";
import {
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
} from "@ppb/tbd-store/actions/push-notifications";

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/helpers/receipt", () => ({
  getErrorMessageTranslatedKey: jest.fn(() => ({ translate: { key: "I18N.CASHOUT.MESSAGES.SOME_ERROR" } })),
}));

jest.mock("@ppb/tbd-store/helpers/obb", () => ({
  buildMessageTitle: jest.fn(() => ({ key: "MOCK_TITLE" })),
}));

describe("Messaging", () => {
  beforeEach(jest.clearAllMocks);

  describe("BETTING__SBK_INVALID_LEGS_AMOUNT mapper", () => {
    const action = {
      type: BETTING__SBK_INVALID_LEGS_AMOUNT,
      payload: { limit: 25 },
    };

    it("should return INVALID_LEGS_AMOUNT message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.INVALID_LEGS_AMOUNT);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.MAX_SELECTIONS_EXCEEDED",
      });

      expect(message.title).toEqual("I18N.MESSAGING.TITLE.MAX_SELECTIONS_EXCEEDED");
    });

    it("should return translated description with limit", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.DESCRIPTION.MAX_SELECTIONS_EXCEEDED",
        interpolationValues: { selections: 25 },
      });
      expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.MAX_SELECTIONS_EXCEEDED");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(4000);
    });
  });

  describe("LA_SUBSCRIBE_EVENTS_SUCCESS mapper", () => {
    const action = { type: LA_SUBSCRIBE_EVENTS_SUCCESS };

    it("should return LIVE_ACTIVITY_SUBSCRIBED_SUCCESS message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.code).toEqual(MessageCode.LIVE_ACTIVITY_SUBSCRIBED_SUCCESS);
    });

    it("should return MessageType Success", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.type).toEqual(MessageType.Success);
    });

    it("should return the live activities title and description", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.title).toEqual("I18N.EVENT.LIVE_ACTIVITIES_SUBSCRIBED");
      expect(message.description).toEqual("I18N.EVENT.LIVE_ACTIVITIES_SUBSCRIBED_DESC");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.timeout).toEqual(4000);
    });
  });

  describe("LA_UNSUBSCRIBE_EVENTS_SUCCESS mapper", () => {
    const action = { type: LA_UNSUBSCRIBE_EVENTS_SUCCESS };

    it("should return LIVE_ACTIVITY_UNSUBSCRIBED_SUCCESS message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.code).toEqual(MessageCode.LIVE_ACTIVITY_UNSUBSCRIBED_SUCCESS);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return the live activities unsubscribed title and description", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.title).toEqual("I18N.EVENT.LIVE_ACTIVITIES_UNSUBSCRIBED");
      expect(message.description).toEqual("I18N.EVENT.LIVE_ACTIVITIES_UNSUBSCRIBED_DESC");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);
      expect(message.timeout).toEqual(4000);
    });
  });

  describe("NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS mapper", () => {
    const action = {
      type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
      payload: { selectionName: "mockRunnerDesc" },
    };

    it("should return CANCEL_UNMATCHED_BET_SUCCESS message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CANCEL_UNMATCHED_BET_SUCCESS);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Success);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.SINGLE_BET_CANCELLED",
      });

      expect(message.title).toEqual("I18N.MESSAGING.TITLE.SINGLE_BET_CANCELLED");
    });

    it("should return translated description with runnerDesc", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.DESCRIPTION.SINGLE_BET_CANCELLED",
        interpolationValues: { selection: "mockRunnerDesc" },
      });

      expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.SINGLE_BET_CANCELLED");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(4000);
    });
  });

  describe("NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS mapper", () => {
    const action = {
      type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
      payload: { numberOfBets: 2, marketName: "mockMarketName", event: "mockEventName" },
    };

    it("should return CANCEL_ALL_UNMATCHED_BETS_SUCCESS message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CANCEL_ALL_UNMATCHED_BETS_SUCCESS);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Success);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.MULTI_BETS_CANCELLED",
      });
      expect(message.title).toEqual("I18N.MESSAGING.TITLE.MULTI_BETS_CANCELLED");
    });

    it("should return translated description with correct interpolationValues", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.DESCRIPTION.MULTI_BETS_CANCELLED",
        interpolationValues: { nbets: 2, market: "mockMarketName", event: "mockEventName" },
      });

      expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.MULTI_BETS_CANCELLED");
    });

    describe("when event is null", () => {
      it("should return event description with interpolation with an empty string", () => {
        const message = MESSAGE_CONFIG_MAP[action.type]({
          ...action,
          payload: {
            ...action.payload,
            event: undefined,
          },
        });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MESSAGING.DESCRIPTION.MULTI_BETS_CANCELLED",
          interpolationValues: { nbets: 2, market: "mockMarketName", event: "" },
        });

        expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.MULTI_BETS_CANCELLED");
      });
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(4000);
    });
  });

  describe("UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY mapper", () => {
    const action = {
      type: UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
    };

    it("should return COPY_ID_INFO message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.COPY_ID_INFO);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MYBETS.BETID_COPY_MESSAGE",
      });
      expect(message.title).toEqual("I18N.MYBETS.BETID_COPY_MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY mapper", () => {
    const action = {
      type: UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
    };

    it("should return COPY_ID_INFO message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.COPY_ID_INFO);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MYBETS.BETID_AUX_COPY_MESSAGE",
      });
      expect(message.title).toEqual("I18N.MYBETS.BETID_AUX_COPY_MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__MY_BETS_COPY_BET_ID mapper", () => {
    const action = {
      type: UI__MY_BETS_COPY_BET_ID,
    };

    it("should return COPY_ID_INFO message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.COPY_ID_INFO);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MYBETS.BETID_COPY_MESSAGE",
      });
      expect(message.title).toEqual("I18N.MYBETS.BETID_COPY_MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__MY_BETS_COPY_REGULATOR_BET_ID mapper", () => {
    const action = {
      type: UI__MY_BETS_COPY_REGULATOR_BET_ID,
    };

    it("should return COPY_ID_INFO message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.COPY_ID_INFO);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MYBETS.BETID_AUX_COPY_MESSAGE",
      });
      expect(message.title).toEqual("I18N.MYBETS.BETID_AUX_COPY_MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__MY_BETS_COPY_DEVICE_ID mapper", () => {
    const action = {
      type: UI__MY_BETS_COPY_DEVICE_ID,
    };

    it("should return COPY_ID_INFO message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.COPY_ID_INFO);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledTimes(1);
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MYBETS.DEVICE_ID_COPY_MESSAGE",
      });
      expect(message.title).toEqual("I18N.MYBETS.DEVICE_ID_COPY_MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__CLOSED_SBK_CLICK mapper", () => {
    const action = {
      type: UI__CLOSED_SBK_CLICK,
    };

    it("should return UI__CLOSED_SBK_CLICK message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CLICK_INACTIVE_SBK_BUTTON);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MARKET.CLOSED",
      });
      expect(message.title).toEqual("I18N.MARKET.CLOSED");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("UI__SUSPENDED_SBK_CLICK mapper", () => {
    const action = {
      type: UI__SUSPENDED_SBK_CLICK,
    };

    it("should return UI__SUSPENDED_SBK_CLICK message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CLICK_INACTIVE_SBK_BUTTON);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MARKET.SUSPENDED",
      });
      expect(message.title).toEqual("I18N.MARKET.SUSPENDED");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("NETWORK__INVALID_SESSION mapper", () => {
    const action = {
      type: NETWORK__INVALID_SESSION,
    };

    it("should return INVALID_SESSION message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.INVALID_SESSION);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.INVALID_SESSION",
      });

      expect(message.title).toEqual("I18N.MESSAGING.TITLE.INVALID_SESSION");
    });

    it("should return translated description", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.DESCRIPTION.INVALID_SESSION",
      });

      expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.INVALID_SESSION");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(4000);
    });
  });

  describe("NETWORK__REALITY_CHECK_ALERT mapper", () => {
    const action = {
      type: NETWORK__REALITY_CHECK_ALERT,
      payload: {
        duration: 60,
      },
    };

    it("should return REALITY_CHECK_ALERT message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.REALITY_CHECK_ALERT);
    });

    it("should return MessageType Success", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Success);
    });

    it("should return a SAFER GAMBLING icon", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.icon).toEqual(SystemIconName.SAFER_GAMBLING);
      expect(message.iconCentered).toBe(true);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.SESSION_DURATION_REGULATORY_ALERT",
        interpolationValues: {
          duration: 60,
        },
      });

      expect(message.title).toEqual("I18N.MESSAGING.TITLE.SESSION_DURATION_REGULATORY_ALERT");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(5000);
    });
  });

  describe("UI__NAVIGATE_TO_EVENT_FIRST_TIME mapper", () => {
    const action = {
      type: UI__NAVIGATE_TO_EVENT_FIRST_TIME,
    };

    it("should return BELL_EVENT_NOTIFICATION message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.BELL_EVENT_NOTIFICATION);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.NOTIFICATION.TITLE.BELL_EVENT_NOTIFICATION",
      });

      expect(message.title).toEqual("I18N.NOTIFICATION.TITLE.BELL_EVENT_NOTIFICATION");
    });
  });

  describe("UI__VIRTUAL_SUSPENDED_SBK_CLICK mapper", () => {
    const action = {
      type: UI__VIRTUAL_SUSPENDED_SBK_CLICK,
    };

    it("should return UI__VIRTUAL_SUSPENDED_SBK_CLICK message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CLICK_INACTIVE_SBK_BUTTON_VIRTUALS);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.SPORT_EVENT.IN_PLAY",
      });
      expect(message.title).toEqual("I18N.SPORT_EVENT.IN_PLAY");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });
  describe("NETWORK__CASHOUT_TAKE_FAILURE_SBK mapper", () => {
    const action = {
      type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
      payload: { errorCode: "SOME_ERROR" },
    };

    it("should return NETWORK__CASHOUT_TAKE_FAILURE_SBK message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CASHOUT_FAILURE);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      getErrorMessageTranslatedKey.mockReturnValueOnce({ translate: { key: "I18N.CASHOUT.MESSAGES.SOME_ERROR" } });
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.CASHOUT.MESSAGES.SOME_ERROR",
      });
      expect(message.title).toEqual("I18N.CASHOUT.MESSAGES.SOME_ERROR");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(4000);
    });
  });
  describe("FETCH_CATALOGUE_RATE_LIMIT_FAILURE mapper", () => {
    const getAction = ({ loggedIn }) => ({
      type: FETCH_CATALOGUE_RATE_LIMIT_FAILURE,
      payload: { loggedIn },
    });

    const action = getAction({ loggedIn: true });

    it("should return INVALID SESSION message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.INVALID_SESSION);
    });

    it("should return MessageType Error", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Error);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.MESSAGING.TITLE.TOO_MANY_REQUESTS",
      });
      expect(message.title).toEqual("I18N.MESSAGING.TITLE.TOO_MANY_REQUESTS");
    });

    it("should return a NOTIFICATION ERROR icon", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.icon).toEqual(SystemIconName.NOTIFICATION_ERROR);
      expect(message.iconCentered).toBe(true);
    });

    describe("when user is logged in", () => {
      it("should return description as 'Please contact support'", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        getErrorMessageTranslatedKey.mockReturnValueOnce({
          translate: { key: "I18N.MESSAGING.DESCRIPTION.PLEASE_CONTACT_SUPPORT" },
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MESSAGING.DESCRIPTION.PLEASE_CONTACT_SUPPORT",
        });
        expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.PLEASE_CONTACT_SUPPORT");
      });
    });
    describe("when user is logged out", () => {
      it("should return description as 'Please login to continue'", () => {
        const action = getAction({ loggedIn: false });
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        getErrorMessageTranslatedKey.mockReturnValueOnce({
          translate: { key: "I18N.MESSAGING.DESCRIPTION.PLEASE_LOGIN_TO_CONTINUE" },
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MESSAGING.DESCRIPTION.PLEASE_LOGIN_TO_CONTINUE",
        });
        expect(message.description).toEqual("I18N.MESSAGING.DESCRIPTION.PLEASE_LOGIN_TO_CONTINUE");
      });
    });
  });

  describe("UI__OBB_INPLAY_BET_CLICK", () => {
    const action = {
      type: UI__OBB_INPLAY_BET_CLICK,
      payload: { legTemplateId: "some-template" },
    };

    it("should return CLICK_INACTIVE_SBK_BUTTON message code", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.code).toEqual(MessageCode.CLICK_INACTIVE_SBK_BUTTON);
    });

    it("should return MessageType Info", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.type).toEqual(MessageType.Info);
    });

    it("should return translated title", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.title).toEqual("MOCK_TITLE");
    });

    it("should return translated description with runnerDesc", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.OBB.GENERIC.DISABLED.MESSAGE",
      });

      expect(message.description).toEqual("I18N.OBB.GENERIC.DISABLED.MESSAGE");
    });

    it("should return a timeout", () => {
      const message = MESSAGE_CONFIG_MAP[action.type](action);

      expect(message.timeout).toEqual(3000);
    });
  });

  describe("PN_UNSUBSCRIBE_EVENTS", () => {
    describe("when showToastMessage is true", () => {
      const action = {
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: { showToastMessage: true },
      };

      it("should return NOTIFICATIONS_UNSUBSCRIBED message code", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message.code).toEqual(MessageCode.NOTIFICATIONS_UNSUBSCRIBED);
      });

      it("should return MessageType Info", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message.type).toEqual(MessageType.Info);
      });

      it("should return translated title", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message.title).toEqual("I18N.NOTIFICATION.UNSUBSCRIPTION_TITLE");
      });

      it("should return translated description", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.NOTIFICATION.UNSUBSCRIPTION_DESCRIPTION",
        });

        expect(message.description).toEqual("I18N.NOTIFICATION.UNSUBSCRIPTION_DESCRIPTION");
      });

      it("should return a NOTIFICATION_OFF icon", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message.icon).toEqual(SystemIconName.NOTIFICATION_OFF);
      });

      it("should return a timeout", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message.timeout).toEqual(4000);
      });
    });

    describe("when showToastMessage is false", () => {
      const action = {
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: { showToastMessage: false },
      };

      it("should return undefined", () => {
        const message = MESSAGE_CONFIG_MAP[action.type](action);

        expect(message).toBeUndefined();
      });
    });
  });
});
