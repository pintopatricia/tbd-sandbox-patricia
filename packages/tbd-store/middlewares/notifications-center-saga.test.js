import { Connection } from "@ppb/onsite-gateway-client";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import setupSagaMocks from "../saga-jest-setup";
import { NETWORK__FETCH_UNREAD_NOTIFICATIONS } from "../actions/notifications-center";
import { OSG_NOTIFICATION_MESSAGING } from "./notifications-center-saga";
import { APP_VISIBILITY_CHANGE } from "../actions/interface";
import notificationCenterService from "../services/notification-center-service";
import { getThrottles } from "../state/entities/throttles/throttles-selectors";

const OSG_URL = "wss://the-osg.url/";
const APP_KEY = "mock-appKey";
const FULL_URL = `${OSG_URL}?_ak=${APP_KEY}`;

let putActions;
let stopSaga;
let hasDispatchedAction;

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ notificationCenterSaga: saga } = require("./notifications-center-saga"));
  });

  ({ putActions, stopSaga, hasDispatchedAction } = setupSagaMocks(saga));
}

const getStatusSpy = jest.fn();
const onVisibilityChangeSpy = jest.fn();
const subscribeSpy = jest.fn();

jest.mock("@ppb/onsite-gateway-client", () => ({
  Connection: {
    connect: jest.fn(() => ({
      onVisibilityChange: onVisibilityChangeSpy,
      subscribe: subscribeSpy,
      getStatus: getStatusSpy,
    })),
  },
}));

jest.mock("../services/client-factory", () => ({
  getHttpClientsConfig: jest.fn(() => ({
    ENDPOINTS: {
      OSG: OSG_URL,
    },
  })),
}));

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getThrottles: jest.fn(),
}));

jest.mock("../config/application-key", () => ({
  getApplicationKey: jest.fn(() => APP_KEY),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: false })),
}));

jest.mock("../services/notification-center-service", () => ({
  retrieveCount: jest.fn(() => Promise.resolve({ unreadCount: 3 })),
}));

const originalURL = global.URL;

global.URL = jest.fn(() => ({
  href: FULL_URL,
}));

const appVisibilityChangeAction = (visible) => ({
  type: APP_VISIBILITY_CHANGE,
  payload: { visible },
});

const pageLoadAction = () => ({
  type: "PAGE_LOAD_SUCCESS",
});

describe("notificationCenterSaga", () => {
  beforeEach(jest.clearAllMocks);

  afterEach(() => {
    stopSaga();
  });

  afterAll(() => {
    global.URL = originalURL;
  });

  describe("when throttle ENABLE_NOTIFICATION_CENTER is inactive", () => {
    beforeEach(async () => {
      getThrottles.mockReturnValue({
        ENABLE_NOTIFICATION_CENTER: { isActive: false },
      });

      setup();

      await putActions([pageLoadAction()]);
    });

    it("should not connect to OSG on page load", () => {
      expect(Connection.connect).not.toHaveBeenCalled();
    });

    it("should not subscribe to OSG topics on page load", () => {
      expect(subscribeSpy).not.toHaveBeenCalled();
    });
  });

  describe("when user is loggedIn", () => {
    beforeEach(async () => {
      getUserDetails.mockReturnValue({ loggedIn: true });
      getThrottles.mockReturnValue({
        ENABLE_NOTIFICATION_CENTER: { isActive: true },
      });
      setup();

      await putActions([pageLoadAction()]);
    });

    it("should connect to OSG", () => {
      expect(URL).toHaveBeenCalledWith(FULL_URL);
      expect(Connection.connect).toHaveBeenCalledTimes(1);
      expect(Connection.connect).toHaveBeenCalledWith({
        endpoint: URL(FULL_URL),
      });
    });

    describe("topic subscription", () => {
      it("should subscribe to the correct topic", () => {
        expect(subscribeSpy).toHaveBeenCalledWith(OSG_NOTIFICATION_MESSAGING, expect.any(Function));
      });
    });

    describe("when receiving a message from OSG", () => {
      it("should dispatch NETWORK__FETCH_UNREAD_NOTIFICATIONS action", async () => {
        const messageHandler = subscribeSpy.mock.calls[0][1];
        messageHandler();
        await hasDispatchedAction(NETWORK__FETCH_UNREAD_NOTIFICATIONS);
      });

      it("should call fetchUnreadNotificationsCount from notification-center-service", async () => {
        const messageHandler = subscribeSpy.mock.calls[0][1];
        messageHandler();
        expect(notificationCenterService.retrieveCount).toHaveBeenCalledTimes(1);
      });
    });

    describe("visibility change", () => {
      beforeEach(() => {
        onVisibilityChangeSpy.mockClear();
      });

      describe("when connection status is OPEN", () => {
        it("should call connection.onVisibilityChange with true", async () => {
          getStatusSpy.mockReturnValue("OPEN");
          await putActions([appVisibilityChangeAction(true)]);

          expect(onVisibilityChangeSpy).toHaveBeenCalledWith(true);
        });
      });

      describe("when connection status is CLOSED", () => {
        it("should call connection.onVisibilityChange with false", async () => {
          getStatusSpy.mockReturnValue("CLOSED");
          await putActions([appVisibilityChangeAction(false)]);

          expect(onVisibilityChangeSpy).toHaveBeenCalledWith(false);
        });
      });

      describe.each(["CONNECTING", "CLOSING"])("when connection status is `%s`", (status) => {
        it("should not call connection.onVisibilityChange", async () => {
          getStatusSpy.mockReturnValue(status);
          await putActions([appVisibilityChangeAction(true)]);

          expect(onVisibilityChangeSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when user is loggedOut", () => {
    beforeEach(() => {
      getUserDetails.mockReturnValue({ loggedIn: false });

      setup();
    });

    it("should not connect to OSG", () => {
      expect(Connection.connect).not.toHaveBeenCalled();
    });
  });
});
