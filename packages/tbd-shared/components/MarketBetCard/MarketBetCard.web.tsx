import { lazy, FunctionComponent, Suspense, useCallback, useEffect, useMemo } from "react";
import { BetSegments, Divider, Link, useOnIntersect } from "@ppb/the-wall-web";
import { LinkOnClick } from "@ppb/the-wall-common/types/web";
import { ComponentProps } from "./props";
import styles from "./MarketBetCard.web.css";
import { CounterAggregator } from "./snowflakes/CounterAggregator/CounterAggregator.web";

const ConnectedCashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout"));
const Cashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout/Cashout.web"));

const MarketBetCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  exchangeLightMarketViewLink,
  cashoutQuotesURNs,
  numOfBets,
  numOfUnmatched,
  isUnmatched,
  isOpen,
  liability,
  liabilityLabel,
  dispatchSubscribeCardUpdates,
  dispatchUnsubscribeCardUpdates,
  dispatchCancelAllPress,
  dispatchMyBetsBottomSheetOpenPress,
  aggregatorDescription,
  marketId,
  marketBetCardGroupURN,
  cancelAllLabel,
  commission,
  commissionLabel,
  profit,
  profitLabel,
  netProfit,
  netProfitRaw,
  netProfitLabel,
  showCancelAll,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUnmatched) {
      if (isIntersecting) {
        dispatchSubscribeCardUpdates(urn);
      } else {
        dispatchUnsubscribeCardUpdates(urn);
      }
    }

    return () => {
      if (!isUnmatched) {
        dispatchUnsubscribeCardUpdates(urn);
      }
    };
  }, [dispatchSubscribeCardUpdates, dispatchUnsubscribeCardUpdates, isIntersecting, urn, isUnmatched]);

  const handleMarketViewPress = useCallback<LinkOnClick>(
    (event) => {
      event.preventDefault();

      if (exchangeLightMarketViewLink) {
        dispatchMyBetsBottomSheetOpenPress(exchangeLightMarketViewLink.viewUrn, title);
      }
    },
    [dispatchMyBetsBottomSheetOpenPress, exchangeLightMarketViewLink, title],
  );

  const handleCancelAllPress = useCallback(() => {
    dispatchCancelAllPress(marketId, title, numOfUnmatched, marketBetCardGroupURN, aggregatorDescription);
  }, [aggregatorDescription, dispatchCancelAllPress, marketBetCardGroupURN, marketId, title, numOfUnmatched]);

  const counterTitleAggregatorComponent = useMemo(() => {
    if (showCancelAll) {
      return (
        <CounterAggregator
          count={numOfBets}
          title={title}
          buttonText={cancelAllLabel}
          onButtonTap={handleCancelAllPress}
        />
      );
    }
    return <CounterAggregator count={numOfBets} title={title} />;
  }, [showCancelAll, numOfBets, title, cancelAllLabel, handleCancelAllPress]);

  const dividerComponent = (
    <div className={styles.divider}>
      <Divider />
    </div>
  );

  return (
    <div className={styles.marketBetCardContainer} key={`market-bet-card-${urn}`} ref={ref}>
      {exchangeLightMarketViewLink ? (
        <Link item={{ isTextLink: false }} onClick={handleMarketViewPress}>
          {counterTitleAggregatorComponent}
        </Link>
      ) : (
        counterTitleAggregatorComponent
      )}

      {dividerComponent}

      {!isOpen && (
        <>
          <BetSegments
            leftValue={profit}
            leftLabel={profitLabel}
            midValue={commission}
            midLabel={commissionLabel}
            rightValue={netProfit}
            rightRawValue={netProfitRaw}
            rightLabel={netProfitLabel}
          />
          {dividerComponent}
        </>
      )}

      {isOpen && !isUnmatched && (
        <Suspense fallback={<></>}>
          <div className={styles.liabilityContainer}>
            <BetSegments leftValue={liability} leftLabel={liabilityLabel} />
            {!!cashoutQuotesURNs?.length && <ConnectedCashout component={Cashout} cashoutURN={cashoutQuotesURNs[0]} />}
          </div>
          {dividerComponent}
        </Suspense>
      )}
    </div>
  );
};

export default MarketBetCard;
