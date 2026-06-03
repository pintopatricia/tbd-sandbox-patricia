import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";

import { ExchangeMarketRunner } from "../ExchangeMarket/ExchangeMarket.types";

export type InlineExchangeMarketOnBetClick = (bet: {
  marketURN: string;
  urn: string;
  side: ExchangeSide;
  isSelected: boolean;
  marketDepth: number;
  price?: number;
}) => void;

export type InlineExchangeMarketSelections = {
  urn: string;
  side: ExchangeSide;
  marketDepth: number;
  name: string;
  price?: number;
  liquidity?: string;
  isSelected?: boolean;
  key?: string;
};

export type InlineExchangeMarketProps = {
  runners: ExchangeMarketRunner[];
};
