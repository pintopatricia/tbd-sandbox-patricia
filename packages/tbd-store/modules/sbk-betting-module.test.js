import { getSportsbookBettingModule } from "./sbk-betting-module";

jest.mock("../middlewares/sportsbook-betting", () => ({
  sportsbookBettingMiddleware: "sportsbook-betting",
}));
jest.mock("../middlewares/obb-betting", () => ({
  obbBettingMiddleware: "obb-betting",
}));
jest.mock("../middlewares/obb-tagging", () => ({
  obbTaggingMiddleware: "obb-tagging",
}));
jest.mock("../middlewares/sportsbook-betting-loader-saga", () => ({
  sportsbookBettingLoaderSaga: (storage) => `sportsbook-betting-loader-saga-${storage}`,
}));
jest.mock("../middlewares/sportsbook-betting-combinator-saga", () => ({
  sportsbookBettingCombinatorSaga: "sportsbook-betting-combinator-saga",
}));
jest.mock("../middlewares/sportsbook-betting-transactional-saga", () => ({
  placeSportsbookBetsSaga: "sportsbook-betting-transactional-saga",
}));
jest.mock("../middlewares/sportsbook-betting-combinations-list-saga", () => ({
  combinationsListSaga: "combinations-list-saga",
}));
jest.mock("../middlewares/obb-betting-saga", () => ({
  obbBettingSaga: "obb-betting-saga",
}));
jest.mock("../state/betslip/betslip-card-reducer", () => "betslip-reducer");

describe("getSportsbookBettingModule", () => {
  it("should return the betting module", () => {
    expect(getSportsbookBettingModule()).toEqual({
      id: "sbk-betting-module",
      middlewares: ["sportsbook-betting", "obb-betting", "obb-tagging"],
      reducerMap: { betslip: "betslip-reducer" },
      sagas: [
        expect.any(Function),
        expect.any(Function),
        "sportsbook-betting-combinator-saga",
        "sportsbook-betting-transactional-saga",
        "combinations-list-saga",
        "obb-betting-saga",
      ],
      initialActions: [],
    });

    expect(getSportsbookBettingModule("storage-module").sagas[0]()).toEqual(
      "sportsbook-betting-loader-saga-storage-module",
    );
  });
});
