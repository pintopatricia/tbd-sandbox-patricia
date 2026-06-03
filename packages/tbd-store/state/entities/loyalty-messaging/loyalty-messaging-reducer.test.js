import loyaltyMessagingReducer from "./loyalty-messaging-reducer";

const initialStateMock = {
  messages: [],
};

const messageMock1 = {
  content: {
    subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
    messageType: "TOPIC_MESSAGE",
    correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
    templateId: "ToastWithHeaderBodyMessage",
    message: {
      urn: "ppb:e2e:qualificationToastMessage1",
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        header: "Over ${params.experts} experts hate him!",
        // eslint-disable-next-line no-template-curly-in-string
        text: "Learn how, in just ${params.days} days, he went from ${params.max:monetary} to ${params.min:monetary}!",
      },
      params: {
        experts: "5000",
        days: "12",
        max: "1000",
        min: "0",
      },
      displayType: "TOAST",
    },
    key: "E2E_PROGRESS",
    ackRequired: true,
    topic: "relevantMessaging",
    publishTime: "2022-03-24T14:55:09.117104",
  },
  acknowledged: false,
};

const messageMock2 = {
  content: {
    subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
    messageType: "TOPIC_MESSAGE",
    correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
    templateId: "ToastWithHeaderBodyMessage",
    message: {
      urn: "ppb:e2e:qualificationToastMessage2",
      template: {
        // eslint-disable-next-line no-template-curly-in-string
        header: "Over ${params.experts} experts kinda hate him!",
        text:
          // eslint-disable-next-line no-template-curly-in-string
          "Learn how, in just ${params.days} months, he went from ${params.min:monetary} to ${params.max:monetary}!",
      },
      params: {
        experts: "5001",
        days: "13",
        max: "1001",
        min: "1",
      },
      displayType: "TOAST",
    },
    key: "E2E_PROGRESS",
    ackRequired: true,
    topic: "relevantMessaging",
    publishTime: "2022-03-24T14:55:09.117104",
  },
  acknowledged: false,
};

describe("Loyalty Messaging Reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = loyaltyMessagingReducer(undefined, { type: "UNKNOWN_ACTION" });
      expect(state).toEqual({ ...initialStateMock });
    });
  });

  describe('when action type is "LOYALTY/RECEIVE_MESSAGE"', () => {
    it("must return the new state with the message", () => {
      const action = {
        type: "LOYALTY/RECEIVE_MESSAGE",
        payload: { ...messageMock1 },
      };

      const expectedState = {
        messages: [{ ...messageMock1 }],
      };

      const state = loyaltyMessagingReducer(initialStateMock, action);

      expect(state).toEqual(expectedState);
    });

    describe("and there's already a messaged stacked", () => {
      it("must return the new state with two messages", () => {
        const action = {
          type: "LOYALTY/RECEIVE_MESSAGE",
          payload: { ...messageMock1 },
        };

        const oldMessage = { ...messageMock1, acknowledged: true };

        const stateMock = { messages: [{ ...oldMessage }] };

        const expectedState = {
          messages: [{ ...messageMock1 }, { ...oldMessage }],
        };

        const state = loyaltyMessagingReducer(stateMock, action);

        expect(state).toEqual(expectedState);
      });
    });
  });

  describe('when action type is "LOYALTY/ACKNOWLEDGE_MESSAGE"', () => {
    it('should modify the "acknowledged" flag', () => {
      const action = {
        type: "LOYALTY/ACKNOWLEDGE_MESSAGE",
        payload: { ...messageMock1.content },
      };

      const stateMock = { messages: [{ ...messageMock1 }] };

      const expectedState = {
        messages: [{ ...messageMock1, acknowledged: true }],
      };

      const state = loyaltyMessagingReducer(stateMock, action);

      expect(state).toEqual(expectedState);
    });

    it("should acknowledge and modify the order", () => {
      const action = {
        type: "LOYALTY/ACKNOWLEDGE_MESSAGE",
        payload: { ...messageMock1.content },
      };

      const stateMock = {
        messages: [{ ...messageMock1 }, { ...messageMock2, acknowledged: true }],
      };

      const expectedState = {
        messages: [
          { ...messageMock1, acknowledged: true },
          { ...messageMock2, acknowledged: true },
        ],
      };

      const state = loyaltyMessagingReducer(stateMock, action);

      expect(state).toEqual(expectedState);
    });
  });
});
