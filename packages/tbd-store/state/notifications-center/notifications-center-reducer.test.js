import {
  NETWORK__UNREAD_NOTIFICATIONS_SUCCESS,
  NETWORK__UNREAD_NOTIFICATIONS_FAILURE,
} from "../../actions/notifications-center";
import notificationsCenterReducer from "./notifications-center-reducer";

describe("notificationsCenterReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      const state = notificationsCenterReducer({ unreadNotificationsCount: 0 }, {});
      expect(state).toEqual({ unreadNotificationsCount: 0 });
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = notificationsCenterReducer(undefined, {});
      expect(state).toEqual({ unreadNotificationsCount: 0 });
    });
  });

  describe('when action type is "NETWORK__UNREAD_NOTIFICATIONS_SUCCESS"', () => {
    it("must return the new state with unreadNotificationsCount set", () => {
      const action = {
        type: NETWORK__UNREAD_NOTIFICATIONS_SUCCESS,
        payload: {
          unreadNotificationsCount: 5,
        },
      };

      const state = notificationsCenterReducer({ unreadNotificationsCount: 0 }, action);
      expect(state).toEqual({ unreadNotificationsCount: 5 });
    });
  });

  describe('when action type is "NETWORK__UNREAD_NOTIFICATIONS_FAILURE"', () => {
    it("must return the new state with unreadNotificationsCount set to 0", () => {
      const action = {
        type: NETWORK__UNREAD_NOTIFICATIONS_FAILURE,
      };

      const state = notificationsCenterReducer({ unreadNotificationsCount: 5 }, action);
      expect(state).toEqual({ unreadNotificationsCount: 0 });
    });
  });
});
