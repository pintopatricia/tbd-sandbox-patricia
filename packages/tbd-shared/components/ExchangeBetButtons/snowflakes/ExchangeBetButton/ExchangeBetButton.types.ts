import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";

import type { BetButtonSize, BetButtonStatus } from "../BetButton/BetButton.types";

export type ExchangeBetButtonOnClick = () => void;

export type ExchangeBetButtonProps = {
  liquidity?: string;
  side: ExchangeSide;
  price?: string;
  status?: BetButtonStatus;
  disabled?: boolean;
  size?: BetButtonSize;
  isMarketDepthBase?: boolean;
};

export type ExchangeBetButtonViewModel = {
  onClick?: ExchangeBetButtonOnClick;
} & ExchangeBetButtonProps;
