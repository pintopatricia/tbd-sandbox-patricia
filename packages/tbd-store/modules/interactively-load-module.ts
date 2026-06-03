import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { fetchMoreCatalogueSaga } from "../middlewares/more-catalogue-saga";
import { cardsCatalogueSaga } from "../middlewares/catalogue-cards-saga";
import { exchangeMarketSaga, startExchangeMarketUpdates } from "../middlewares/exchange-market-saga";
import { sportsbookBettingSaga } from "../middlewares/sportsbook-betting-saga";
import { marketTransitionsMonitorSaga } from "../middlewares/market-transitions-monitor-saga";
import { mainMarketsMonitorSaga } from "../middlewares/main-markets-monitor-saga";
import { createSupervisor } from "../middlewares/supervisor-saga";
import { SUBSCRIBE_EXCHANGE_MARKET_UPDATES } from "../actions/exchange-markets";

export const getInteractivelyLoadModule = (): ISagaModule<ApplicationState> => ({
  id: "interactively-load-module",
  reducerMap: {} as any,
  middlewares: [],
  sagas: [
    fetchMoreCatalogueSaga,
    cardsCatalogueSaga,
    exchangeMarketSaga,
    createSupervisor(startExchangeMarketUpdates, "ERO", [SUBSCRIBE_EXCHANGE_MARKET_UPDATES]),
    sportsbookBettingSaga,
    marketTransitionsMonitorSaga,
    mainMarketsMonitorSaga,
  ],
});
