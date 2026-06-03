import { createStore } from "redux-dynamic-modules";
import { PlatformType } from "./middlewares/tagging-resolvers/AnalyticsConstants";
import { createRootSaga } from "./middlewares/root-saga";
import victim from "./create-store";
import { setApplicationKey } from "./config/application-key";
import { setupAssets } from "./config/assets-config";
import { productConfiguration } from "./config/product-configuration";

const storeMock = {
  addModule: jest.fn(() => {}),
};

jest.mock("redux-dynamic-modules", () => ({
  createStore: jest.fn(() => storeMock),
}));

jest.mock("redux", () => ({
  applyMiddleware: jest.fn(() => "apply-middleware-enhancer"),
}));

jest.mock("redux-dynamic-modules-saga", () => ({
  getSagaExtension: () => "fake-saga-extension",
}));

jest.mock("./middlewares/root-saga", () => ({
  createRootSaga: jest.fn(() => "root-saga"),
}));

jest.mock("./middlewares/otel-middleware", () => ({
  otelMiddleware: "otel-middleware",
}));
jest.mock("./middlewares/i18next", () => ({
  i18nextMiddleware: "i18next-middleware",
}));
jest.mock("./middlewares/race-results-updates-middleware", () => ({
  raceResultsCardUpdatesMiddleware: "raceresultscardupdates-middleware",
}));
jest.mock("./middlewares/rich-content-live-updates-middleware", () => ({
  richContentMiddleware: "richcontentliveupdates-middleware",
}));
jest.mock("./middlewares/win-lose-void-state-middleware", () => ({
  winLoseVoidUpdatesMiddleware: "winlosevoidupdates-middleware",
}));
jest.mock("./middlewares/bet-mutation-eligibility-middleware", () => ({
  betMutationEligibilityMiddleware: "bet-mutation-eligibility-middleware",
}));
jest.mock("./middlewares/obb-cards", () => ({
  obbCardsMiddleware: "obb-cards-middleware",
}));

jest.mock("./middlewares/sportsbook-market-prices-updates-middleware", () => ({
  sportsbookMarketPricesMiddleware: "sportsbookmarketpricesupdates-middleware",
}));

jest.mock("./middlewares/betting-opportunity-prices-updates-middleware", () => ({
  bettingOpportunityPricesMiddleware: "bettingopportunitypricesupdates-middleware",
}));

jest.mock("./middlewares/fixed-odds-cashout-quotes-middleware", () => ({
  fixedOddsCashoutQuotesUpdatesMiddleware: "fixedoddsashoutquotesupdates-middleware",
}));

jest.mock("./state/application-state-reducer", () => "reducers");

jest.mock("./config/application-key", () => ({
  setApplicationKey: jest.fn(),
}));

jest.mock("./config/assets-config", () => ({
  setupAssets: jest.fn(),
}));

jest.mock("./config/product-configuration", () => ({
  productConfiguration: {
    setPayoutLimits: jest.fn(),
  },
}));

jest.mock("./modules/interactively-load-module", () => ({ getInteractivelyLoadModule: () => {} }));

jest.mock("./state/rating/rate-my-app-reducer");

jest.mock("./modules/commands-module", () => ({
  getCommandsModule: jest.fn().mockReturnValue({ commands: "commands" }),
}));

describe("Create Store", () => {
  beforeEach(jest.clearAllMocks);

  it("should throw if no store options provided", () => {
    expect(() => victim({}, "someAppKey", undefined)).toThrow("Store creation: Options not provided");
  });

  it("should throw if application key is not provided", () => {
    expect(() => victim({}, undefined, {})).toThrow("Please provide a valid application key");
  });

  describe("when setting payouts", () => {
    it("should call productConfiguration with configured payouts", () => {
      const compose = jest.fn((middlewares) => middlewares);

      victim({}, "appkey", {
        payouts: {
          limits: { USD: { cap: 10 } },
          termsUrls: { en: "https://some.url" },
        },
        gtm: {
          getCookie: jest.fn(),
          collectorFn: jest.fn(),
        },
        compose,
      });

      expect(productConfiguration.setPayoutLimits).toHaveBeenCalledWith({ USD: { cap: 10 } });
    });
  });

  describe("when native", () => {
    it("should add commands module", () => {
      const compose = jest.fn((middlewares) => middlewares);

      victim({}, "appkey", {
        payouts: {},
        gtm: {
          getCookie: jest.fn(),
          collectorFn: jest.fn(),
          platformType: PlatformType.Native,
        },
        compose,
      });

      expect(storeMock.addModule).toHaveBeenCalledWith({ commands: "commands" });
    });
  });

  describe("when not native", () => {
    it("should not add commands module", () => {
      const compose = jest.fn((middlewares) => middlewares);

      victim({}, "appkey", {
        payouts: {},
        gtm: {
          getCookie: jest.fn(),
          collectorFn: jest.fn(),
        },
        compose,
      });

      expect(storeMock.addModule).not.toHaveBeenCalledWith({ commands: "commands" });
    });
  });

  describe("when building with default values", () => {
    it("should call createStore with the middleware-enhancer", () => {
      const compose = jest.fn((middlewares) => middlewares);

      victim({}, "appkey", {
        payouts: {},
        gtm: {
          getCookie: jest.fn(),
          collectorFn: jest.fn(),
        },
        compose,
      });

      expect(createStore).toHaveBeenCalledWith(
        {
          initialState: {},
          extensions: ["fake-saga-extension"],
          advancedComposeEnhancers: compose,
        },
        {
          id: "critical-module",
          reducerMap: "reducers",
          middlewares: [
            expect.any(Function),
            "otel-middleware",
            "i18next-middleware",
            "richcontentliveupdates-middleware",
            "sportsbookmarketpricesupdates-middleware",
            "bettingopportunitypricesupdates-middleware",
            "raceresultscardupdates-middleware",
            "winlosevoidupdates-middleware",
            "bet-mutation-eligibility-middleware",
            "obb-cards-middleware",
            "fixedoddsashoutquotesupdates-middleware",
          ],
          sagas: ["root-saga"],
        },
      );
    });
  });

  describe("when extra middlewares are passed as options", () => {
    it("should call createStore with middleware enhancer", () => {
      const compose = jest.fn((middlewares) => middlewares);

      victim({}, "appkey", {
        middlewares: ["middleware1", "middleware2"],
        payouts: {},
        gtm: {
          getCookie: jest.fn(),
          collectorFn: jest.fn(),
        },
        compose,
      });

      expect(createStore).toHaveBeenCalledWith(
        {
          advancedComposeEnhancers: compose,
          extensions: ["fake-saga-extension"],
          initialState: {},
        },
        {
          id: "critical-module",
          reducerMap: "reducers",
          middlewares: [
            expect.any(Function),
            "otel-middleware",
            "i18next-middleware",
            "richcontentliveupdates-middleware",
            "sportsbookmarketpricesupdates-middleware",
            "bettingopportunitypricesupdates-middleware",
            "raceresultscardupdates-middleware",
            "winlosevoidupdates-middleware",
            "bet-mutation-eligibility-middleware",
            "obb-cards-middleware",
            "fixedoddsashoutquotesupdates-middleware",
            "middleware1",
            "middleware2",
          ],
          sagas: ["root-saga"],
        },
      );
    });
  });

  it("should create the root saga with the messaging scheme", () => {
    victim({}, "appkey", {
      gtm: {
        getCookie: jest.fn(),
        collectorFn: jest.fn(),
      },
      messaging: {},
      sagas: {},
      payouts: {},
      sagaMiddlewares: {},
    });

    expect(createRootSaga).toHaveBeenCalledTimes(1);
    expect(createRootSaga.mock.calls[0][0]).toEqual({}, {});
    expect(createRootSaga).toHaveBeenCalledWith({}, {});
  });

  it("should export store", () => {
    const store = victim({}, "appkey", {
      payouts: {},
      gtm: {
        getCookie: jest.fn(),
        collectorFn: jest.fn(),
      },
    });

    expect(store).toEqual(storeMock);
  });

  it("should setup the intervals, application key and assets", () => {
    const applicationKey = "applicationKey";
    const assets = "assets";

    victim(assets, applicationKey, {
      payouts: {},
      gtm: {
        getCookie: jest.fn(),
        collectorFn: jest.fn(),
      },
    });

    expect(setApplicationKey).toHaveBeenCalledWith(applicationKey);
    expect(setupAssets).toHaveBeenCalledWith(assets);
  });
});
