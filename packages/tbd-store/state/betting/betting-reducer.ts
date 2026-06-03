import { combineReducers, Reducer } from "redux";
import { exchangeBettingPotentialStateReducer } from "./exchange-betting-potential/exchange-betting-potential-reducer";
import exchangeBettingBonusReducer from "./exchange-betting-bonus/exchange-betting-bonus-reducer";
import exchangeBettingStateReducer from "./exchange-betting/exchange-betting-reducer";
import exchangeCashoutsReducer from "./exchange-cashouts/exchange-cashouts-reducer";
import exchangeMarketBetsReducer from "./exchange-market-bets/exchange-market-bets-reducer";
import exchangeOrdersReducer from "./exchange-orders/exchange-orders-reducer";
import sportsbookBetsReducer from "./sportsbook-bets/sportsbook-bets-reducer";
import sportsbookBettingReducer from "./sportsbook-betting/sportsbook-betting-reducer";
import sportsbookCashoutsReducer from "./sportsbook-cashouts/sportsbook-cashouts-reducer";
import obbBettingReducer from "./obb-betting/obb-betting-reducer";
import popularBettingReducer from "./popular-betting/popular-betting-reducer";
import { Betting } from "./Betting.types";

export const bettingReducer: Reducer<Betting> = combineReducers<Betting>({
  exchangeBetting: exchangeBettingStateReducer,
  exchangeBettingBonus: exchangeBettingBonusReducer,
  exchangeBettingPotential: exchangeBettingPotentialStateReducer,
  exchangecashouts: exchangeCashoutsReducer,
  exchangemarketbets: exchangeMarketBetsReducer,
  exchangeorders: exchangeOrdersReducer,
  sportsbookbets: sportsbookBetsReducer,
  sportsbookBetting: sportsbookBettingReducer,
  sportsbookcashouts: sportsbookCashoutsReducer,
  obbBetting: obbBettingReducer,
  popularBetting: popularBettingReducer,
});
