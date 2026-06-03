import { AppRegistry } from "react-native";
import appConfiguration from "@ppb/tbd-shared/config/app-configuration.native";

jest.mock("./polyfills", () => ({}));
jest.mock("react-native-gesture-handler", () => ({}));
jest.mock("react-native-get-random-values", () => ({}));

jest.mock("react-native", () => ({
  AppRegistry: {
    registerRunnable: jest.fn(),
    registerComponent: jest.fn(),
    runApplication: jest.fn(),
  },
  LogBox: {
    ignoreAllLogs: jest.fn(),
  },
}));

jest.mock("react-native-launch-arguments", () => ({
  LaunchArguments: {
    value: jest.fn().mockReturnValue({}),
  },
}));

jest.mock("@ppb/tbd-shared/config/base-path-utils.native", () => ({
  isCurrentEnv: jest.fn().mockReturnValue(false),
  initEnvironment: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@ppb/tbd-shared/config/environments.native", () => ({
  Environment: { mockserver: "mockserver" },
}));

jest.mock("@ppb/tbd-shared/config/app-configuration.native", () => ({
  __esModule: true,
  default: {
    setup: jest.fn(),
    setupDeeplinkConfiguration: jest.fn(),
  },
}));

jest.mock("@ppb/tbd-shared/helpers/splash", () => ({
  hideSplash: jest.fn(),
}));

jest.mock("./App", () => "App");
jest.mock("./app.json", () => ({ name: "PaddyPowerApp", brand: "paddypower" }), { virtual: true });
jest.mock("./app.config.json", () => ({}), { virtual: true });
jest.mock("./config/help-center-urls", () => ({ HELP_CENTER_URLS: {} }));
jest.mock("./config/max-payout-limits", () => ({ MAX_PAYOUT_LIMITS: {} }));
jest.mock("./setup", () => ({
  initI18n: jest.fn().mockResolvedValue(undefined),
  initStore: jest.fn().mockResolvedValue({}),
}));
jest.mock("./helpers/init-cet-framework", () => ({}));

describe("apps/pp/native/index.js", () => {
  let deeplinkConfiguration;

  beforeAll(async () => {
    require("./index");
    const runnable = AppRegistry.registerRunnable.mock.calls[0][1];
    await runnable({});
    deeplinkConfiguration = appConfiguration.setupDeeplinkConfiguration.mock.calls[0][0];
  });

  it("registers the app runnable with the correct app name", () => {
    expect(AppRegistry.registerRunnable).toHaveBeenCalledWith("PaddyPowerApp", expect.any(Function));
  });

  it("sets up the deeplink configuration", () => {
    expect(appConfiguration.setupDeeplinkConfiguration).toHaveBeenCalledTimes(1);
    expect(deeplinkConfiguration).toEqual(
      expect.objectContaining({
        subdomainPattern: expect.any(RegExp),
        subdomainWhitelistPattern: expect.any(RegExp),
        extractViewURLPattern: expect.any(RegExp),
        gameLaunchURLPattern: expect.any(RegExp),
        casinoWhitelistPattern: expect.any(RegExp),
        gameCollectionUrnPattern: expect.any(RegExp),
        cetLoginUrlPattern: expect.any(RegExp),
        newGameLaunchPattern: expect.any(RegExp),
      }),
    );
  });

  describe("newGameLaunchPattern", () => {
    it.each([
      [
        "matches /play?gameId= (no trailing slash)",
        "https://casino.betfair.com/gaming-launcher/play?gameId=betfair-even-biggerb-abp&channel=y",
        true,
      ],
      [
        "matches /play/?gameId= (trailing slash)",
        "https://casino.betfair.com/gaming-launcher/play/?gameId=betfair-even-biggerb-abp&channel=y&returnURL=https://launcher.betfair.com/?goToOrigin=true",
        true,
      ],
      [
        "matches subdomain variations of betfair.com",
        "https://sportsgaming.betfair.com/gaming-launcher/play?gameId=foo",
        true,
      ],
      [
        "matches multi-part TLDs like betfair.com.au",
        "https://casino.betfair.com.au/gaming-launcher/play?gameId=foo",
        true,
      ],
      ["does not match when gameId is empty", "https://casino.betfair.com/gaming-launcher/play?gameId=", false],
      [
        "does not match URLs without /gaming-launcher/play",
        "https://casino.betfair.com/some-other-path?gameId=foo",
        false,
      ],
      ["does not match a non-betfair domain", "https://casino.example.com/gaming-launcher/play?gameId=foo", false],
      ["does not match http (non-https)", "http://casino.betfair.com/gaming-launcher/play?gameId=foo", false],
    ])("%s", (_label, url, shouldMatch) => {
      expect(deeplinkConfiguration.newGameLaunchPattern.test(url)).toBe(shouldMatch);
    });
  });
});
