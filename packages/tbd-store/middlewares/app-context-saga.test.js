import {
  APP_CONTEXT__FETCH,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
  SESSION__TOKEN_CHANGED,
} from "../actions/app-context";
import { NETWORK__FETCH_APP_VERSION_FAILURE, NETWORK__FETCH_APP_VERSION_SUCCESS } from "../actions/app-version";
import { buildAppContext } from "../clients/catalogue/app-context-builder";
import { getAppEnvironment } from "../helpers";
import setupSagaMocks from "../saga-jest-setup";
import { getAppContextFromBFF, getAppVersion } from "../services/app-context-service";

jest.mock("../services/app-context-service", () => ({
  getAppContextFromBFF: jest.fn(),
  getAppVersion: jest.fn(),
}));

jest.mock("../helpers/app-environment", () => ({
  getAppEnvironment: jest.fn(),
  buildEnvironmentForJurisdiction: jest.fn((env) => env),
}));

jest.mock("../state", () => ({
  getOverridenThrottles: jest.fn(() => ({ throttlesOn: [], throttlesOff: [] })),
}));

jest.mock("../clients/catalogue/app-context-builder", () => ({
  buildAppContext: jest.fn(() => "beautifull app context right here"),
}));

const BFF_APP_CONTEXT_MOCK = {
  AppContext: {
    userdetails: {
      jurisdiction: "some jurisdiction",
    },
  },
};

const APP_CONTEXT_RESPONSE_MOCK = {
  initialState: "some initial state",
  environment: "some environment config",
};

const APP_CONTEXT_RESPONSE_MOCK_FOR_TIMEZONE = {
  initialState: {
    entities: {
      userdetails: {},
    },
  },
  environment: "some environment config",
};

const APP_VERSION_MOCK = {
  AppVersion: {
    url: "http://url",
    downloadUrl: "http://download-url",
    storeUrl: "http://store-url",
  },
};

const DUMMY_APP_ENVIRONMENT = {
  ENV: "local",
  BASE_PATH: "https://www.localhost.{domain_extension}.betfair/betting/",
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.localhost.{domain_extension}.betfair/",
    },
  },
  ASSETS: {
    DC: "ie1",
    HOST: "",
    PATH: "ie1/tbd/assets",
  },
};

const setup = () => {
  let saga;

  jest.isolateModules(() => {
    ({ appContextSaga: saga } = require("./app-context-saga"));
  });

  const sagaMocks = setupSagaMocks(saga);

  sagaMocks.getState.mockReturnValue({ entities: {} });

  return sagaMocks;
};

const triggerActionSetup = (type, payload) => ({ type, payload });

const ACTION = triggerActionSetup(APP_CONTEXT__FETCH, {
  defaultBffEndpoint: "some bff endpoint",
  latestBffEndpoint: "latest bff endpoint",
  authenticationToken: "some authentication token",
  defaultAppEnv: "some app env endpoint",
  buildNumber: "1234",
});

describe("app-context-saga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when intercepts a APP_CONTEXT__FETCH action", () => {
    describe("when requestData is successful", () => {
      it("should dispatch NETWORK__FETCH_APP_CONTEXT_FETCH_SUCCESS", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([
          triggerActionSetup(APP_CONTEXT__FETCH, {
            defaultBffEndpoint: "some endpoint",
            authenticationToken: "some token",
          }),
        ]);

        expect(getAppContextFromBFF).toHaveBeenCalledTimes(1);
        expect(getAppContextFromBFF).toHaveBeenCalledWith("some endpoint", "some token", {
          throttlesOn: [],
          throttlesOff: [],
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: "some environment config",
            initialState: "some initial state",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__FETCH_APP_CONTEXT_SUCCESS, having timezone option set", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK_FOR_TIMEZONE);

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([triggerActionSetup(APP_CONTEXT__FETCH, { defaultBasePath: "", timezone: "Europe/Lisbon" })]);

        expect(getAppContextFromBFF).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: "some environment config",
            initialState: {
              entities: {
                userdetails: {
                  timezone: "Europe/Lisbon",
                },
              },
            },
          },
        });

        stopSaga();
      });

      describe("but is territory blocked", () => {
        it("should dispatch NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING, not having defaultBasePath option set", async () => {
          getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
          getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
          buildAppContext.mockReturnValue({
            details: {
              isBlockedTerritory: true,
            },
          });

          const { putActions, dispatch, stopSaga } = setup();

          await putActions([triggerActionSetup(APP_CONTEXT__FETCH)]);

          expect(getAppContextFromBFF).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenCalledTimes(3);
          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
            payload: {
              details: { isBlockedTerritory: true },
            },
          });

          stopSaga();
        });
      });
    });

    describe("when getAppEnvironment is successful, and user has jurisdiction", () => {
      it("should dispatch NETWORK__FETCH_APP_CONTEXT_SUCCESS", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        getAppEnvironment.mockReturnValue(DUMMY_APP_ENVIRONMENT);

        const { putActions, dispatch, stopSaga } = setup({
          BFF_APP_CONTEXT: { isActive: true },
        });

        await putActions([
          triggerActionSetup(APP_CONTEXT__FETCH, { defaultAppEnv: "/betting/env.json", buildNumber: "1234" }),
        ]);

        expect(getAppEnvironment).toHaveBeenCalledTimes(1);
        expect(getAppEnvironment).toHaveBeenCalledWith("/betting/env.json", "1234");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: "some environment config",
            initialState: "some initial state",
          },
        });

        stopSaga();
      });
    });

    describe("when getAppContextFromBFF throws", () => {
      it("should dispatch NETWORK__FETCH_APP_VERSION_SUCCESS", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        getAppContextFromBFF.mockRejectedValue("FAIL");

        const { putActions, dispatch, stopSaga } = setup({
          BFF_APP_CONTEXT: { isActive: true },
        });

        await putActions([ACTION]);

        expect(getAppVersion).toHaveBeenCalledTimes(1);
        expect(getAppVersion).toHaveBeenCalledWith("latest bff endpoint", { throttlesOn: [], throttlesOff: [] });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              downloadUrl: "http://download-url",
              storeUrl: "http://store-url",
              url: "http://url",
            },
            ios: {
              downloadUrl: "http://download-url",
              storeUrl: "http://store-url",
              url: "http://url",
            },
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_FAILURE,
          payload: {
            error: "Unknown error FAIL",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE when the request returns 401", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        const unauthorizedError = Object.assign(new Error("Unauthorized"), {
          name: "FabricError",
          status: 401,
          code: "UNAUTHORIZED",
        });
        getAppContextFromBFF.mockRejectedValue(unauthorizedError);

        const { putActions, dispatch, stopSaga } = setup({
          BFF_APP_CONTEXT: { isActive: true },
        });

        await putActions([ACTION]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              downloadUrl: "http://download-url",
              storeUrl: "http://store-url",
              url: "http://url",
            },
            ios: {
              downloadUrl: "http://download-url",
              storeUrl: "http://store-url",
              url: "http://url",
            },
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
        });

        stopSaga();
      });
    });

    describe("when intercepts a SESSION__TOKEN_CHANGED action", () => {
      it("should re-fetch app context with the new token and cached payload", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        const { putActions, dispatch, stopSaga } = setup();

        // First, trigger an initial APP_CONTEXT__FETCH to cache the payload
        await putActions([ACTION]);

        jest.clearAllMocks();
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        // Then, trigger SESSION__TOKEN_CHANGED with a new token
        await putActions([
          {
            type: SESSION__TOKEN_CHANGED,
            payload: { authenticationToken: "new-session-token" },
          },
        ]);

        expect(getAppContextFromBFF).toHaveBeenCalledWith("some bff endpoint", "new-session-token", {
          throttlesOn: [],
          throttlesOff: [],
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: APP_CONTEXT_RESPONSE_MOCK,
        });

        stopSaga();
      });

      it("should not re-fetch app context if the token is the same as the last fetch", async () => {
        getAppVersion.mockResolvedValue(APP_VERSION_MOCK);
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        const { putActions, stopSaga } = setup();

        // First, trigger an initial APP_CONTEXT__FETCH to cache the payload
        await putActions([ACTION]);

        jest.clearAllMocks();

        // Then, trigger SESSION__TOKEN_CHANGED with the same token
        await putActions([
          {
            type: SESSION__TOKEN_CHANGED,
            payload: { authenticationToken: "some authentication token" },
          },
        ]);

        expect(getAppContextFromBFF).not.toHaveBeenCalled();

        stopSaga();
      });

      it("should not fetch app context if no previous payload is cached", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([
          {
            type: SESSION__TOKEN_CHANGED,
            payload: { authenticationToken: "some-token" },
          },
        ]);

        expect(getAppContextFromBFF).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when getAppVersion throws", () => {
      it("should dispatch NETWORK__FETCH_APP_VERSION_FAILURE", async () => {
        getAppVersion.mockRejectedValue("FAIL");
        getAppContextFromBFF.mockResolvedValue(BFF_APP_CONTEXT_MOCK);
        buildAppContext.mockReturnValue(APP_CONTEXT_RESPONSE_MOCK);

        const { putActions, dispatch, stopSaga } = setup({
          BFF_APP_CONTEXT: { isActive: true },
        });

        await putActions([ACTION]);

        expect(getAppVersion).toHaveBeenCalledTimes(1);
        expect(getAppVersion).toHaveBeenCalledWith("latest bff endpoint", { throttlesOn: [], throttlesOff: [] });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_APP_VERSION_FAILURE,
          payload: {
            error: "FAIL",
          },
        });

        stopSaga();
      });
    });
  });
});
