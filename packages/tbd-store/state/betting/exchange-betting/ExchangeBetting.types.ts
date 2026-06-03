import { BetEngineState } from "@ppb/bet-engine";
import URN from "../../layout/URN";
import { ExchangeSide } from "../exchange-bets/ExchangeBet.types";

export type ExchangeUnmatchedBet = {
  betId: string;
  runner: URN;
  side: ExchangeSide;
  price?: number;
  size?: number;
  profit?: number;
  liability?: number;
  persistenceType: string;
  newPersistenceType: string;
  newPrice?: number;
  newSize?: number;
};

export type ExchangeBettingState = BetEngineState;
