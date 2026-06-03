import { PUSH, REFRESH } from "../../../actions";
import { MESSAGING__ADD, MESSAGING__REMOVE, UI__MESSAGING_REMOVE } from "../../../actions/messaging";
import { UI__BETSLIP_SET_COLLAPSE_ACTION } from "../../../actions/betslip";
import {
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
} from "../../../actions/push-notifications";
import { UI__MY_BETS_ORDER_TYPE_FILTER_CLICK } from "../../../actions/my-bets";
import { MessageCode, MessageType } from "../../constants";

import messagesReducer from "./messages-reducer";

let stateMock;

describe("'messages' reducer", () => {
  beforeEach(() => {
    stateMock = {
      1: {
        code: MessageCode.INVALID_LEGS_AMOUNT,
        type: MessageType.Info,
        title: "A",
        description: "B",
      },
      messagesByTypeOrder: new Set([1]),
    };
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = messagesReducer(undefined, {});

      expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
    });
  });

  describe("when action type is 'MESSAGING/ADD'", () => {
    describe("when the message doesn't exist", () => {
      it("must return current state merged with the new one", () => {
        const action = {
          type: MESSAGING__ADD,
          payload: {
            code: 2,
            title: "C",
            description: "D",
            type: MessageType.Error,
            icon: "Message Icon",
            iconCentered: true,
          },
        };
        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({
          1: {
            code: MessageCode.INVALID_LEGS_AMOUNT,
            type: MessageType.Info,
            title: "A",
            description: "B",
          },
          2: {
            code: 2,
            type: MessageType.Error,
            title: "C",
            description: "D",
            icon: "Message Icon",
            iconCentered: true,
          },
          messagesByTypeOrder: new Set([1, 2]),
        });
      });
    });

    describe("when the message exists", () => {
      it("must return current message state merged with the new one", () => {
        const action = {
          type: MESSAGING__ADD,
          payload: {
            code: 1,
            title: "C",
            description: "D",
            icon: "E",
            type: MessageType.Error,
          },
        };
        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({
          1: {
            code: MessageCode.INVALID_LEGS_AMOUNT,
            type: MessageType.Error,
            title: "C",
            description: "D",
            icon: "E",
          },
          messagesByTypeOrder: new Set([1]),
        });
      });
    });
  });

  describe("when action type is 'MESSAGING/REMOVE'", () => {
    describe("when the message doesn't exist", () => {
      it("must return current state", () => {
        const action = {
          type: MESSAGING__REMOVE,
          payload: {
            code: 2,
          },
        };
        const state = messagesReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the message exists", () => {
      it("must return state without the message", () => {
        const action = {
          type: MESSAGING__REMOVE,
          payload: {
            code: 1,
          },
        };
        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
      });
    });
  });

  describe("when action type is 'UI/MESSAGING_REMOVE'", () => {
    describe("when the message doesn't exist", () => {
      it("must return current state", () => {
        const action = {
          type: UI__MESSAGING_REMOVE,
          payload: { code: 2 },
        };

        const state = messagesReducer(
          {
            ...stateMock,
            2: {
              code: 2,
              type: MessageType.Error,
              title: "C",
              description: "D",
            },
            messagesByTypeOrder: new Set([1, 2]),
          },
          action,
        );

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the message exists", () => {
      it("must return state without the message", () => {
        const action = {
          type: UI__MESSAGING_REMOVE,
          payload: { code: 1 },
        };

        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_SET_COLLAPSE_ACTION'", () => {
    describe("and `collapse` is true", () => {
      it("must return current state", () => {
        const action = {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: { collapse: true },
        };

        const state = messagesReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("and `collapse` is false", () => {
      it("must return state without messages", () => {
        const action = {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: { collapse: false },
        };

        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
      });
    });
  });

  describe.each([
    UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
    PN_SUBSCRIBE_EVENTS_SUCCESS,
    LA_SUBSCRIBE_EVENTS_SUCCESS,
    LA_UNSUBSCRIBE_EVENTS_SUCCESS,
    PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
    PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
    PUSH,
    REFRESH,
  ])("when action type is %s", (actionType) => {
    it("must return an empty state", () => {
      const action = { type: actionType };

      const state = messagesReducer(stateMock, action);

      expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
    });
  });

  describe("when action type is PN_UNSUBSCRIBE_EVENTS", () => {
    describe("when `showToastMessage` is true", () => {
      it("must return an empty state", () => {
        const action = {
          type: PN_UNSUBSCRIBE_EVENTS,
          payload: { showToastMessage: true },
        };

        const state = messagesReducer(stateMock, action);

        expect(state).toEqual({ messagesByTypeOrder: new Set([]) });
      });
    });

    describe("when `showToastMessage` is false", () => {
      it("must return the current state unchanged", () => {
        const action = {
          type: PN_UNSUBSCRIBE_EVENTS,
          payload: { showToastMessage: false },
        };

        const state = messagesReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });
  });
});
