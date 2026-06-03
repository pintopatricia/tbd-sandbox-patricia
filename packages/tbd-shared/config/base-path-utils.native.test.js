import { NativeModules } from "react-native";
import { createEnvironments } from "./environments.native";
import { settingsConfig } from "./settings-utils.native";
import { getEnvironmentCookieHandler } from "./env-cookies/handler.native";
import { createCookieParser } from "../helpers/parsers";
import appConfiguration from "./app-configuration.native";
import { getAppContextFromBFF } from "@ppb/tbd-store/services/app-context-service";
import { buildAppContext } from "@ppb/tbd-store/clients/catalogue/app-context-builder";
import { buildEnvironmentForJurisdiction, getAppEnvironment } from "@ppb/tbd-store/helpers";

const APP_CONFIG_MOCKS = {
  TBDN_RELEASE_MODE: "production",
  TBDN_DEFAULT_ENVIRONMENT: "prd",
  TBDN_CATALOGUE_VERSION: "v1",
};

const APP_ENVIRONMENT = "app_environment";
const APP_JURISDICTION = "app_jurisdiction";
const CUSTOM_APP_ENVIRONMENT = "custom_app_environment";
const CUSTOM_APP_COOKIES = "custom_app_cookies";
const THROTTLES_OVERRIDE = "throttles_override";

const DEFAULT_SETTINGS = {
  SETTINGS_BUNDLE_KEYS: {
    APP_ENVIRONMENT,
    APP_JURISDICTION,
    CUSTOM_APP_ENVIRONMENT,
    CUSTOM_APP_COOKIES,
    THROTTLES_OVERRIDE,
  },
  settingsConfig: {
    [APP_ENVIRONMENT]: APP_CONFIG_MOCKS.TBDN_DEFAULT_ENVIRONMENT,
    [APP_JURISDICTION]: "INTERNATIONAL",
    [CUSTOM_APP_ENVIRONMENT]: "",
    [CUSTOM_APP_COOKIES]: "ssoid=test;",
    [THROTTLES_OVERRIDE]: {},
  },
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("react-native", () => ({
  NativeModules: {
    LaunchArgumentsModule: {
      getLaunchArguments: jest.fn().mockReturnValue({}),
    },
  },
}));

jest.mock("react-native-device-info", () => ({
  getDeviceNameSync: () => "iPhone 11",
}));

jest.mock("./environments.native", () => ({
  createEnvironments: jest.fn(() => ({
    mockserver: {
      baseEnv: "mockserver",
      path: "http://localhost:1084",
    },
    localhost: {
      baseEnv: "localhost",
      path: "https://localhost.betfair.com/",
    },
    drk: {
      baseEnv: "drk",
      path: "https://apitbdn.drk.com.betfair/",
    },
    nxt: {
      baseEnv: "nxt",
      path: "https://apitbdn.nxt.com.betfair/betting/",
    },
    qa: {
      baseEnv: "qa",
      path: "https://apitbdn.qa.com.betfair/",
    },
    qaES: {
      baseEnv: "qa",
      path: "https://apitbdn.qa.es.betfair/",
    },
    qaCMS: {
      baseEnv: "qacms",
      path: "https://apitbdn.qacms.com.betfair/",
    },
    qaBRANCH: {
      baseEnv: "qabranch",
      path: "https://apitbdn.qabranch.com.betfair/",
    },
    prf: {
      baseEnv: "prf",
      path: "https://apitbdn.prf.com.betfair/",
    },
    prd: {
      baseEnv: "prd",
      path: "https://apitbdn.betfair.net/",
    },
  })),
}));

jest.mock("./app-configuration.native", () => ({ appConfig: APP_CONFIG_MOCKS }));
jest.mock("./settings-utils", () => ({
  SETTINGS_BUNDLE_KEYS: {
    APP_ENVIRONMENT,
    APP_JURISDICTION,
    CUSTOM_APP_ENVIRONMENT,
    CUSTOM_APP_COOKIES,
    THROTTLES_OVERRIDE,
  },
  initSettings: jest.fn().mockResolvedValue(),
  settingsConfig: {
    [APP_ENVIRONMENT]: APP_CONFIG_MOCKS.TBDN_DEFAULT_ENVIRONMENT,
    [APP_JURISDICTION]: "",
    [CUSTOM_APP_ENVIRONMENT]: "",
    [CUSTOM_APP_COOKIES]: "ssoid=test;",
    [THROTTLES_OVERRIDE]: {},
  },
}));

jest.mock("./headers", () => ({
  setGeneratedHeaders: jest.fn(),
}));

jest.mock("../helpers/parsers", () => ({
  createCookieParser: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("./env-cookies/handler.native", () => ({
  getEnvironmentCookieHandler: jest.fn().mockReturnValue({ set: jest.fn(), clear: jest.fn() }),
}));

jest.mock("@ppb/tbd-store/services/app-context-service", () => ({
  getAppContextFromBFF: jest.fn(),
}));

jest.mock("@ppb/tbd-store/clients/catalogue/app-context-builder", () => ({
  buildAppContext: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers", () => ({
  buildEnvironmentForJurisdiction: jest.fn(),
  getAppEnvironment: jest.fn(),
}));

const setup = async (
  { launchArgsValue = {}, cookieParserSpy = jest.fn(), handlerSpy = { set: jest.fn() } } = {
    launchArgsValue: {},
  },
) => {
  createCookieParser.mockReturnValue(cookieParserSpy);
  getEnvironmentCookieHandler.mockReturnValue(handlerSpy);
  NativeModules.LaunchArgumentsModule.getLaunchArguments.mockReturnValue(launchArgsValue);
  let getBasePath;
  let initEnvironment;
  let isCurrentEnv;
  let getCurrentEnv;
  let initAppContext;
  let getCatalogueDefaultPath;

  jest.isolateModules(() => {
    ({
      getBasePath,
      initEnvironment,
      isCurrentEnv,
      getCurrentEnv,
      initAppContext,
      getCatalogueDefaultPath,
    } = require("./base-path-utils.native"));
  });

  await initEnvironment();

  return { getBasePath, isCurrentEnv, getCurrentEnv, initAppContext, getCatalogueDefaultPath };
};

describe("Base Path Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(settingsConfig, JSON.parse(JSON.stringify(DEFAULT_SETTINGS.settingsConfig)));
  });

  describe("before initEnvironment is not called", () => {
    describe("getBasePath() and getCurrentEnv()", () => {
      it("should throw an error", () => {
        let getBasePath;
        let getCurrentEnv;

        jest.isolateModules(() => {
          ({ getBasePath, getCurrentEnv } = require("./base-path-utils.native"));
        });

        expect(() => getBasePath()).toThrow("initEnvironment() must be called first");
        expect(() => getCurrentEnv("qa")).toThrow("initEnvironment() must be called first");
      });
    });
  });

  describe("after initEnvironment is called", () => {
    describe("when custom cookies are defined", () => {
      it("should parse the cookies in the restored settings", async () => {
        const cookieParserSpy = jest.fn();

        await setup({ cookieParserSpy });

        expect(cookieParserSpy).toHaveBeenCalledWith("ssoid=test;");
      });

      it("should get a cookie handler for the correct environment", async () => {
        const handlerSpy = { set: jest.fn() };
        const cookieParserSpy = jest.fn().mockReturnValue(new Map([["ssoid", "test"]]));

        await setup({ handlerSpy, cookieParserSpy });

        expect(getEnvironmentCookieHandler).toHaveBeenCalledWith("prd");
        expect(handlerSpy.set).toHaveBeenCalledWith(new Map([["ssoid", "test"]]));
      });
    });

    describe("getBasePath()", () => {
      describe("when release mode is production", () => {
        beforeEach(() => {
          APP_CONFIG_MOCKS.TBDN_RELEASE_MODE = "production";
        });

        it("should return production environment", async () => {
          const ENVIRONMENTS = createEnvironments();
          const { getBasePath } = await setup();
          expect(getBasePath()).toEqual(ENVIRONMENTS.prd.path);
        });

        describe("and when launch arguments environment is specified", () => {
          it("should return the production environment'", async () => {
            const ENVIRONMENTS = createEnvironments();
            const { getBasePath } = await setup({ launchArgsValue: { environment: "mockserver" } });
            expect(getBasePath()).toEqual(ENVIRONMENTS.prd.path);
          });
        });
      });

      describe("when release mode is not production", () => {
        beforeEach(() => {
          APP_CONFIG_MOCKS.TBDN_RELEASE_MODE = "internal";
        });

        describe("and when launch arguments environment is specified", () => {
          it("should return the value the value for the requested env", async () => {
            const { getBasePath } = await setup({ launchArgsValue: { environment: "mockserver" } });
            expect(getBasePath()).toEqual("http://localhost:1084");
          });
        });

        describe("when the custom app environment is equal to 'http://0.0.0.0'", () => {
          it("should return the value 'http://0.0.0.0'", async () => {
            settingsConfig[CUSTOM_APP_ENVIRONMENT] = "http://0.0.0.0";
            const { getBasePath } = await setup();
            expect(getBasePath()).toEqual("http://0.0.0.0");
          });
        });

        describe("when the environment is equal to 'QA'", () => {
          it("should return the value 'https://apitbdn.qa.com.betfair/'", async () => {
            settingsConfig[APP_ENVIRONMENT] = "qa";
            const { getBasePath } = await setup();
            expect(getBasePath()).toEqual("https://apitbdn.qa.com.betfair/");
          });

          describe("and Jurisdiction is equal to 'SPAIN'", () => {
            it("should return 'https://apitbdn.qa.es.betfair/'", async () => {
              settingsConfig[APP_ENVIRONMENT] = "qa";
              settingsConfig[APP_JURISDICTION] = "SPAIN";
              const { getBasePath } = await setup();
              expect(getBasePath()).toEqual("https://apitbdn.qa.es.betfair/");
            });
          });

          describe("and Jurisdiction is defined to a country not listed", () => {
            it("should return 'https://apitbdn.qa.com.betfair/'", async () => {
              settingsConfig[APP_ENVIRONMENT] = "qa";
              settingsConfig[APP_JURISDICTION] = "FRANCE";
              const { getBasePath } = await setup();
              expect(getBasePath()).toEqual("https://apitbdn.qa.com.betfair/");
            });
          });

          describe("and Jurisdiction is not defined", () => {
            it("should return 'https://apitbdn.qa.com.betfair/'", async () => {
              settingsConfig[APP_ENVIRONMENT] = "qa";
              settingsConfig[APP_JURISDICTION] = "";
              const { getBasePath } = await setup();
              expect(getBasePath()).toEqual("https://apitbdn.qa.com.betfair/");
            });
          });
        });

        describe("when the custom app environment and environment are not defined (iOS)", () => {
          it("should return the default environment", async () => {
            appConfiguration.appConfig.TBDN_DEFAULT_ENVIRONMENT = "qaCMS";
            settingsConfig[APP_ENVIRONMENT] = "Choose one";
            const { getBasePath } = await setup();
            expect(getBasePath()).toEqual("https://apitbdn.qacms.com.betfair/");
          });
        });

        describe("when the custom app environment and environment are not defined (android)", () => {
          it("should return the default environment", async () => {
            appConfiguration.appConfig.TBDN_DEFAULT_ENVIRONMENT = "qaCMS";
            settingsConfig[APP_ENVIRONMENT] = "";
            const { getBasePath } = await setup();
            expect(getBasePath()).toEqual("https://apitbdn.qacms.com.betfair/");
          });
        });
      });
    });

    describe("isCurrentEnv()", () => {
      describe("when calling with an invalid env", () => {
        it("should throw an error", async () => {
          const { isCurrentEnv } = await setup();
          expect(isCurrentEnv("invalidEnv")).toEqual(false);
        });
      });

      describe("when calling with the selected env", () => {
        it("should return true", async () => {
          const { isCurrentEnv } = await setup({ launchArgsValue: { environment: "mockserver" } });
          expect(isCurrentEnv("mockserver")).toEqual(true);
        });
      });

      describe("when calling with another env", () => {
        it("should return false", async () => {
          const { isCurrentEnv } = await setup({ launchArgsValue: { environment: "mockserver" } });
          expect(isCurrentEnv("qa")).toEqual(false);
        });
      });
    });

    describe("getCurrentEnv()", () => {
      describe("when calling with the selected env", () => {
        it("should return the correct environment", async () => {
          const { getCurrentEnv } = await setup({ launchArgsValue: { environment: "qa" } });
          expect(getCurrentEnv()).toEqual("qa");
        });
      });
    });

    describe("initAppContext()", () => {
      const mockBffResponse = {
        AppContext: {
          userdetails: {
            jurisdiction: {
              jurisdiction: "UK",
            },
          },
        },
      };
      const mockAppEnvironment = { env: "mock-env" };
      const mockTreatedEnvironment = { treated: "env" };
      const mockAppContext = { app: "context" };

      beforeEach(() => {
        getAppContextFromBFF.mockResolvedValue(mockBffResponse);
        getAppEnvironment.mockResolvedValue(mockAppEnvironment);
        buildEnvironmentForJurisdiction.mockReturnValue(mockTreatedEnvironment);
        buildAppContext.mockReturnValue(mockAppContext);
      });

      it("should call getAppContextFromBFF with the correct endpoint", async () => {
        const { initAppContext, getBasePath, getCatalogueDefaultPath } = await setup();

        await initAppContext();

        expect(getAppContextFromBFF).toHaveBeenCalledWith(`${getBasePath()}${getCatalogueDefaultPath()}`);
      });

      it("should call getAppEnvironment with the correct path", async () => {
        const { initAppContext, getBasePath } = await setup();

        await initAppContext();

        expect(getAppEnvironment).toHaveBeenCalledWith(`${getBasePath()}betting/env.json`);
      });

      it("should call buildEnvironmentForJurisdiction with the app environment and jurisdiction", async () => {
        const { initAppContext } = await setup();

        await initAppContext();

        expect(buildEnvironmentForJurisdiction).toHaveBeenCalledWith(mockAppEnvironment, "UK");
      });

      it("should call buildAppContext with the response and treated environment", async () => {
        const { initAppContext } = await setup();

        await initAppContext();

        expect(buildAppContext).toHaveBeenCalledWith({
          appContextResponse: mockBffResponse,
          environment: mockTreatedEnvironment,
        });
      });

      it("should return the built app context", async () => {
        const { initAppContext } = await setup();

        const result = await initAppContext();

        expect(result).toEqual(mockAppContext);
      });
    });
  });
});
