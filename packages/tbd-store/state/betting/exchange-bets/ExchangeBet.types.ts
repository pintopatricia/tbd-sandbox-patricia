import URN from "../../layout/URN";

export type ExchangeSide = "BACK" | "LAY";

type Result = "WON" | "PLACED" | "LOST";

export type ExchangeBet = {
  urn: URN;
  runnerDesc: string;
  price: number;
  size: number;
  profit: number;
  side: ExchangeSide;
  betPhase: string;
  orderStatus: string;
  isSettled: boolean;
  isMatched: boolean;
  isUnmatched: boolean;
  isCashout?: boolean;
  betId?: string;
  runner?: string;
  marketUrn?: string;
  result?: Result;
};

export type ExchangeBets = {
  [urn: string]: ExchangeBet;
};
