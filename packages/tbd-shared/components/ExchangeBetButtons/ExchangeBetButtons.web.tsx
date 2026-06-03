import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import type { JSX } from "react";
import { memo, FunctionComponent, useCallback, useEffect } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ExchangeBetButton } from "./snowflakes/ExchangeBetButton/ExchangeBetButton.web";
import { BetButtonSize, BetButtonStatus } from "./snowflakes/BetButton/BetButton.types";
import { ComponentProps } from "./props";

export type ExchangeBetButtonsRenderButtonProps = {
  cardURN: URN;
  marketURN: URN;
  runnerURN: URN;
  marketId: string;
  side: ExchangeSide;
  marketDepth: number;
  displayBestOdds: boolean;
  betBtnSize: BetButtonSize;
  index: number;
  price?: number;
  liquidity?: string;
  isSelected?: boolean;
  disabled?: boolean;
  dispatchBetPlacement: ComponentProps["dispatchBetPlacement"];
  onBetButtonClick?: (isPotentialBet: boolean) => void;
};

const RenderButtonMemo: FunctionComponent<ExchangeBetButtonsRenderButtonProps> = memo(
  ({
    marketURN,
    runnerURN,
    cardURN,
    marketId,
    dispatchBetPlacement,
    betBtnSize,
    displayBestOdds,
    price,
    side,
    isSelected,
    disabled,
    liquidity,
    marketDepth,
    index,
    onBetButtonClick,
  }) => {
    const betPlacement = useCallback(() => {
      const bet = {
        marketURN,
        urn: runnerURN,
        price,
        side,
        isSelected: isSelected || false,
        marketDepth,
      };
      const metadata = {
        cardURN,
        betOriginURL: window.location.href,
        marketId,
      };
      dispatchBetPlacement(bet, metadata);
    }, [cardURN, dispatchBetPlacement, isSelected, marketDepth, marketId, marketURN, price, runnerURN, side]);

    const onBetClick = useCallback(() => {
      if (onBetButtonClick) {
        // !isSelected because when this callback is called, the bet placement has not yet been dispatched
        onBetButtonClick(!isSelected);
      }

      /**
       * We are purposely deferring with a setTimeout the bet placement that will affect the potential bet status (isSelected) in the redux store.
       * This potential bet (isSelected) coming from the store is the same signal for the bet button state and for the betslip inline display.
       * This causes an update to the components at the same time and then React handles it and flushes state updates (https://reactjs.org/docs/faq-state.html#when-is-setstate-asynchronous)
       * which causes the parent to be update before the child which causes the inline betslip's scrollIntoView to be executed before the runner details collapse.
       * As the collapse happens after the inline betslip scroll, it causes the final scroll state to not be the desired one.
       * For this reason we are making defer so that the child reacts to this change of state (local) before the parent
       */
      setTimeout(betPlacement, 0);
    }, [betPlacement, isSelected, onBetButtonClick]);

    useEffect(() => {
      if (onBetButtonClick) {
        onBetButtonClick(!!isSelected);
      }
    }, [isSelected, onBetButtonClick]);

    return (
      <ExchangeBetButton
        price={price ? price.toString() : ""}
        liquidity={liquidity}
        side={side}
        status={isSelected ? BetButtonStatus.Selected : BetButtonStatus.Normal}
        disabled={disabled}
        onClick={onBetClick}
        size={betBtnSize}
        isMarketDepthBase={!displayBestOdds && !!(index === 2 || index === 3)}
      />
    );
  },
);
RenderButtonMemo.displayName = "RenderButtonMemo";

const ExchangeBetButtons: FunctionComponent<ComponentProps> = ({
  cardURN,
  marketURN,
  runnerURN,
  marketId,
  prices,
  displayBestOdds,
  betBtnSize,
  dispatchBetPlacement,
  onBetButtonClick,
}): JSX.Element => (
  <>
    {prices.map((item, index) => (
      <RenderButtonMemo
        key={`${runnerURN}-${item.side}-${index}`}
        marketURN={marketURN}
        runnerURN={runnerURN}
        cardURN={cardURN}
        marketId={marketId}
        dispatchBetPlacement={dispatchBetPlacement}
        betBtnSize={betBtnSize}
        displayBestOdds={displayBestOdds}
        price={item.price}
        side={item.side}
        isSelected={item.isSelected}
        disabled={item.disabled}
        liquidity={item.liquidity}
        marketDepth={item.marketDepth}
        index={index}
        onBetButtonClick={onBetButtonClick}
      />
    ))}
  </>
);

export default ExchangeBetButtons;
