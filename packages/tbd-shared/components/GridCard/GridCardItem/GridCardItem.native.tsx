import { memo, useEffect, useId } from "react";
import * as React from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";
import styles from "./GridCardItem.native.styles";
import { GRID_CARD_ITEM } from "./GridCardItem.native.selectors";

const GridCardItem: React.FC<ComponentProps> = memo(({ cardUrn, marketUrn, runnerUrn }) => (
  <View {...getTestProps(GRID_CARD_ITEM, false)} style={styles.gridCardItem}>
    <ConnectedSportsbookBetButton
      runnerUrn={runnerUrn}
      marketUrn={marketUrn}
      component={SportsbookBetButton}
      displayPreviousOdd={false}
      cardUrn={cardUrn}
      rounded={false}
      tall
    />
  </View>
));

GridCardItem.displayName = "GridCardItem";

const ConnectedCard: React.FC<ComponentProps> = (props) => {
  const { marketId, visible } = props;
  const { dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe } = props;
  const id = useId();
  useEffect(() => {
    if (marketId) {
      if (visible) {
        dispatchSportsbookMarketUpdatesSubscribe(marketId, id);
      } else {
        dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
      }

      return () => {
        dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
      };
    }
    return () => {};
  }, [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, marketId, visible]);

  return <GridCardItem {...props} />;
};

export default ConnectedCard;
