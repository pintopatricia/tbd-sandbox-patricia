import notificationsReducer from "./notifications-reducer";
import { UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../../../actions/navigation";
import {
  PN_REGISTER_DEVICE,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_NATIVE_PROMPT_SHOWN_EVENT,
} from "../../../actions/push-notifications";

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    event: {
      encode: jest.fn((id) => ({
        uid: id,
      })),
    },
    race: {
      encode: jest.fn((id) => ({
        uid: `race:${id}`,
      })),
    },
  },
}));

describe("notificationsReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = notificationsReducer(undefined, {});

      expect(state).toEqual({
        subscribedEventIds: [],
        unsupportedEventIds: [],
        wasNotificationNativePromptShown: false,
        wasNotificationHowToSubscribeEventsShown: false,
      });
    });
  });

  describe("when PN_REGISTER_DEVICE action type is received", () => {
    it("should update the device info", () => {
      const action = {
        type: PN_REGISTER_DEVICE,
        payload: {
          deviceOptions: "deviceOptions",
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
        },
      };

      const state = notificationsReducer({}, action);

      expect(state).toEqual({
        deviceInfo: {
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
          registerOptions: "deviceOptions",
        },
      });
    });
  });

  describe("when PN_SUBSCRIBE_EVENTS_SUCCESS action type is received", () => {
    describe("and there are already subscribed events", () => {
      it("should add the event to the list of subscribed events", () => {
        const action = {
          type: PN_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer(
          {
            subscribedEventIds: ["2"],
          },
          action,
        );

        expect(state).toEqual({
          subscribedEventIds: ["2", "1"],
        });
      });
    });

    describe("and there are no subscribed events", () => {
      it("should create a list with the new event", () => {
        const action = {
          type: PN_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer(undefined, action);

        expect(state).toEqual({
          subscribedEventIds: ["1"],
          unsupportedEventIds: [],
          wasNotificationHowToSubscribeEventsShown: false,
          wasNotificationNativePromptShown: false,
        });
      });
    });

    describe("and the event is already subscribed", () => {
      it("should not add it to the list", () => {
        const action = {
          type: PN_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["2"],
          },
        };

        const state = notificationsReducer({ subscribedEventIds: ["2"] }, action);

        expect(state).toEqual({
          subscribedEventIds: ["2"],
        });
      });
    });
  });

  describe("when PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS action type is received", () => {
    describe("and there are already subscribed and unsupported events", () => {
      it("should add the events to the list of subscribed and unsupported events", () => {
        const action = {
          type: PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["1"],
            unsupportedEventIds: ["2"],
          },
        };

        const state = notificationsReducer(
          {
            subscribedEventIds: ["3"],
            unsupportedEventIds: ["4"],
          },
          action,
        );

        expect(state).toEqual({
          subscribedEventIds: ["3", "1"],
          unsupportedEventIds: ["4", "2"],
        });
      });
    });

    describe("and there are no subscribed and unsupported events", () => {
      it("should create lists for the new events", () => {
        const action = {
          type: PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["1"],
            unsupportedEventIds: ["2"],
          },
        };

        const state = notificationsReducer(undefined, action);

        expect(state).toEqual({
          subscribedEventIds: ["1"],
          unsupportedEventIds: ["2"],
          wasNotificationNativePromptShown: false,
          wasNotificationHowToSubscribeEventsShown: false,
        });
      });
    });

    describe("and the events are already subscribed and unsupported", () => {
      it("should not add them to the lists", () => {
        const action = {
          type: PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: ["1"],
            unsupportedEventIds: ["2"],
          },
        };

        const state = notificationsReducer({ subscribedEventIds: ["1"], unsupportedEventIds: ["2"] }, action);

        expect(state).toEqual({
          subscribedEventIds: ["1"],
          unsupportedEventIds: ["2"],
        });
      });
    });

    describe("and an unsupported event is already subscribed", () => {
      it("should not add it to the unsupported list", () => {
        const action = {
          type: PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            supportedEventIds: [],
            unsupportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer({ subscribedEventIds: ["1"], unsupportedEventIds: [] }, action);

        expect(state).toEqual({
          subscribedEventIds: ["1"],
          unsupportedEventIds: [],
        });
      });
    });
  });

  describe("when PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS action type is received", () => {
    describe("and there are already unsupported events", () => {
      it("should add the event on the list of unsupported events", () => {
        const action = {
          type: PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            unsupportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer(
          {
            subscribedEventIds: [],
            unsupportedEventIds: ["2"],
          },
          action,
        );

        expect(state).toEqual({
          subscribedEventIds: [],
          unsupportedEventIds: ["2", "1"],
        });
      });
    });

    describe("and there are no unsupported events", () => {
      it("should create a list with the new event", () => {
        const action = {
          type: PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            unsupportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer(undefined, action);

        expect(state).toEqual({
          subscribedEventIds: [],
          unsupportedEventIds: ["1"],
          wasNotificationNativePromptShown: false,
          wasNotificationHowToSubscribeEventsShown: false,
        });
      });
    });

    describe("and the event is already subscribed and unsupported", () => {
      it("should not add it to the list", () => {
        const action = {
          type: PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            unsupportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer({ subscribedEventIds: [], unsupportedEventIds: ["1"] }, action);

        expect(state).toEqual({
          subscribedEventIds: [],
          unsupportedEventIds: ["1"],
        });
      });
    });

    describe("and an unsupported event is already subscribed", () => {
      it("should not add it to the unsupported list", () => {
        const action = {
          type: PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
          payload: {
            unsupportedEventIds: ["1"],
          },
        };

        const state = notificationsReducer({ subscribedEventIds: ["1"], unsupportedEventIds: [] }, action);

        expect(state).toEqual({
          subscribedEventIds: ["1"],
          unsupportedEventIds: [],
        });
      });
    });
  });

  describe("when PN_UNSUBSCRIBE_EVENTS action type is received", () => {
    describe("and there event is on the subscribed list", () => {
      describe("and the eventType is FOOTBALL", () => {
        it("should remove the event from the list of subscribed events", () => {
          const action = {
            type: PN_UNSUBSCRIBE_EVENTS,
            payload: {
              topics: [{ topicId: "1", eventType: "FOOTBALL" }],
              unsupportedTopics: [],
            },
          };

          const state = notificationsReducer(
            {
              subscribedEventIds: ["2", "1", "3"],
              unsupportedEventIds: [],
            },
            action,
          );

          expect(state).toEqual({
            subscribedEventIds: ["2", "3"],
            unsupportedEventIds: [],
          });
        });
      });

      describe("and the eventType is HORSE_RACE", () => {
        it("should remove the event from the list of subscribed events", () => {
          const action = {
            type: PN_UNSUBSCRIBE_EVENTS,
            payload: {
              topics: [{ topicId: "1", eventType: "HORSE_RACE" }],
              unsupportedTopics: [],
            },
          };

          const state = notificationsReducer(
            {
              subscribedEventIds: ["2", "1", "3"],
              unsupportedEventIds: [],
            },
            action,
          );

          expect(state).toEqual({
            subscribedEventIds: ["2", "3"],
            unsupportedEventIds: [],
          });
        });
      });
    });

    describe("and there event is on the unsupported list", () => {
      describe("and the eventType is FOOTBALL", () => {
        it("should remove the event from the list of unsupported events", () => {
          const action = {
            type: PN_UNSUBSCRIBE_EVENTS,
            payload: {
              topics: [{ topicId: "1", eventType: "FOOTBALL" }],
              unsupportedTopics: [],
            },
          };

          const state = notificationsReducer(
            {
              subscribedEventIds: [],
              unsupportedEventIds: ["2", "1", "3"],
            },
            action,
          );

          expect(state).toEqual({
            subscribedEventIds: [],
            unsupportedEventIds: ["2", "3"],
          });
        });
      });

      describe("and the eventType is HORSE_RACE", () => {
        it("should remove the event from the list of unsupported events", () => {
          const action = {
            type: PN_UNSUBSCRIBE_EVENTS,
            payload: {
              topics: [{ topicId: "1", eventType: "HORSE_RACE" }],
              unsupportedTopics: [],
            },
          };

          const state = notificationsReducer(
            {
              subscribedEventIds: [],
              unsupportedEventIds: ["2", "1", "3"],
            },
            action,
          );

          expect(state).toEqual({
            subscribedEventIds: [],
            unsupportedEventIds: ["2", "3"],
          });
        });
      });
    });

    describe("and event is not subscribed", () => {
      it("should keep state", () => {
        const action = {
          type: PN_UNSUBSCRIBE_EVENTS,
          payload: {
            topics: [{ topicSpecification: { eventId: "5" } }],
            unsupportedTopics: [],
          },
        };

        const state = notificationsReducer(
          {
            subscribedEventIds: ["2", "1", "3"],
            unsupportedEventIds: [],
          },
          action,
        );

        expect(state).toEqual({
          subscribedEventIds: ["2", "1", "3"],
          unsupportedEventIds: [],
        });
      });
    });
  });

  describe("when PN_NATIVE_PROMPT_SHOWN_EVENT action type is received", () => {
    it("should update the wasNotificationNativePromptShown flag", () => {
      const action = {
        type: PN_NATIVE_PROMPT_SHOWN_EVENT,
      };

      const state = notificationsReducer({}, action);

      expect(state).toEqual({ wasNotificationNativePromptShown: true });
    });
  });

  describe("when UI__NAVIGATE_TO_EVENT_FIRST_TIME action type is received", () => {
    it("should update the wasNotificationHowToSubscribeEventsShown flag", () => {
      const action = {
        type: UI__NAVIGATE_TO_EVENT_FIRST_TIME,
      };

      const state = notificationsReducer({}, action);

      expect(state).toEqual({ wasNotificationHowToSubscribeEventsShown: true });
    });
  });
});
