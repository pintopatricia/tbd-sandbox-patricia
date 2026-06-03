import { FunctionComponent } from "react";
import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { BetButtonColor, BetButtonSize, BetButtonStatus, BetButtonType } from "../BetButton/BetButton.types";
import { BetButton } from "../BetButton/BetButton.native";
import type { ExchangeBetButtonViewModel } from "./ExchangeBetButton.types";

const getBackgroundColor = (
  side: ExchangeSide,
  isMarketDepthBase: boolean,
  size: BetButtonSize | undefined,
): BetButtonColor => {
  if (size === BetButtonSize.Small) {
    if (side === "BACK") {
      return isMarketDepthBase ? BetButtonColor.Blue : BetButtonColor.DarkBlue;
    }
    return isMarketDepthBase ? BetButtonColor.Pink : BetButtonColor.DarkPink;
  }

  return side === "BACK" ? BetButtonColor.Blue : BetButtonColor.Pink;
};

export const ExchangeBetButton: FunctionComponent<ExchangeBetButtonViewModel> = ({
  price,
  liquidity,
  side,
  status = BetButtonStatus.Normal,
  disabled = false,
  onClick,
  size = BetButtonSize.Regular,
  isMarketDepthBase = false,
}) => (
  <BetButton
    primaryLabel={price}
    secondaryLabel={liquidity}
    status={status}
    disabled={disabled}
    onClick={onClick}
    bgColor={getBackgroundColor(side, isMarketDepthBase, size)}
    type={BetButtonType.Exc}
  />
);
