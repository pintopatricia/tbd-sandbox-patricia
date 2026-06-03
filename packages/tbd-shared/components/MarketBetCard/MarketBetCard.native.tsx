import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";

import { BetSegments, Divider } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { CounterAggregator } from "./snowflakes/CounterAggregator/CounterAggregator.native";
import Cashout from "../Cashout/Cashout.native";
import ConnectedCashout from "../Cashout";
import {
  MARKET_BET_CARD,
  MARKET_BET_CARD_MARKET_LINK,
  MARKET_BET_CARD_LIABILITY_CONTAINER,
} from "./MarketBetCard.native.selectors";
import { ComponentProps } from "./props";
import styles from "./MarketBetCard.native.styles";

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
  dispatchMyBetsBottomSheetOpenPress,
  dispatchSubscribeCardUpdates,
  dispatchUnsubscribeCardUpdates,
  dispatchCancelAllPress,
  aggregatorDescription,
  marketBetCardGroupURN,
  marketId,
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
  useEffect(() => {
    if (!isUnmatched) {
      dispatchSubscribeCardUpdates(urn);
    }

    return () => {
      if (!isUnmatched) {
        dispatchUnsubscribeCardUpdates(urn);
      }
    };
  }, [dispatchSubscribeCardUpdates, dispatchUnsubscribeCardUpdates, urn, isUnmatched]);

  const handleMarketViewPress = useCallback(() => {
    if (exchangeLightMarketViewLink) {
      dispatchMyBetsBottomSheetOpenPress(exchangeLightMarketViewLink.viewUrn, title);
    }
  }, [dispatchMyBetsBottomSheetOpenPress, exchangeLightMarketViewLink, title]);

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
    <View style={styles.divider}>
      <Divider />
    </View>
  );

  return (
    <View key={`market-bet-card-${urn}`} {...getTestProps(MARKET_BET_CARD, false)}>
      {exchangeLightMarketViewLink ? (
        <Pressable onPress={() => handleMarketViewPress()} {...getTestProps(MARKET_BET_CARD_MARKET_LINK, false)}>
          {counterTitleAggregatorComponent}
        </Pressable>
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
        <>
          <View style={styles.liabilityContainer}>
            <View style={styles.liability} {...getTestProps(MARKET_BET_CARD_LIABILITY_CONTAINER, false)}>
              <BetSegments leftValue={liability} leftLabel={liabilityLabel} />
            </View>
            {!!cashoutQuotesURNs?.length && (
              <View style={styles.cashout}>
                <ConnectedCashout component={Cashout} cashoutURN={cashoutQuotesURNs[0]} />
              </View>
            )}
          </View>
          {dividerComponent}
        </>
      )}
    </View>
  );
};

export default MarketBetCard;
