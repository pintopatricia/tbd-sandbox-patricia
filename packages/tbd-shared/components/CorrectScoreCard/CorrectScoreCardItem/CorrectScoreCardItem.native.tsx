import { FunctionComponent, memo, useEffect, useId } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";
import styles from "./CorrectScoreCardItem.native.styles";
import { CORRECT_SCORE_CARD_ITEM } from "./CorrectScoreCardItem.native.selectors";

const MemoizedCorrectScoreCardItem: FunctionComponent<ComponentProps> = memo(({ cardUrn, marketUrn, runnerUrn }) => (
  <View {...getTestProps(CORRECT_SCORE_CARD_ITEM, false)} style={styles.correctScoreCardItem}>
    <ConnectedSportsbookBetButton
      runnerUrn={runnerUrn}
      marketUrn={marketUrn}
      component={SportsbookBetButton}
      displayPreviousOdd={false}
      cardUrn={cardUrn}
      rounded={false}
    />
  </View>
));
MemoizedCorrectScoreCardItem.displayName = "MemoizedCorrectScoreCardItem";

const CorrectScoreCardItem: FunctionComponent<ComponentProps> = (props) => {
  const { visible, marketId } = props;
  const { dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe } = props;
  const id = useId();
  useEffect(() => {
    if (visible) {
      dispatchSportsbookMarketUpdatesSubscribe(marketId, id);
    } else {
      dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
    }
  }, [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, marketId, visible]);

  return <MemoizedCorrectScoreCardItem {...props} />;
};

export default CorrectScoreCardItem;
