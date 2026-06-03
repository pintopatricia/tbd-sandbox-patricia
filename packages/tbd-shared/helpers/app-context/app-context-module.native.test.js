import { getTimeZone } from "react-native-localize";
import { createAppContextMiddleware } from "./app-context-middleware.native";
import { getAppContextModule } from "./app-context-module.native";

jest.mock("./app-context-middleware.native", () => ({ createAppContextMiddleware: jest.fn() }));
jest.mock("react-native-localize", () => ({
  getTimeZone: jest.fn(),
}));
jest.mock("../../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "basePath/"),
  getCatalogueDefaultPath: jest.fn(() => "api/tbd/bff-gql/v1/"),
  CATALOGUE_LATEST_PATH: "api/tbd/bff-gql/latest/",
  APP_ENVIRONMENT_DEFAULT_PATH: "betting/env.json",
}));
jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(() => "5"),
  getApplicationName: jest.fn(() => "TestApp"),
}));
jest.mock("@react-native-cookies/cookies", () => ({}));

describe("AppContextModule", () => {
  beforeEach(jest.clearAllMocks);

  function setup() {
    jest.clearAllMocks();
    return {
      store: jest.fn(),
      appKey: "appKey",
      userAgent: "userAgent",
      initialCetFrameworkSetup: jest.fn(),
      authenticationToken: "authToken",
      excEnabled: false,
      onReady: jest.fn(),
    };
  }

  it("should return the app-context redux dynamic module object, with middleware and initial action", () => {
    const { store, appKey, userAgent, initialCetFrameworkSetup, authenticationToken, excEnabled, onReady } = setup();
    createAppContextMiddleware.mockReturnValue("app-ctx-middleware");
    getTimeZone.mockReturnValue("Europe/Lisbon");
    expect(
      getAppContextModule(store, appKey, userAgent, initialCetFrameworkSetup, authenticationToken, excEnabled, onReady),
    ).toEqual({
      id: "app-context-module",
      middlewares: ["app-ctx-middleware"],
      initialActions: [
        {
          type: "APP_CONTEXT/FETCH",
          payload: {
            defaultBffEndpoint: "basePath/api/tbd/bff-gql/v1/",
            defaultAppEnv: "basePath/betting/env.json",
            latestBffEndpoint: "basePath/api/tbd/bff-gql/latest/",
            timezone: "Europe/Lisbon",
            authenticationToken: "authToken",
            excEnabled: false,
            buildNumber: "5",
          },
        },
      ],
    });
  });

  it("should create app context middleware", () => {
    const { store, appKey, userAgent, initialCetFrameworkSetup, authenticationToken, excEnabled, onReady } = setup();
    getAppContextModule(store, appKey, userAgent, initialCetFrameworkSetup, authenticationToken, excEnabled, onReady);
    createAppContextMiddleware.mockReturnValue("app-ctx-middleware");
    getTimeZone.mockReturnValue("Europe/Lisbon");

    expect(createAppContextMiddleware).toHaveBeenCalledTimes(1);
    expect(createAppContextMiddleware).toHaveBeenCalledWith(
      store,
      appKey,
      userAgent,
      initialCetFrameworkSetup,
      onReady,
    );
  });
});
