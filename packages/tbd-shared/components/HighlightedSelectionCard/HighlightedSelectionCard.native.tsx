import { FunctionComponent, memo, useEffect, useId } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { HighlightedSelectionCard as HighlightedSelection } from "./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native";
import styles from "./HighlightedSelectionCard.native.styles";
import { HIGHLIGHTED_SELECTION_CARD_CONTAINER } from "./HighlightedSelectionCard.native.selectors";
import { ComponentProps } from "./props";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";

const MemoizedHighlightedSelectionCard: FunctionComponent<ComponentProps> = memo(
  ({ isMarketClosed, runnerUrn, marketUrn, betButtondisplayPreviousOdd, title, urn }) => (
    <View style={styles.cardContainer} {...getTestProps(HIGHLIGHTED_SELECTION_CARD_CONTAINER, false)}>
      <HighlightedSelection text={title} isMarketClosed={isMarketClosed}>
        <ConnectedSportsbookBetButton
          runnerUrn={runnerUrn}
          marketUrn={marketUrn}
          component={SportsbookBetButton}
          displayPreviousOdd={betButtondisplayPreviousOdd}
          cardUrn={urn}
        />
      </HighlightedSelection>
    </View>
  ),
);

MemoizedHighlightedSelectionCard.displayName = "MemoizedHighlightedSelectionCard";

const HighlightedSelectionCard: FunctionComponent<ComponentProps> = (props) => {
  const { marketId, visible } = props;
  const { dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe } = props;
  const id = useId();
  useEffect(() => {
    if (marketId) {
      dispatchMarketUpdatesSubscribe(marketId, id, visible);

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId, id);
      };
    }
    return () => {};
  }, [marketId, visible, dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, id]);

  return <MemoizedHighlightedSelectionCard {...props} />;
};

export default HighlightedSelectionCard;
