import { getIncrementalLoadModule } from "./incremental-load-module";

jest.mock("../middlewares/incremental-load-saga", () => ({
  incrementalLoadSaga: "incremental-load-saga",
}));
jest.mock("../middlewares/catalogue-cards-saga", () => ({
  cardsCatalogueSaga: "catalogue-cards-saga",
}));
jest.mock("../middlewares/incremental-load-prices-saga", () => ({
  incrementalLoadPricesSaga: "incremental-load-prices-saga",
}));

describe("getIncrementalLoadModule", () => {
  it("should return the incremental load module", () => {
    const incrementalLoadModule = getIncrementalLoadModule();

    expect(incrementalLoadModule).toEqual({
      id: "incremental-load-module",
      middlewares: [],
      reducerMap: {},
      sagas: ["incremental-load-saga", "catalogue-cards-saga", "incremental-load-prices-saga"],
    });
  });
});
