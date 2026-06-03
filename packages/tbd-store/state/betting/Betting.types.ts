import { ExchangeBettingBonus } from "./exchange-betting-bonus/ExchangeBettingBonus.types";
import { ExchangeBettingPotentialState } from "./exchange-betting-potential/ExchangeBettingPotential.types";
import { ExchangeBettingState } from "./exchange-betting/ExchangeBetting.types";
import { ExchangeCashouts } from "./exchange-cashouts/ExchangeCashouts.types";
import { ExchangeMarketBets } from "./exchange-market-bets/ExchangeMarketBet.types";
import { ExchangeMarketsPosition } from "./exchange-orders/ExchangeOrder.types";
import { ObbBettingState } from "./obb-betting/ObbBetting.types";
import { PopularBettingState } from "./popular-betting/PopularBetting.types";
import { SportsbookBets } from "./sportsbook-bets/SportsbookBet.types";
import { SportsbookBettingState } from "./sportsbook-betting/SportsbookBetting.types";
import { SportsbookCashouts } from "./sportsbook-cashouts/SportsbookCashouts.types";

export type Betting = {
  readonly exchangeBetting: ExchangeBettingState;
  readonly exchangeBettingBonus: ExchangeBettingBonus;
  readonly exchangeBettingPotential: ExchangeBettingPotentialState;
  readonly exchangecashouts: ExchangeCashouts;
  readonly exchangemarketbets: ExchangeMarketBets;
  readonly exchangeorders: ExchangeMarketsPosition;
  readonly sportsbookbets: SportsbookBets;
  readonly sportsbookBetting: SportsbookBettingState;
  readonly sportsbookcashouts: SportsbookCashouts;
  readonly obbBetting: ObbBettingState;
  readonly popularBetting: PopularBettingState;
};
