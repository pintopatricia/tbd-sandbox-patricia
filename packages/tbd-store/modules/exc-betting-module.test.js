import { MODULES__EXC_BETTING_LOADED } from "../actions/modules";
import { getExchangeBettingModule } from "./exc-betting-module";

jest.mock("../middlewares/exchange-order-matcher", () => ({
  exchangeOrderMatcher: "exchange-order-matcher",
}));
jest.mock("../middlewares/exchange-betting", () => ({
  exchangeBettingMiddleware: "exchange-betting",
}));
jest.mock("../middlewares/exchange-betting-saga", () => ({
  exchangeBettingSaga: "exchange-betting-saga",
}));
jest.mock("../middlewares/live-bet-reporting-saga", () => ({
  fetchExchangeBetsUpdatesSaga: "fetch-exchange-bets-updates-saga",
}));
jest.mock("../state/betslip/betslip-card-reducer", () => "betslip-reducer");

describe("getExchangeBettingModule", () => {
  it("should return the betting module", () => {
    expect(getExchangeBettingModule()).toEqual({
      id: "exc-betting-module",
      middlewares: ["exchange-order-matcher", "exchange-betting"],
      reducerMap: { betslip: "betslip-reducer" },
      sagas: ["exchange-betting-saga", "fetch-exchange-bets-updates-saga"],
      initialActions: [
        {
          type: MODULES__EXC_BETTING_LOADED,
        },
      ],
    });
  });
});
