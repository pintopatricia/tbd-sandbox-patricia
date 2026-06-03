import { useCallback, useEffect, memo, FunctionComponent, useMemo, useId } from "react";
import { View } from "react-native";
import { SportsbookBetButton } from "@ppb/the-wall-native";
import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { TEST_ID } from "./BettingOpportunityBetButton.native.selectors";
import styles from "./BettingOpportunityBetButton.native.styles";

type MemoizedProps = ComponentProps & {
  onClick: () => void;
};

const MemoizedBettingOpportunityBetButton: FunctionComponent<MemoizedProps> = memo(
  ({
    label,
    secondaryLabel,
    isMultipleOnBetslip,
    odds,
    isOddsboost,
    onClick,
    animated,
    accessibilityLabel,
    accessibilityHints,
  }) => {
    const status = useMemo(
      (): SportsbookBetButtonStatus => (isMultipleOnBetslip ? "selected" : "default"),
      [isMultipleOnBetslip],
    );

    return (
      <View {...getTestProps(TEST_ID, false)} style={styles.container}>
        <SportsbookBetButton
          onClick={onClick}
          label={label}
          secondaryLabel={secondaryLabel}
          struckThrough={isOddsboost}
          oddsboost={isOddsboost}
          status={status}
          disabled={!odds}
          animated={animated}
          accessibilityHints={accessibilityHints}
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    );
  },
);
MemoizedBettingOpportunityBetButton.displayName = "MemoizedBettingOpportunityBetButton";

const BettingOpportunityBetButton: FunctionComponent<ComponentProps> = (props) => {
  const {
    bettingOpportunityUrn,
    bettingOpportunityId,
    bettingOpportunityType,
    odds,
    cardUrn,
    popularSelections,
    marketsIds,
    visible,
    dispatchAddRemoveSelections,
    dispatchSubscribeBettingOpportunityPrice,
    dispatchUnsubscribeBettingOpportunityPrice,
    dispatchSubscribeMarketsUpdates,
    dispatchUnsubscribeMarketsUpdates,
  } = props;

  const onClick = useCallback(() => {
    dispatchAddRemoveSelections(popularSelections, cardUrn, odds, bettingOpportunityId, bettingOpportunityType);
  }, [dispatchAddRemoveSelections, popularSelections, cardUrn, odds, bettingOpportunityId, bettingOpportunityType]);

  useEffect(() => {
    if (bettingOpportunityUrn) {
      if (visible) {
        dispatchSubscribeBettingOpportunityPrice(bettingOpportunityUrn);
      } else {
        dispatchUnsubscribeBettingOpportunityPrice(bettingOpportunityUrn);
      }

      return () => {
        dispatchUnsubscribeBettingOpportunityPrice(bettingOpportunityUrn);
      };
    }
    return () => {};
  }, [
    bettingOpportunityUrn,
    dispatchSubscribeBettingOpportunityPrice,
    dispatchUnsubscribeBettingOpportunityPrice,
    visible,
  ]);

  const id = useId();

  useEffect(() => {
    const callbackMarketUpdates = visible ? dispatchSubscribeMarketsUpdates : dispatchUnsubscribeMarketsUpdates;
    marketsIds.forEach((marketId) => {
      callbackMarketUpdates(marketId, id);
    });
  }, [dispatchSubscribeMarketsUpdates, dispatchUnsubscribeMarketsUpdates, marketsIds, visible]);

  return <MemoizedBettingOpportunityBetButton onClick={onClick} {...props} />;
};

export default BettingOpportunityBetButton;
