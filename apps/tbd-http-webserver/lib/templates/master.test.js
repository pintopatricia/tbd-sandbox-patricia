import { AsType, RelType } from "../helpers/assets-builder";
import victim from "./master";

jest.mock("isomorphic-dompurify", () => ({
  sanitize: jest.fn((input) => input),
}));

jest.mock("../config/environment-backend.json", () => ({
  PAGE_TITLE: "Some amazing title",
  PAGE_DESCRIPTION: "Yet a better description",
}));

function minify(html) {
  return html.replace(/\s{2,}/g, "");
}

describe("master", () => {
  const assetsNoCss = {
    PRELOAD_CSS_ASSETS: [],
    PRELOAD_JS_ASSETS: [
      { name: "ie1/tbd/assets/app.js", rel: RelType.Preload, as: AsType.Script },
      { name: "ie1/tbd/assets/runtime.js", rel: RelType.Preload, as: AsType.Script },
      { name: "ie1/tbd/assets/vendors~app.js", rel: RelType.Preload, as: AsType.Script },
      { name: "ie1/tbd/assets/chunk.js", rel: RelType.Preload, as: AsType.Script },
      { name: "ie1/tbd/assets/translations-pt_BR.js", rel: RelType.Preload, as: AsType.Script },
    ],
    PRELOAD_IMG_ASSETS: [
      { name: "https://pma-s3.betfair.com", rel: RelType.Preload, as: AsType.Image, priority: true },
    ],
    PRELOAD_ICON_ASSETS: [{ name: "ie1/tbd/assets/systemIcons.js", rel: RelType.Preload, as: AsType.Script }],
    PRELOAD_FONTS: [{ name: "ie1/tbd/assets/font.woff2", rel: RelType.Preload, as: AsType.Font }],
    CATALOG_PRELOAD_CSS_ASSETS: [{ name: "ie1/tbd/assets/chunk.css", rel: RelType.Stylesheet, as: AsType.Style }],
    CATALOG_PRELOAD_JS_ASSETS: [{ name: "ie1/tbd/assets/chunk.js", rel: RelType.Preload, as: AsType.Script }],
    JS_SCRIPTS: [
      { name: "ie1/tbd/assets/app.js" },
      { name: "ie1/tbd/assets/runtime.js" },
      { name: "ie1/tbd/assets/vendors~app.js" },
      { name: "ie1/tbd/assets/chunk.js" },
      { name: "ie1/tbd/assets/translations-pt_BR.js" },
    ],
    PRECONNECT_ORIGINS: [
      { name: "https://www.betfair.com", rel: RelType.Preconnect, crossorigin: true },
      { name: "https://apitbd.betfair.com", rel: RelType.Preconnect, crossorigin: true },
      { name: "https://was.betfair.com", rel: RelType.Preconnect, crossorigin: true },
    ],
    SIGNALFX: { name: "ie1/tbd/assets/splunk-otel-web.js" },
    SIGNALFX_SESSION_RECORDING: { name: "ie1/tbd/assets/splunk-otel-web-session-recorder.js" },
    SIGNALFX_META: { name: "TestApp", realm: "EU1", environment: "dev", accessToken: "FooBar", sessionRecording: true },
  };
  const assetsWithCss = {
    ...assetsNoCss,
    PRELOAD_CSS_ASSETS: [
      { name: "ie1/tbd/assets/app.css", rel: RelType.Stylesheet, as: AsType.Script },
      { name: "ie1/tbd/assets/vendors~app.css", rel: RelType.Stylesheet, as: AsType.Script },
      { name: "ie1/tbd/assets/chunk.css", rel: RelType.Stylesheet, as: AsType.Script },
    ],
  };

  const environmentConfig = {
    ASSETS: {
      HOST: "",
      BASE_PATH: "ie1/tbd/assets",
    },
    SSO_URL: {
      link: "https://test.master.com",
    },
  };
  const base = "/betting";
  const environment = {
    REN_USER_AGENTS: {
      MOBILE: "RENBF Android",
      DESKTOP: "RENBF Desktop",
    },
    DOMAIN_EXTENSIONS: {
      INTERNATIONAL: "com",
      SPAIN: "es",
    },
  };

  const environmentConfigWithSignalFX = {
    ...environment,
    SIGNALFX: true,
  };

  const $requestContext = { userAgent: "bla" };
  const $log = {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  };
  const queryParams = {
    loginStatus: "NOPE",
  };
  const GAConfigMock = {
    ga4: { head: "", body: "" },
    ua: "",
  };
  const clientContextMock = {
    platform: "web",
    uiVariant: "mobile",
    wrapper: {
      wrapperName: "SportsWrapper",
      bridgeAPIVersion: "7.6.3",
    },
  };

  describe("when template options are not defined", () => {
    it("should render html with css and with no custom preconnect origins", () => {
      const result = victim({
        base,
        assets: { ...assetsWithCss, PRECONNECT_ORIGINS: [] },
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams,
        preloadedData: undefined,
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).not.toContain("https://apitbd.betfair.com");
      expect(result).not.toContain("https://was.betfair.com");
    });
  });

  describe("when template options are defined", () => {
    it("should render html without css and with preconnect origins", () => {
      const result = victim({
        base,
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: undefined,
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain('<link href="https://www.betfair.com" rel="preconnect" crossorigin />');
      expect(result).toContain('<link href="https://apitbd.betfair.com" rel="preconnect" crossorigin />');
      expect(result).toContain('<link href="https://was.betfair.com" rel="preconnect" crossorigin />');
    });

    it("should render html without image and with preconnect origins", () => {
      const result = victim({
        base,
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain(
        '<link href="https://pma-s3.betfair.com" rel="preload" as="image" fetchpriority="high" />',
      );
    });
  });

  describe("when preloaded data exists", () => {
    it("should render html with __TBD_PRELOADED_CATALOG__", () => {
      const result = victim({
        base,
        assets: assetsWithCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { entities: { userdetails: { localeCode: "pt_BR" } }, router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain(
        'window.__TBD_PRELOADED_CATALOG__ = {"entities":{"userdetails":{"localeCode":"pt_BR"}},"layouts":{"cardgroups":{}}}',
      );
    });
  });

  describe("when App Context data exists", () => {
    it("should render html with __APP_CONTEXT__", () => {
      const result = victim({
        base,
        assets: assetsWithCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { entities: { userdetails: { localeCode: "pt_BR" } }, router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: { AppContext: { urn: "ppb:tbd:appContext:appContext" } },
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain('window.__APP_CONTEXT__ = {"AppContext":{"urn":"ppb:tbd:appContext:appContext"}}');
    });
  });

  describe("when signalfx data exists", () => {
    it("should render html with the correct signalfx script", () => {
      const result = victim({
        base,
        assets: assetsWithCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { entities: { userdetails: { localeCode: "pt_BR" } }, router: { currentUrl: "/" } },
        environment: environmentConfigWithSignalFX,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain('<script src="ie1/tbd/assets/splunk-otel-web.js"></script>');
      expect(result).toContain('<script src="ie1/tbd/assets/splunk-otel-web-session-recorder.js"></script>');
    });
  });

  describe("when signalfx data exists", () => {
    it("should render html with the correct signalfx script", () => {
      const result = victim({
        base,
        assets: assetsWithCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { entities: { userdetails: { localeCode: "pt_BR" } }, router: { currentUrl: "/" } },
        environment: environmentConfigWithSignalFX,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain('<script src="ie1/tbd/assets/splunk-otel-web.js"></script>');
      expect(result).toContain('<script src="ie1/tbd/assets/splunk-otel-web-session-recorder.js"></script>');
      expect(result).toContain("SplunkRum.init");
    });
  });

  describe("when app commands are resolved", () => {
    it("should render html with app commands", () => {
      const result = victim({
        base,
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: undefined,
        appContext: undefined,
        appCommands: ["some command", "another command"],
        GAConfig: GAConfigMock,
      });

      expect(result).toContain('window.__TBD_APP_COMMANDS__ = ["some command","another command"]');
    });
  });

  describe("when user agent is REN_USER_AGENT", () => {
    it("should set the content loading parameters", () => {
      const result = victim({
        base,
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment: {
          ...environment,
          REN_USER_AGENTS: {
            MOBILE: "RENBF Android",
            DESKTOP: "RENBF Desktop",
          },
        },
        $requestContext: { userAgent: "RENBF Desktop" },
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
        },
        preloadedData: undefined,
        appContext: undefined,
        appCommands: undefined,
        GAConfig: GAConfigMock,
      });

      expect(result).toContain(
        'window.__CONTENT_LOADING_PARAMETERS__ = {"catalog":true,"sportsbookPrices":true,"exchangePrices":true,"isDesktop":true}',
      );
    });
  });

  describe("when using custom tokens", () => {
    describe("when process.env is production", () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "production" };
      });

      afterEach(() => {
        process.env = originalEnv;
      });

      it("should not use custom tokens", () => {
        const result = victim({
          base,
          assets: assetsWithCss,
          appSuitableEnvironment: environmentConfig,
          initialState: { initial: "state", router: { currentUrl: "/" } },
          environment,
          $requestContext,
          $log,
          queryParams: {
            loginStatus: "SUCCESS",
            customTokens: "0.0.0-my-pre",
            customBrand: "my-brand",
            customTheme: "sports.light",
          },
          preloadedData: undefined,
          appContext: undefined,
          appCommands: undefined,
          GAConfig: GAConfigMock,
        });

        expect(result).not.toContain("0.0.0-my-pre");
      });
    });

    describe("when a query param for tokens is missing", () => {
      it("should not use custom tokens", () => {
        const result = victim({
          base,
          assets: assetsWithCss,
          appSuitableEnvironment: environmentConfig,
          initialState: { initial: "state", router: { currentUrl: "/" } },
          environment,
          $requestContext,
          $log,
          queryParams: {
            loginStatus: "SUCCESS",
            customTokens: "0.0.0-my-pre",
            customBrand: undefined,
            customTheme: "sports.light",
          },
          preloadedData: undefined,
          appContext: undefined,
          appCommands: undefined,
          GAConfig: GAConfigMock,
        });

        expect(result).not.toContain("0.0.0-my-pre");
      });
    });

    describe("when every query param are present", () => {
      it("should include custom tokens css", () => {
        const result = victim({
          base,
          assets: assetsWithCss,
          appSuitableEnvironment: environmentConfig,
          initialState: { initial: "state", router: { currentUrl: "/" } },
          environment,
          $requestContext,
          $log,
          queryParams: {
            loginStatus: "SUCCESS",
            customTokens: "0.0.0-my-pre",
            customBrand: "my-brand",
            customTheme: "sports.light",
          },
          preloadedData: undefined,
          appContext: undefined,
          appCommands: undefined,
          GAConfig: GAConfigMock,
        });

        expect(result).toContain(
          '<link rel="stylesheet" href="https://artifactory-prd.prd.betfair/artifactory/NodeJS/%40ppb/the-wall-design-tokens/-/%40ppb/the-wall-design-tokens-0.0.0-my-pre.tgz!/package/generated/my-brand/core/web/sports.light.css">',
        );
      });

      it("should overwrite the env name", () => {
        const result = victim({
          base,
          assets: assetsWithCss,
          appSuitableEnvironment: { ...environmentConfig },
          initialState: { initial: "state", router: { currentUrl: "/" } },
          environment,
          $requestContext,
          $log,
          queryParams: {
            loginStatus: "SUCCESS",
            customTokens: "0.0.0-my-pre",
            customBrand: "my-brand",
            customTheme: "sports.light",
          },
          preloadedData: undefined,
          appContext: undefined,
          appCommands: undefined,
          GAConfig: GAConfigMock,
        });

        expect(result).toContain('"ENV":"tokens preview (0.0.0-my-pre)"');
        expect(environmentConfig.ENV).toBe("tokens preview (0.0.0-my-pre)");
      });
    });
  });

  it("should render html with __TBD_CLIENT_CONTEXT__", () => {
    const result = victim({
      base,
      assets: assetsWithCss,
      appSuitableEnvironment: environmentConfig,
      initialState: { entities: { userdetails: { localeCode: "pt_BR" } }, router: { currentUrl: "/" } },
      environment,
      $requestContext,
      $log,
      queryParams: {
        loginStatus: "SUCCESS",
      },
      preloadedData: {
        viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
        criticalChunksCss: ["chunk.css"],
        criticalChunksJs: ["chunk.js"],
        criticalImages: ["https://pma-s3.betfair.com/test.png"],
      },
      appCommands: undefined,
      GAConfig: GAConfigMock,
      clientContext: clientContextMock,
    });

    expect(result).toContain(
      'window.__TBD_CLIENT_CONTEXT__ = {"platform":"web","uiVariant":"mobile","wrapper":{"wrapperName":"SportsWrapper","bridgeAPIVersion":"7.6.3"}}',
    );
  });

  describe("should have apple-touch-icon into header", () => {
    it("should render apple-touch-icon for all brands", () => {
      const result = victim({
        base,
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams,
        GAConfig: GAConfigMock,
        clientContext: clientContextMock,
      });

      expect(result).toContain('<link rel="apple-touch-icon" href="/betting/tbd/assets/favicon-apple.png" />');
    });
  });

  describe("base path favicon handling", () => {
    it("should handle base path ending with slash", () => {
      const result = victim({
        base: "/betting/",
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams,
        GAConfig: GAConfigMock,
        clientContext: clientContextMock,
      });

      expect(result).toContain('<link rel="icon" href="/betting/tbd/assets/favicon.ico"');
      expect(result).toContain('<link rel="apple-touch-icon" href="/betting/tbd/assets/favicon-apple.png"');
    });

    it("should handle base path without trailing slash", () => {
      const result = victim({
        base: "/betting",
        assets: assetsNoCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { router: { currentUrl: "/" } },
        environment,
        $requestContext,
        $log,
        queryParams,
        GAConfig: GAConfigMock,
        clientContext: clientContextMock,
      });

      expect(result).toContain('<link rel="icon" href="/betting/tbd/assets/favicon.ico"');
      expect(result).toContain('<link rel="apple-touch-icon" href="/betting/tbd/assets/favicon-apple.png"');
    });
  });

  describe("when all conditions are enabled (integration test)", () => {
    it("should set the content loading parameters", () => {
      const result = victim({
        base,
        assets: assetsWithCss,
        appSuitableEnvironment: environmentConfig,
        initialState: { initial: "state", router: { currentUrl: "/" } },
        environment: {
          ...environment,
          REN_USER_AGENTS: {
            MOBILE: "RENBF Android",
            DESKTOP: "RENBF Desktop",
          },
        },
        $requestContext: { userAgent: "RENBF Android" },
        $log,
        queryParams: {
          loginStatus: "SUCCESS",
          customTokens: "0.0.0-my-pre",
          customBrand: "my-brand",
          customTheme: "sports.light",
        },
        preloadedData: {
          viewRequestPayload: { entities: { userdetails: { localeCode: "pt_BR" } }, layouts: { cardgroups: {} } },
          criticalChunksCss: ["chunk.css"],
          criticalChunksJs: ["chunk.js"],
          criticalImages: ["https://pma-s3.betfair.com/test.png"],
        },
        appContext: undefined,
        GAConfig: {
          ua: "UAConfig",
          ga4: { head: "GA4Head", body: "GA4Body" },
        },
        clientContext: clientContextMock,
      });

      expect(minify(result)).toEqual(
        '<!DOCTYPE html><html lang="en"><head>GA4Head<script>window.prerenderReady = false;</script><meta charset="utf-8" /><title>Some amazing title</title><meta name="description" content="Yet a better description" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><base id="tbdBase" href="/betting" /><link rel="icon" href="/betting/tbd/assets/favicon.ico" type="image/x-icon" /><link rel="apple-touch-icon" href="/betting/tbd/assets/favicon-apple.png" /><link rel="manifest" href="/betting/tbd/assets/manifest.webmanifest" /><script src="ie1/tbd/assets/splunk-otel-web.js"></script><script src="ie1/tbd/assets/splunk-otel-web-session-recorder.js"></script><script>SplunkRum.init({realm: "EU1",rumAccessToken: "FooBar",applicationName: "TestApp",disableAutomationFrameworks: "true",instrumentations: {connectivity: "true",visibility: "true",},disableBots: "true",deploymentEnvironment: "dev",tracer: {sampler: new SplunkRum.SessionBasedSampler({ratio: undefined}),},});SplunkSessionRecorder.init({app: "TestApp",realm: "EU1",rumAccessToken: "FooBar"});</script><link href="https://www.betfair.com" rel="preconnect" crossorigin /><link href="https://apitbd.betfair.com" rel="preconnect" crossorigin /><link href="https://was.betfair.com" rel="preconnect" crossorigin /><link href="ie1/tbd/assets/app.js" rel="preload" as="script" /><link href="ie1/tbd/assets/runtime.js" rel="preload" as="script" /><link href="ie1/tbd/assets/vendors~app.js" rel="preload" as="script" /><link href="ie1/tbd/assets/chunk.js" rel="preload" as="script" /><link href="ie1/tbd/assets/translations-pt_BR.js" rel="preload" as="script" /><link href="ie1/tbd/assets/chunk.js" rel="preload" as="script" /><link href="ie1/tbd/assets/systemIcons.js" rel="preload" as="script" /><link href="ie1/tbd/assets/font.woff2" rel="preload" as="font" /><link href="ie1/tbd/assets/app.css" rel="stylesheet" as="script" /><link href="ie1/tbd/assets/vendors~app.css" rel="stylesheet" as="script" /><link href="ie1/tbd/assets/chunk.css" rel="stylesheet" as="script" /><link href="ie1/tbd/assets/chunk.css" rel="stylesheet" as="style" /><link href="https://pma-s3.betfair.com" rel="preload" as="image" fetchpriority="high" /><link rel="stylesheet" href="https://artifactory-prd.prd.betfair/artifactory/NodeJS/%40ppb/the-wall-design-tokens/-/%40ppb/the-wall-design-tokens-0.0.0-my-pre.tgz!/package/generated/my-brand/core/web/fonts.css"><link rel="stylesheet" href="https://artifactory-prd.prd.betfair/artifactory/NodeJS/%40ppb/the-wall-design-tokens/-/%40ppb/the-wall-design-tokens-0.0.0-my-pre.tgz!/package/generated/my-brand/core/web/sports.light.css"></head><body>GA4Body<div id="root"></div><script>window.__PRELOADED_STATE__ = {"initial":"state","router":{"currentUrl":"/"}}window.__TBD_ENVIRONMENT__ = {"ASSETS":{"HOST":"","BASE_PATH":"ie1/tbd/assets"},"SSO_URL":{"link":"https://test.master.com"},"ENV":"tokens preview (0.0.0-my-pre)"}window.__TBD_PRELOADED_CATALOG__ = {"entities":{"userdetails":{"localeCode":"pt_BR"}},"layouts":{"cardgroups":{}}}window.__CONTENT_LOADING_PARAMETERS__ = {"catalog":true,"sportsbookPrices":true,"exchangePrices":true,"isDesktop":false}window.__POST_LOGIN_SESSION__ = truewindow.__TBD_APP_COMMANDS__ = undefinedwindow.__APP_CONTEXT__ = undefinedwindow.__TBD_CLIENT_CONTEXT__ = {"platform":"web","uiVariant":"mobile","wrapper":{"wrapperName":"SportsWrapper","bridgeAPIVersion":"7.6.3"}}</script><script src="ie1/tbd/assets/app.js"></script><script src="ie1/tbd/assets/runtime.js"></script><script src="ie1/tbd/assets/vendors~app.js"></script><script src="ie1/tbd/assets/chunk.js"></script><script src="ie1/tbd/assets/translations-pt_BR.js"></script><script src="ie1/tbd/assets/chunk.js"></script>UAConfig</body></html>',
      );
    });
  });
});
