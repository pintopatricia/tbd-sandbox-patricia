import { FunctionComponent, useCallback, useEffect, useId, useMemo } from "react";
import { SportsbookBetButton, useOnIntersect } from "@ppb/the-wall-web";
import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import styles from "./BettingOpportunityBetButton.web.css";

const BettingOpportunityBetButton: FunctionComponent<ComponentProps> = ({
  bettingOpportunityUrn,
  bettingOpportunityId,
  bettingOpportunityType,
  secondaryLabel,
  label,
  isMultipleOnBetslip,
  odds,
  cardUrn,
  popularSelections,
  marketsIds,
  isOddsboost,
  animated,
  dispatchAddRemoveSelections,
  dispatchSubscribeBettingOpportunityPrice,
  dispatchUnsubscribeBettingOpportunityPrice,
  dispatchSubscribeMarketsUpdates,
  dispatchUnsubscribeMarketsUpdates,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);

  const onClick = useCallback(() => {
    dispatchAddRemoveSelections(popularSelections, cardUrn, odds, bettingOpportunityId, bettingOpportunityType);
  }, [popularSelections, dispatchAddRemoveSelections, cardUrn, odds, bettingOpportunityId, bettingOpportunityType]);

  useEffect(() => {
    const callbackBettingOportunityPrices = isIntersecting
      ? dispatchSubscribeBettingOpportunityPrice
      : dispatchUnsubscribeBettingOpportunityPrice;

    callbackBettingOportunityPrices(bettingOpportunityUrn);
  }, [
    bettingOpportunityUrn,
    dispatchSubscribeBettingOpportunityPrice,
    dispatchUnsubscribeBettingOpportunityPrice,
    isIntersecting,
  ]);

  const id = useId();
  useEffect(() => {
    const callbackMarketUpdates = isIntersecting ? dispatchSubscribeMarketsUpdates : dispatchUnsubscribeMarketsUpdates;
    marketsIds.forEach((marketId) => {
      callbackMarketUpdates(marketId, id);
    });
  }, [dispatchSubscribeMarketsUpdates, dispatchUnsubscribeMarketsUpdates, isIntersecting, marketsIds]);

  const status = useMemo(
    (): SportsbookBetButtonStatus => (isMultipleOnBetslip ? "selected" : "default"),
    [isMultipleOnBetslip],
  );

  return (
    <div ref={ref} className={styles.betButtonContainer}>
      <SportsbookBetButton
        onClick={onClick}
        label={label}
        secondaryLabel={secondaryLabel}
        struckThrough={isOddsboost}
        oddsboost={isOddsboost}
        status={status}
        disabled={!odds}
        animated={animated}
      />
    </div>
  );
};

export default BettingOpportunityBetButton;
