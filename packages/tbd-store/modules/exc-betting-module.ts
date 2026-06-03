import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { exchangeOrderMatcher } from "../middlewares/exchange-order-matcher";
import { exchangeBettingMiddleware } from "../middlewares/exchange-betting";
import { exchangeBettingSaga } from "../middlewares/exchange-betting-saga";
import { fetchExchangeBetsUpdatesSaga } from "../middlewares/live-bet-reporting-saga";
import betslipReducer from "../state/betslip/betslip-card-reducer";
import { MODULES__EXC_BETTING_LOADED } from "../actions/modules";

export const getExchangeBettingModule = (): ISagaModule<ApplicationState> => ({
  id: "exc-betting-module",
  reducerMap: { betslip: betslipReducer } as any,
  middlewares: [exchangeOrderMatcher, exchangeBettingMiddleware],
  sagas: [exchangeBettingSaga, fetchExchangeBetsUpdatesSaga],
  initialActions: [
    {
      type: MODULES__EXC_BETTING_LOADED,
    },
  ],
});
