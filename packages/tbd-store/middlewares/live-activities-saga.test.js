import setupSagaMocks from "../saga-jest-setup";
import {
  LA_SUBSCRIBE_EVENTS,
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LA_SUBSCRIBE_EVENTS_ERROR,
  LA_UNSUBSCRIBE_EVENTS,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  LA_UNSUBSCRIBE_FINISHED_EVENTS,
} from "../actions/push-notifications";
import notificationSubscriptionService from "../services/notification-subscription-service";

const mockEmit = jest.fn();

jest.mock("eventemitter3-singleton", () => ({
  getEventRegistry: () => ({
    emit: (...args) => mockEmit(...args),
  }),
}));

jest.mock("../services/notification-subscription-service", () => ({
  subscribeLiveActivity: jest.fn(),
  unsubscribeLiveActivity: jest.fn(),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

const { getUserDetails } = require("../state/entities/user-details/user-details-selectors");

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ liveActivitiesSaga: saga } = require("./live-activities-saga"));
  });
  return setupSagaMocks(saga);
}

describe("liveActivitiesSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("when LA_SUBSCRIBE_EVENTS is dispatched", () => {
    const subscribePayload = {
      subscribeLiveActivity: {
        applicationTypeId: "appType",
        deviceId: "device",
        liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
      },
    };

    it("should call subscribeLiveActivity with the payload", async () => {
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: true,
        liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
      });

      const { putActions, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(notificationSubscriptionService.subscribeLiveActivity).toHaveBeenCalledWith(
        subscribePayload.subscribeLiveActivity,
      );

      stopSaga();
    });

    it("should dispatch the success action when the response is successful and has events", async () => {
      const liveActivityEvents = [{ eventId: "event-1", pushToken: "token-1" }];
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: true,
        liveActivityEvents,
      });

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(dispatch).toHaveBeenCalledWith({
        type: LA_SUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          liveActivityEvents,
          label: "Live Alerts Enabled",
        },
      });

      stopSaga();
    });

    it("should dispatch the error action when the response is unsuccessful", async () => {
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: false,
        liveActivityEvents: [],
        errorCode: "ERR_500",
        errorMessage: "boom",
      });

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(dispatch).toHaveBeenCalledWith({
        type: LA_SUBSCRIBE_EVENTS_ERROR,
        payload: {
          errorCode: "ERR_500",
          errorMessage: "boom",
          label: "Live Alerts Error",
        },
      });

      stopSaga();
    });

    it("should emit @@UI/NSS_SUBSCRIPTION_FAILED with the eventId when the response is unsuccessful", async () => {
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: false,
        liveActivityEvents: [],
      });

      const { putActions, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(mockEmit).toHaveBeenCalledWith("@@UI/NSS_SUBSCRIPTION_FAILED", { eventId: "event-1" });

      stopSaga();
    });

    it("should emit @@UI/NSS_SUBSCRIPTION_FAILED with the eventId when subscribeLiveActivity throws", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.subscribeLiveActivity.mockRejectedValueOnce(new Error("boom"));

      const { putActions, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(mockEmit).toHaveBeenCalledWith("@@UI/NSS_SUBSCRIPTION_FAILED", { eventId: "event-1" });

      consoleErrorSpy.mockRestore();
      stopSaga();
    });

    it("should not emit @@UI/NSS_SUBSCRIPTION_FAILED when the response is successful", async () => {
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: true,
        liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
      });

      const { putActions, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(mockEmit).not.toHaveBeenCalled();

      stopSaga();
    });

    it("should dispatch the error action when the response is successful but has no events", async () => {
      notificationSubscriptionService.subscribeLiveActivity.mockResolvedValueOnce({
        success: true,
        liveActivityEvents: [],
      });

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }]);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: LA_SUBSCRIBE_EVENTS_ERROR,
        }),
      );

      stopSaga();
    });

    it("should swallow errors thrown by subscribeLiveActivity and keep the saga alive", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.subscribeLiveActivity.mockRejectedValueOnce(new Error("network down"));

      const { putActions, stopSaga } = setup();

      await expect(putActions([{ type: LA_SUBSCRIBE_EVENTS, payload: subscribePayload }])).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      stopSaga();
    });
  });

  describe("when LA_UNSUBSCRIBE_EVENTS is dispatched", () => {
    const unsubscribePayload = {
      unsubscribeLiveActivity: {
        applicationTypeId: "appType",
        deviceId: "device",
        liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
      },
    };

    it("should call unsubscribeLiveActivity with the payload", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([{ type: LA_UNSUBSCRIBE_EVENTS, payload: unsubscribePayload }]);

      expect(notificationSubscriptionService.unsubscribeLiveActivity).toHaveBeenCalledWith(
        unsubscribePayload.unsubscribeLiveActivity,
      );

      stopSaga();
    });

    it("should dispatch LA_UNSUBSCRIBE_EVENTS_SUCCESS after the service call resolves", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: LA_UNSUBSCRIBE_EVENTS, payload: unsubscribePayload }]);

      expect(dispatch).toHaveBeenCalledWith({
        type: LA_UNSUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          unsubscribeLiveActivity: unsubscribePayload.unsubscribeLiveActivity,
          label: "Live Alerts Disabled",
        },
      });

      stopSaga();
    });

    it("should still dispatch LA_UNSUBSCRIBE_EVENTS_SUCCESS when the service throws", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.unsubscribeLiveActivity.mockImplementationOnce(() => {
        throw new Error("unsubscribe failed");
      });

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: LA_UNSUBSCRIBE_EVENTS, payload: unsubscribePayload }]);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: LA_UNSUBSCRIBE_EVENTS_SUCCESS }));

      consoleErrorSpy.mockRestore();
      stopSaga();
    });

    it("should swallow errors thrown by unsubscribeLiveActivity and keep the saga alive", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      notificationSubscriptionService.unsubscribeLiveActivity.mockImplementationOnce(() => {
        throw new Error("unsubscribe failed");
      });

      const { putActions, stopSaga } = setup();

      await expect(putActions([{ type: LA_UNSUBSCRIBE_EVENTS, payload: unsubscribePayload }])).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      stopSaga();
    });
  });

  describe("when LA_UNSUBSCRIBE_FINISHED_EVENTS is dispatched", () => {
    const finishedPayload = {
      liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
    };

    it("should call unsubscribeLiveActivity when user details are available", async () => {
      getUserDetails.mockReturnValue({ applicationTypeId: "appType", deviceId: "device" });

      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({});

      await putActions([{ type: LA_UNSUBSCRIBE_FINISHED_EVENTS, payload: finishedPayload }]);

      expect(notificationSubscriptionService.unsubscribeLiveActivity).toHaveBeenCalledWith({
        liveActivityEvents: finishedPayload.liveActivityEvents,
        applicationTypeId: "appType",
        deviceId: "device",
      });

      stopSaga();
    });

    it("should not call unsubscribeLiveActivity when user details are missing", async () => {
      getUserDetails.mockReturnValue(undefined);

      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({});

      await putActions([{ type: LA_UNSUBSCRIBE_FINISHED_EVENTS, payload: finishedPayload }]);

      expect(notificationSubscriptionService.unsubscribeLiveActivity).not.toHaveBeenCalled();

      stopSaga();
    });

    it("should swallow errors thrown by unsubscribeLiveActivity and keep the saga alive", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      getUserDetails.mockReturnValue({ applicationTypeId: "appType", deviceId: "device" });
      notificationSubscriptionService.unsubscribeLiveActivity.mockImplementationOnce(() => {
        throw new Error("unsubscribe failed");
      });

      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({});

      await expect(
        putActions([{ type: LA_UNSUBSCRIBE_FINISHED_EVENTS, payload: finishedPayload }]),
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      stopSaga();
    });
  });

  describe("when action is not a live activity action", () => {
    it("should not call any service method", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([{ type: "UNRELATED_ACTION", payload: {} }]);

      expect(notificationSubscriptionService.subscribeLiveActivity).not.toHaveBeenCalled();
      expect(notificationSubscriptionService.unsubscribeLiveActivity).not.toHaveBeenCalled();

      stopSaga();
    });
  });
});
