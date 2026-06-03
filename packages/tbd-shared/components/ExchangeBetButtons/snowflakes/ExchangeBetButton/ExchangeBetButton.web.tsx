import { FunctionComponent, useEffect, useRef } from "react";
import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { BetButtonColor, BetButtonSize, BetButtonStatus, BetButtonType } from "../BetButton/BetButton.types";
import { BetButton } from "../BetButton/BetButton.web";
import type { ExchangeBetButtonViewModel } from "./ExchangeBetButton.types";
import styles from "./ExchangeBetButton.web.css";

const ANIMATION_DURATION = 700;

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
}) => {
  const animationClass = side === "BACK" ? styles.flashBlueAnimation : styles.flashPinkAnimation;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger animation on price or liquidity change
  useEffect(() => {
    // When already animating, ignore new animation triggers to prevent animation queue build-up
    if (timeoutRef.current || !buttonRef.current) {
      return;
    }

    buttonRef.current.classList.add(animationClass);

    timeoutRef.current = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove(animationClass);
      }
      timeoutRef.current = null;
    }, ANIMATION_DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [price, liquidity, animationClass]);

  return (
    <BetButton
      ref={buttonRef}
      primaryLabel={price}
      secondaryLabel={liquidity}
      status={status}
      disabled={disabled}
      onClick={onClick}
      bgColor={getBackgroundColor(side, isMarketDepthBase, size)}
      type={BetButtonType.Exc}
    />
  );
};
