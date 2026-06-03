import { FunctionComponent } from "react";
import { View } from "react-native";

import { Divider } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import {
  MARKET_BET_SELECTION_CARD_GROUP,
  MARKET_BET_SELECTION_CARD_GROUP_CONTAINER,
  MARKET_BET_SELECTION_CARD_GROUP_ITEM,
} from "./MarketBetSelectionCardGroup.native.selectors";
import Card from "../Card/Card.native";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import styles from "./MarketBetSelectionCardGroup.native.styles";

const MarketBetSelectionCardGroup: FunctionComponent<ComponentProps> = ({ items, visible }) => {
  const lastItemIndex = items.length - 1;

  return (
    <View {...getTestProps(MARKET_BET_SELECTION_CARD_GROUP, false)}>
      <View {...getTestProps(MARKET_BET_SELECTION_CARD_GROUP_CONTAINER, false)}>
        {items?.map(({ urn: itemURN, typename }, index) => (
          <View
            key={`marketBetSelectionCardGroupItem-${itemURN}`}
            style={styles.marketBetSelectionCardGroupItem}
            {...getTestProps(MARKET_BET_SELECTION_CARD_GROUP_ITEM, false)}
          >
            <ConnectedCard key={itemURN} urn={itemURN} component={Card} typename={typename} visible={visible} />
            {lastItemIndex !== index && (
              <View style={styles.divider}>
                <Divider />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
export default MarketBetSelectionCardGroup;
