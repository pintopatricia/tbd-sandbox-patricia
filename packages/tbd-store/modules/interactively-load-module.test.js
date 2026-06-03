import { getInteractivelyLoadModule } from "./interactively-load-module";
import { createSupervisor } from "../middlewares/supervisor-saga";
import { startExchangeMarketUpdates } from "../middlewares/exchange-market-saga";

jest.mock("../middlewares/supervisor-saga", () => ({
  createSupervisor: jest.fn((...args) => `${args[1]}-supervisor`),
}));
jest.mock("../middlewares/more-catalogue-saga", () => ({
  fetchMoreCatalogueSaga: "more-catalogue-saga",
}));
jest.mock("../middlewares/catalogue-cards-saga", () => ({
  cardsCatalogueSaga: "catalogue-cards-saga",
}));
jest.mock("../middlewares/exchange-market-saga", () => ({
  exchangeMarketSaga: "exchange-market-saga",
  startExchangeMarketUpdates: jest.fn(),
}));
jest.mock("../middlewares/sportsbook-betting-saga", () => ({
  sportsbookBettingSaga: "sportsbook-betting-saga",
}));
jest.mock("../middlewares/market-transitions-monitor-saga", () => ({
  marketTransitionsMonitorSaga: "market-transitions-monitor-saga",
}));
jest.mock("../middlewares/main-markets-monitor-saga", () => ({
  mainMarketsMonitorSaga: "main-markets-monitor-saga",
}));

describe("getInteractivelyLoadModule", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return the incremental load module", () => {
    const interactivelyLoadModule = getInteractivelyLoadModule();

    expect(interactivelyLoadModule).toEqual({
      id: "interactively-load-module",
      middlewares: [],
      reducerMap: {},
      sagas: [
        "more-catalogue-saga",
        "catalogue-cards-saga",
        "exchange-market-saga",
        "ERO-supervisor",
        "sportsbook-betting-saga",
        "market-transitions-monitor-saga",
        "main-markets-monitor-saga",
      ],
    });
  });

  it("should call supervisor with correct arguments", () => {
    getInteractivelyLoadModule();

    expect(createSupervisor).toHaveBeenCalledWith(startExchangeMarketUpdates, "ERO", [
      "SUBSCRIBE_EXCHANGE_MARKET_UPDATES",
    ]);
  });
});
