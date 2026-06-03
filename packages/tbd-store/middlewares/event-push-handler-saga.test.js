import setupSagaMocks from "../saga-jest-setup";
import { PUSH } from "../actions/router";

function setup({
  wasNotificationHowToSubscribeEventsShown,
  isBetslipCollapsed,
  isBetslipOpened,
  isUserLoggedIn,
  currentView,
}) {
  let saga;
  jest.isolateModules(() => {
    ({ pushHandlerSaga: saga } = require("./event-push-handler-saga"));
  });

  const { putActions, dispatch, stopSaga, getState } = setupSagaMocks(saga);

  getState.mockReturnValue({
    notifications: {
      wasNotificationHowToSubscribeEventsShown,
    },
    betslip: {
      isCollapsed: isBetslipCollapsed,
    },
    router: {
      currentView,
    },
  });

  jest.mock("../state/entities/user-details/user-details-selectors", () => ({
    getUserDetails: jest.fn(() => ({ loggedIn: isUserLoggedIn })),
  }));

  jest.mock("../state/betslip/betslip-card-selectors", () => ({
    getBetslipVisibilityState: jest.fn(() => isBetslipOpened),
  }));

  return { putActions, dispatch, stopSaga };
}

describe("pushHandlerSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when PUSH is dispatched", () => {
    describe("and everything is as expected", () => {
      it("should dispatch success action", async () => {
        const { putActions, dispatch, stopSaga } = setup({
          wasNotificationHowToSubscribeEventsShown: false,
          isBetslipCollapsed: true,
          isBetslipOpened: false,
          isUserLoggedIn: true,
          currentView: "ppb:tbd:view:event",
        });

        const action = {
          type: PUSH,
        };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: "UI__NAVIGATE_TO_EVENT_FIRST_TIME",
        });

        stopSaga();
      });
    });

    describe("and the notification was already shown", () => {
      it("should not dispatch success action", async () => {
        const { putActions, dispatch, stopSaga } = setup({
          wasNotificationHowToSubscribeEventsShown: true,
          isBetslipCollapsed: true,
          isBetslipOpened: false,
          isUserLoggedIn: true,
          currentView: "ppb:tbd:view:event",
        });

        const action = {
          type: PUSH,
        };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledTimes(0);

        stopSaga();
      });
    });

    describe("and the betslip is opened but not collapsed", () => {
      it("should not dispatch success action", async () => {
        const { putActions, dispatch, stopSaga } = setup({
          wasNotificationHowToSubscribeEventsShown: false,
          isBetslipCollapsed: false,
          isBetslipOpened: true,
          isUserLoggedIn: true,
          currentView: "ppb:tbd:view:event",
        });

        const action = {
          type: PUSH,
        };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledTimes(0);

        stopSaga();
      });
    });

    describe("and the user is not logged in", () => {
      it("should not dispatch success action", async () => {
        const { putActions, dispatch, stopSaga } = setup({
          wasNotificationHowToSubscribeEventsShown: false,
          isBetslipCollapsed: true,
          isBetslipOpened: false,
          isUserLoggedIn: false,
          currentView: "ppb:tbd:view:event",
        });

        const action = {
          type: PUSH,
        };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledTimes(0);

        stopSaga();
      });
    });

    describe("and the current view is not event", () => {
      it("should not dispatch success action", async () => {
        const { putActions, dispatch, stopSaga } = setup({
          wasNotificationHowToSubscribeEventsShown: false,
          isBetslipCollapsed: true,
          isBetslipOpened: false,
          isUserLoggedIn: true,
          currentView: "not:event:view",
        });

        const action = {
          type: PUSH,
        };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledTimes(0);

        stopSaga();
      });
    });
  });

  describe("when action is not PUSH", () => {
    it("should not call any method with the correct arguments", async () => {
      const { putActions, dispatch, stopSaga } = setup({
        wasNotificationHowToSubscribeEventsShown: false,
        isBetslipCollapsed: true,
        isBetslipOpened: false,
        isUserLoggedIn: true,
        currentView: "ppb:tbd:view:event",
      });

      const action = {
        type: "INVALID_ACTION",
        payload: "invalid payload",
      };

      await putActions([action]);

      expect(dispatch).toHaveBeenCalledTimes(0);

      stopSaga();
    });
  });
});
