import { Connection } from "@ppb/onsite-gateway-client";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import setupSagaMocks from "../saga-jest-setup";
import { LOYALTY__ACKNOWLEDGE_MESSAGE } from "../actions/loyalty-messaging";
import { OSG_RELEVANT_MESSAGING } from "./loyalty-messaging-saga";
import { APP_VISIBILITY_CHANGE } from "../actions/interface";

const OSG_URL = "wss://the-osg.url/";
const APP_KEY = "mock-appKey";
const FULL_URL = `${OSG_URL}?_ak=${APP_KEY}`;

let putActions;
let stopSaga;

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ loyaltyMessagingSaga: saga } = require("./loyalty-messaging-saga"));
  });

  ({ putActions, stopSaga } = setupSagaMocks(saga));
}

const getStatusSpy = jest.fn();
const onVisibilityChangeSpy = jest.fn();
const subscribeSpy = jest.fn();
const acknowledgeSpy = jest.fn();

jest.mock("@ppb/onsite-gateway-client", () => ({
  Connection: {
    connect: jest.fn(() => ({
      onVisibilityChange: onVisibilityChangeSpy,
      acknowledge: acknowledgeSpy,
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

jest.mock("../config/application-key", () => ({
  getApplicationKey: jest.fn(() => APP_KEY),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

const originalURL = global.URL;

global.URL = jest.fn(() => ({
  href: FULL_URL,
}));

const appVisibilityChangeAction = (visible) => ({
  type: APP_VISIBILITY_CHANGE,
  payload: { visible },
});

const acknowledgeMessageAction = (message) => ({
  type: LOYALTY__ACKNOWLEDGE_MESSAGE,
  payload: message,
});

const pageLoadAction = () => ({
  type: "PAGE_LOAD_SUCCESS",
});

describe("loyaltyMessagingSaga", () => {
  beforeEach(jest.clearAllMocks);

  afterEach(() => {
    stopSaga();
  });

  afterAll(() => {
    global.URL = originalURL;
  });

  describe("when user is loggedIn", () => {
    beforeEach(() => {
      getUserDetails.mockReturnValue({ loggedIn: true });
    });

    describe("and the throttle is active", () => {
      beforeEach(async () => {
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
          expect(subscribeSpy).toHaveBeenCalledWith(OSG_RELEVANT_MESSAGING, expect.any(Function));
        });
      });

      describe("acknowledge message", () => {
        it("should call connection.acknowledge", async () => {
          getStatusSpy.mockReturnValue("OPEN");
          await putActions([acknowledgeMessageAction({ ackRequired: true })]);

          expect(acknowledgeSpy).toHaveBeenCalled();
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
