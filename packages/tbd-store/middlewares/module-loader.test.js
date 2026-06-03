import { MODULES__LOADER_INIT } from "../actions/modules";
import { UPDATE_PRODUCT_PREFERENCE } from "../actions/preferences";
import { CMD_LOAD_SBK_BETSLIP, ProductsOption } from "../state";

jest.mock("../modules/sbk-betting-module", () => ({
  getSportsbookBettingModule: jest.fn().mockReturnValue({ sbkModule: "sbkModule" }),
}));

jest.mock("../modules/exc-betting-module", () => ({
  getExchangeBettingModule: jest.fn().mockReturnValue({ excModule: "excModule" }),
}));

const storeMock = {
  addModule: jest.fn(() => "added-module"),
  getState: jest.fn(() => ({
    entities: {
      preferences: { products: [] },
    },
  })),
};
const storageMock = jest.fn(() => "added-module");
const appCommandsMock = [];

function setup(store = storeMock, storage = storageMock, appCommands = appCommandsMock) {
  let middleware;

  jest.isolateModules(() => {
    ({ createDynamicModuleLoader: middleware } = require("./module-loader"));
  });

  return middleware(store, storage, appCommands)(store)(jest.fn());
}

describe("Module Loader Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is MODULES__LOADER_INIT", () => {
    describe("when loading modules based on product", () => {
      describe("when there is a sportsbook product", () => {
        it("should load sportsbook only", async () => {
          storeMock.getState.mockReturnValue({
            entities: {
              preferences: { products: [ProductsOption.sportsbook] },
            },
          });
          const victim = setup();

          victim({ type: MODULES__LOADER_INIT });

          await import("../modules/exc-betting-module");
          await import("../modules/sbk-betting-module");

          expect(storeMock.addModule).toHaveBeenCalledTimes(1);
          expect(storeMock.addModule).toHaveBeenCalledWith({ sbkModule: "sbkModule" });
        });
      });

      describe("when there is an exchange product", () => {
        it("should load exchange only", async () => {
          storeMock.getState.mockReturnValue({
            entities: {
              preferences: { products: [ProductsOption.exchange] },
            },
          });
          const victim = setup();

          victim({ type: MODULES__LOADER_INIT });

          await import("../modules/exc-betting-module");
          await import("../modules/sbk-betting-module");

          expect(storeMock.addModule).toHaveBeenCalledTimes(1);
          expect(storeMock.addModule).toHaveBeenCalledWith({ excModule: "excModule" });
        });
      });

      describe("when there are both products", () => {
        it("should load both products", async () => {
          storeMock.getState.mockReturnValue({
            entities: {
              preferences: { products: [ProductsOption.sportsbook, ProductsOption.exchange] },
            },
          });
          const victim = setup();

          victim({ type: MODULES__LOADER_INIT });

          await import("../modules/exc-betting-module");
          await import("../modules/sbk-betting-module");

          expect(storeMock.addModule).toHaveBeenCalledWith({ excModule: "excModule" });
          expect(storeMock.addModule).toHaveBeenCalledWith({ sbkModule: "sbkModule" });
        });
      });

      describe("when there are no products", () => {
        it("should load both modules", async () => {
          const victim = setup();

          victim({ type: MODULES__LOADER_INIT });

          await import("../modules/exc-betting-module");
          await import("../modules/sbk-betting-module");

          expect(storeMock.addModule).toHaveBeenCalledWith({ excModule: "excModule" });
          expect(storeMock.addModule).toHaveBeenCalledWith({ sbkModule: "sbkModule" });
        });
      });

      describe("when there are sportsbook commands", () => {
        it("should load sportsbook", async () => {
          storeMock.getState.mockReturnValue({
            entities: {
              preferences: { products: [ProductsOption.games] },
            },
          });

          const victim = setup(storeMock, storageMock, [{ name: CMD_LOAD_SBK_BETSLIP }]);

          victim({ type: MODULES__LOADER_INIT });

          await import("../modules/exc-betting-module");
          await import("../modules/sbk-betting-module");

          expect(storeMock.addModule).toHaveBeenCalledTimes(1);
          expect(storeMock.addModule).toHaveBeenCalledWith({ sbkModule: "sbkModule" });
        });
      });
    });
  });

  describe("when switching products", () => {
    describe("when switching to sportsbook", () => {
      it("should load sportsbook only", async () => {
        storeMock.getState.mockReturnValue({
          entities: {
            preferences: { products: [ProductsOption.exchange] },
          },
        });
        const victim = setup();

        victim({ type: UPDATE_PRODUCT_PREFERENCE, payload: { productSwitcherPreference: ProductsOption.sportsbook } });

        await import("../modules/exc-betting-module");
        await import("../modules/sbk-betting-module");

        expect(storeMock.addModule).toHaveBeenCalledTimes(1);
        expect(storeMock.addModule).toHaveBeenCalledWith({ sbkModule: "sbkModule" });
      });
    });

    describe("when there is an exchange product", () => {
      it("should load exchange only", async () => {
        storeMock.getState.mockReturnValue({
          entities: {
            preferences: { products: [ProductsOption.sportsbook] },
          },
        });
        const victim = setup();

        victim({ type: UPDATE_PRODUCT_PREFERENCE, payload: { productSwitcherPreference: ProductsOption.exchange } });

        await import("../modules/exc-betting-module");
        await import("../modules/sbk-betting-module");

        expect(storeMock.addModule).toHaveBeenCalledTimes(1);
        expect(storeMock.addModule).toHaveBeenCalledWith({ excModule: "excModule" });
      });
    });
  });
});
