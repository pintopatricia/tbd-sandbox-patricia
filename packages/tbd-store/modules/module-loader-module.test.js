import { MODULES__LOADER_INIT } from "../actions/modules";
import { createDynamicModuleLoader } from "../middlewares/module-loader";
import { getModuleLoader } from "./module-loader-module";

jest.mock("../middlewares/module-loader", () => ({
  createDynamicModuleLoader: jest.fn((store, storage) => `dynamic-module-loader-middleware-${store}-${storage}`),
}));
jest.mock("../state/betslip/betslip-card-reducer", () => "betslip-reducer");

describe("getModuleLoader", () => {
  it("should return the module loader", () => {
    const store = "store";
    const storage = "storage";
    const appCommands = "appCommands";

    expect(getModuleLoader(store, storage, appCommands)).toEqual({
      id: "module-loader-module",
      middlewares: [createDynamicModuleLoader(store, storage, appCommands)],
      reducerMap: {},
      sagas: [],
      initialActions: [{ type: MODULES__LOADER_INIT }],
    });
  });
});
