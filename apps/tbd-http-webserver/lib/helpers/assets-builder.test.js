import { AsType, buildAssetsConfig, RelType } from "./assets-builder";

jest.mock("../config/template-options.json", () => ({
  PRECONNECT_ORIGINS: ["https://pma-s3.betfair.{domain_extension}"],
}));

jest.mock("@ppb/tbd-store", () => ({
  replaceDomainPlaceholders: jest
    .fn()
    .mockImplementation((environment, domainExtension, domain) =>
      environment.replace(/{domain_extension}/g, domainExtension).replace(/{domain}/g, domain),
    ),
}));

const $log = { warn: jest.fn(), error: jest.fn() };
const envConfig = { ASSETS: { BASE_PATH: "ie1/tbd/assets", HOST: "www.betfair.com" } };
const envJSON = {
  DOMAIN_EXTENSIONS: { INTERNATIONAL: "com", SPAIN: "es" },
  NEW_RELIC: true,
  SIGNALFX: true,
  ASSETS: { FONTS: ["noto-sans-latin-400-normal.woff2", "noto-sans-latin-700-normal.woff2"] },
};

describe("buildAssetsConfig", () => {
  describe("when building css assets to preload", () => {
    describe("when building manifest based assets", () => {
      it("should return built validated assets", () => {
        const manifest = {
          "app.css": "app~hash.css",
          "SomeOtherChunk.css": "SomeOtherChunk~hash.css",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

        expect(assets.PRELOAD_CSS_ASSETS).toEqual([
          { name: "ie1/tbd/assets/app~hash.css", rel: RelType.Stylesheet, as: AsType.Style },
        ]);
      });
    });

    describe("when building catalog based css assets", () => {
      it("should return built assets", () => {
        const manifest = {
          "PromotionCard.css": "PromotionCard~hash.css",
          "BottomBar.css": "BottomBar~hash.css",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL", "", {
          criticalChunksCss: ["PromotionCard.css", "BottomBar.css", "InvalidChunk.css"],
        });

        expect(assets.CATALOG_PRELOAD_CSS_ASSETS).toEqual([
          { name: "ie1/tbd/assets/PromotionCard~hash.css", rel: RelType.Stylesheet, as: AsType.Style },
          { name: "ie1/tbd/assets/BottomBar~hash.css", rel: RelType.Stylesheet, as: AsType.Style },
        ]);
      });
    });
  });

  describe("when building js assets", () => {
    describe("when building manifest based assets to preload", () => {
      it("should return built localized validated assets", () => {
        const manifest = {
          "app.js": "app~hash.js",
          "SomeOtherChunk.js": "SomeOtherChunk~hash.js",
          "translations-en_GB.js": "translations-en_GB~hash.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

        expect(assets.PRELOAD_JS_ASSETS).toEqual([
          { name: "ie1/tbd/assets/translations-en_GB~hash.js", rel: RelType.Preload, as: AsType.Script },
          { name: "ie1/tbd/assets/app~hash.js", rel: RelType.Preload, as: AsType.Script },
        ]);
      });
    });

    describe("when building catalog based js assets to preload", () => {
      it("should return built assets", () => {
        const manifest = {
          "PromotionCard.js": "PromotionCard~hash.js",
          "BottomBar.js": "BottomBar~hash.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL", "", {
          criticalChunksJs: ["PromotionCard.js", "BottomBar.js", "InvalidChunk.js"],
        });

        expect(assets.CATALOG_PRELOAD_JS_ASSETS).toEqual([
          { name: "ie1/tbd/assets/PromotionCard~hash.js", rel: RelType.Preload, as: AsType.Script },
          { name: "ie1/tbd/assets/BottomBar~hash.js", rel: RelType.Preload, as: AsType.Script },
        ]);
      });
    });

    describe("when building manifest assets to include", () => {
      it("should return built validated assets", () => {
        const manifest = {
          "app.js": "app~hash.js",
          "SomeOtherChunk.js": "SomeOtherChunk~hash.js",
          "translations-en_GB.js": "translations-en_GB~hash.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

        expect(assets.JS_SCRIPTS).toEqual([
          { name: "ie1/tbd/assets/translations-en_GB~hash.js" },
          { name: "ie1/tbd/assets/app~hash.js" },
        ]);
      });
    });

    describe("when translations-userLocale.js is missing in manifest", () => {
      it("should fall back to translations-en_GB.js for PRELOAD_JS_ASSETS", () => {
        const manifest = {
          "app.js": "app~hash.js",
          "translations-en_GB.js": "translations-en_GB~hash.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "fr_FR", "INTERNATIONAL");
        expect(assets.PRELOAD_JS_ASSETS[0]).toEqual({
          name: "ie1/tbd/assets/translations-en_GB~hash.js",
          rel: RelType.Preload,
          as: AsType.Script,
        });
      });

      it("should fall back to translations-en_GB.js for JS_SCRIPTS", () => {
        const manifest = {
          "app.js": "app~hash.js",
          "translations-en_GB.js": "translations-en_GB~hash.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "fr_FR", "INTERNATIONAL");
        expect(assets.JS_SCRIPTS[0]).toEqual({
          name: "ie1/tbd/assets/translations-en_GB~hash.js",
        });
      });
    });
  });

  describe("when building img assets to preload", () => {
    it("should return built assets", () => {
      const manifest = {
        "PromotionCard.css": "PromotionCard~hash.css",
        "BottomBar.css": "BottomBar~hash.css",
      };
      const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL", "", {
        criticalImages: ["https://pma-s3.betfair.com/cdn-cgi/image.png", "https://images.prismic.io/image.png"],
      });

      expect(assets.PRELOAD_IMG_ASSETS).toEqual([
        {
          name: "https://pma-s3.betfair.com/cdn-cgi/image.png",
          rel: RelType.Preload,
          as: AsType.Image,
          priority: true,
        },
        { name: "https://images.prismic.io/image.png", rel: RelType.Preload, as: AsType.Image, priority: true },
      ]);
    });
  });

  describe("when building icon assets to preload", () => {
    it("should return built assets", () => {
      const manifest = {
        "sportsIcons.js": "sportsIcons~hash.js",
        "navigationIcons.js": "navigationIcons~hash.js",
        "systemIcons.js": "systemIcons~hash.js",
      };
      const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

      expect(assets.PRELOAD_ICON_ASSETS).toEqual([
        { name: "ie1/tbd/assets/sportsIcons~hash.js", rel: RelType.Preload, as: AsType.Script },
        { name: "ie1/tbd/assets/navigationIcons~hash.js", rel: RelType.Preload, as: AsType.Script },
        { name: "ie1/tbd/assets/systemIcons~hash.js", rel: RelType.Preload, as: AsType.Script },
      ]);
    });
  });

  describe("when building font assets to preload", () => {
    it("should return built assets", () => {
      const manifest = {};
      const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

      expect(assets.PRELOAD_FONTS).toEqual([
        {
          name: "ie1/tbd/assets/noto-sans-latin-400-normal.woff2",
          rel: RelType.Preload,
          as: AsType.Font,
          crossorigin: true,
        },
        {
          name: "ie1/tbd/assets/noto-sans-latin-700-normal.woff2",
          rel: RelType.Preload,
          as: AsType.Font,
          crossorigin: true,
        },
      ]);
    });
  });

  describe("when building signalfx asset", () => {
    describe("when signalfx is enabled", () => {
      it("should return populated SIGNALFX and an unpopulated SIGNALFX_SESSION_RECORDING", () => {
        const manifest = {};
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

        expect(assets.SIGNALFX).toEqual({ name: "ie1/tbd/assets/splunk-otel-web.js" });
        expect(assets.SIGNALFX_SESSION_RECORDING).toBeUndefined();
      });
    });

    describe("when signalfx is enabled and session recording is enabled", () => {
      it("should return populated SIGNALFX and populated SIGNALFX_SESSION_RECORDING", () => {
        const manifest = {};
        const assets = buildAssetsConfig(
          $log,
          manifest,
          envConfig,
          { ...envJSON, SIGNALFX_SESSION_RECORDING: true },
          "en_GB",
          "INTERNATIONAL",
        );

        expect(assets.SIGNALFX).toEqual({ name: "ie1/tbd/assets/splunk-otel-web.js" });
        expect(assets.SIGNALFX_BACKGROUND_SERVICE).toEqual({ name: "ie1/tbd/assets/background-service.html" });
        expect(assets.SIGNALFX_SESSION_RECORDING).toEqual({
          name: "ie1/tbd/assets/splunk-otel-web-session-recorder.js",
        });
      });
    });

    describe("when signalfx is disabled", () => {
      it("should return unpopulated SIGNALFX and unpopulated SIGNALFX_SESSION_RECORDING", () => {
        const manifest = {};
        const assets = buildAssetsConfig(
          $log,
          manifest,
          envConfig,
          { ...envJSON, SIGNALFX: false },
          "en_GB",
          "INTERNATIONAL",
        );

        expect(assets.SIGNALFX).toBeUndefined();
        expect(assets.SIGNALFX_BACKGROUND_SERVICE).toBeUndefined();
        expect(assets.SIGNALFX_SESSION_RECORDING).toBeUndefined();
      });
    });
  });

  describe("when building pre connect origins", () => {
    describe("when building for INTERNATIONAL jurisdiction", () => {
      it("should return built correct replaced origins", () => {
        const manifest = {
          "newrelic.js": "newrelic.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "INTERNATIONAL");

        expect(assets.PRECONNECT_ORIGINS).toEqual([
          { name: "www.betfair.com", rel: RelType.Preconnect, crossorigin: true },
          { name: "https://pma-s3.betfair.com", rel: RelType.Preconnect, crossorigin: true },
        ]);
      });
    });

    describe("when building for SPAIN jurisdiction", () => {
      it("should return built correct replaced origins", () => {
        const manifest = {
          "newrelic.js": "newrelic.js",
        };
        const assets = buildAssetsConfig($log, manifest, envConfig, envJSON, "en_GB", "SPAIN");

        expect(assets.PRECONNECT_ORIGINS).toEqual([
          { name: "www.betfair.com", rel: RelType.Preconnect, crossorigin: true },
          { name: "https://pma-s3.betfair.es", rel: RelType.Preconnect, crossorigin: true },
        ]);
      });
    });
  });
});
