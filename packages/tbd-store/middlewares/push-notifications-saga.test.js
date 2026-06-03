import setupSagaMocks from "../saga-jest-setup";
import { PN_REGISTER_DEVICE, PN_SUBSCRIBE_EVENTS, PN_UNSUBSCRIBE_EVENTS } from "../actions/push-notifications";
import notificationSubscriptionService from "../services/notification-subscription-service";

jest.mock("../services/notification-subscription-service", () => ({
  register: jest.fn(),
  subscribeToEvents: jest.fn().mockReturnValue([]),
  unsubscribeFromEvents: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ pushNotificationsSaga: saga } = require("./push-notifications-saga"));
  });
  return setupSagaMocks(saga);
}

describe("pushNotificationsSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("when PN_REGISTER_DEVICE is dispatched", () => {
    it("should call register with the correct arguments", async () => {
      const { putActions, stopSaga, advanceTimersByTime } = setup();

      const action = {
        type: PN_REGISTER_DEVICE,
        payload: { applicationTypeId: "applicationTypeId", deviceId: "deviceId", deviceOptions: {} },
      };

      await putActions([action]);
      await advanceTimersByTime(250);

      expect(notificationSubscriptionService.register).toHaveBeenCalledWith("applicationTypeId", "deviceId", {});

      stopSaga();
    });

    it("should swallow errors thrown by register and keep the saga alive", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.register.mockImplementationOnce(() => {
        throw new Error("register failed");
      });

      const { putActions, stopSaga, advanceTimersByTime } = setup();

      const action = {
        type: PN_REGISTER_DEVICE,
        payload: { applicationTypeId: "applicationTypeId", deviceId: "deviceId", deviceOptions: {} },
      };

      await expect(putActions([action])).resolves.not.toThrow();
      await advanceTimersByTime(250);

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      stopSaga();
    });
  });

  describe("when PN_SUBSCRIBE_EVENTS is dispatched", () => {
    it("should call subscribeToEvents with the correct arguments", async () => {
      const { putActions, stopSaga } = setup();

      const action = {
        type: PN_SUBSCRIBE_EVENTS,
        payload: { applicationTypeId: "applicationTypeId", deviceId: "deviceId", locale: "en-GB", topics: [] },
      };

      await putActions([action]);

      expect(notificationSubscriptionService.subscribeToEvents).toHaveBeenCalledWith(
        "applicationTypeId",
        "deviceId",
        "en-GB",
        [],
      );

      stopSaga();
    });

    describe("when all events subscribed are returned from service", () => {
      const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
      const returnedEvents = subscribedEvents;

      it("should dispatch success action", async () => {
        const { putActions, dispatch, getState, stopSaga } = setup();

        getState.mockReturnValue({
          entities: {
            notifications: {
              subscribedEventIds: [],
            },
          },
        });

        const action = {
          payload: {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            locale: "en-GB",
            topics: subscribedEvents,
            unsupportedTopics: [],
          },
          type: PN_SUBSCRIBE_EVENTS,
        };

        notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "PN_SUBSCRIBE_EVENTS_SUCCESS",
          payload: {
            supportedEventIds: ["1", "2"],
            label: "enabled live alerts",
          },
        });

        stopSaga();
      });
    });

    describe("when not all events subscribed are returned from service", () => {
      describe("and there are no previously subscribed events that match subscribed ones", () => {
        const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
        const returnedEvents = [{ topicId: "2" }];

        it("should dispatch partial success action", async () => {
          const { putActions, dispatch, getState, stopSaga } = setup();

          getState.mockReturnValue({
            entities: {
              notifications: {
                subscribedEventIds: [],
              },
            },
          });

          const action = {
            type: PN_SUBSCRIBE_EVENTS,
            payload: {
              applicationTypeId: "applicationTypeId",
              deviceId: "deviceId",
              locale: "en-GB",
              topics: subscribedEvents,
              unsupportedTopics: [],
            },
          };

          notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            type: "PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS",
            payload: {
              supportedEventIds: ["2"],
              unsupportedEventIds: ["1"],
              label: "partial live alerts",
            },
          });

          stopSaga();
        });
      });

      describe("and there are previously subscribed events that match subscribed ones", () => {
        const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
        const returnedEvents = [{ topicId: "2" }];

        it("should dispatch success action", async () => {
          const { putActions, dispatch, getState, stopSaga } = setup();

          getState.mockReturnValue({
            entities: {
              notifications: {
                subscribedEventIds: ["1"],
              },
            },
          });

          const action = {
            type: PN_SUBSCRIBE_EVENTS,
            payload: {
              applicationTypeId: "applicationTypeId",
              deviceId: "deviceId",
              locale: "en-GB",
              topics: subscribedEvents,
              unsupportedTopics: [],
            },
          };

          notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            type: "PN_SUBSCRIBE_EVENTS_SUCCESS",
            payload: {
              supportedEventIds: ["2", "1"],
              label: "enabled live alerts",
            },
          });

          stopSaga();
        });
      });
    });
  });

  describe("when all events subscribed are not returned from service", () => {
    describe("and there are no previously subscribed events that match subscribed ones", () => {
      const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
      const returnedEvents = [];

      it("should dispatch unsupported success action", async () => {
        const { putActions, dispatch, getState, stopSaga } = setup();

        getState.mockReturnValue({
          entities: {
            notifications: {
              subscribedEventIds: [],
            },
          },
        });

        const action = {
          type: PN_SUBSCRIBE_EVENTS,
          payload: {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            locale: "en-GB",
            topics: subscribedEvents,
            unsupportedTopics: [],
          },
        };

        notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS",
          payload: {
            unsupportedEventIds: ["1", "2"],
            label: "there are no notifications available",
          },
        });

        stopSaga();
      });
    });

    describe("and there are previously subscribed events that match subscribed ones", () => {
      const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
      const returnedEvents = [];

      it("should dispatch partial success action", async () => {
        const { putActions, dispatch, getState, stopSaga } = setup();

        getState.mockReturnValue({
          entities: {
            notifications: {
              subscribedEventIds: ["1"],
            },
          },
        });

        const action = {
          type: PN_SUBSCRIBE_EVENTS,
          payload: {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            locale: "en-GB",
            topics: subscribedEvents,
            unsupportedTopics: [],
          },
        };

        notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS",
          payload: {
            supportedEventIds: ["1"],
            unsupportedEventIds: ["2"],
            label: "partial live alerts",
          },
        });

        stopSaga();
      });
    });

    describe("and there are previously subscribed events that match all subscribed ones", () => {
      const subscribedEvents = [{ topicId: "1" }, { topicId: "2" }];
      const returnedEvents = [];

      it("should dispatch success action", async () => {
        const { putActions, dispatch, getState, stopSaga } = setup();

        getState.mockReturnValue({
          entities: {
            notifications: {
              subscribedEventIds: ["1", "2"],
            },
          },
        });

        const action = {
          type: PN_SUBSCRIBE_EVENTS,
          payload: {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            locale: "en-GB",
            topics: subscribedEvents,
            unsupportedTopics: [],
          },
        };

        notificationSubscriptionService.subscribeToEvents.mockImplementationOnce(() => returnedEvents);

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "PN_SUBSCRIBE_EVENTS_SUCCESS",
          payload: {
            supportedEventIds: ["1", "2"],
            label: "enabled live alerts",
          },
        });

        stopSaga();
      });
    });
  });

  describe("when PN_UNSUBSCRIBE_EVENTS is dispatched", () => {
    it("should call unsubscribeFromEvents with the correct arguments", async () => {
      const { putActions, stopSaga } = setup();

      const action = {
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: { applicationTypeId: "applicationTypeId", deviceId: "deviceId", topics: [] },
      };

      await putActions([action]);

      expect(notificationSubscriptionService.unsubscribeFromEvents).toHaveBeenCalledWith(
        "applicationTypeId",
        "deviceId",
        [],
      );

      stopSaga();
    });

    it("should swallow errors thrown by unsubscribeFromEvents and keep the saga alive", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.unsubscribeFromEvents.mockImplementationOnce(() => {
        throw new Error("unsubscribe failed");
      });

      const { putActions, stopSaga } = setup();

      const action = {
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: { applicationTypeId: "applicationTypeId", deviceId: "deviceId", topics: [] },
      };

      await expect(putActions([action])).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      stopSaga();
    });
  });

  describe("when action is not PN_REGISTER_DEVICE, PN_SUBSCRIBE_EVENTS or PN_UNSUBSCRIBE_EVENTS", () => {
    it("should not call any method with the correct arguments", async () => {
      const { putActions, stopSaga } = setup();

      const action = {
        type: "INVALID_ACTION",
        payload: "invalid payload",
      };

      await putActions([action]);

      expect(notificationSubscriptionService.register).not.toHaveBeenCalled();
      expect(notificationSubscriptionService.subscribeToEvents).not.toHaveBeenCalled();
      expect(notificationSubscriptionService.unsubscribeFromEvents).not.toHaveBeenCalled();

      stopSaga();
    });
  });
});
