import { FunctionComponent } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MARKET_BET_CARD_GROUP, MARKET_BET_CARD_GROUP_ITEM } from "./MarketBetCardGroup.native.selectors";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedCardGroup from "../CardGroup";

import { ComponentProps } from "./props";
import styles from "./MarketBetCardGroup.native.styles";

const MarketBetCardGroup: FunctionComponent<ComponentProps> = ({ items, visible }) => (
  <View style={styles.marketBetCardGroup} {...getTestProps(MARKET_BET_CARD_GROUP, false)}>
    {items?.map(({ urn, typename }) => (
      <View key={urn} {...getTestProps(MARKET_BET_CARD_GROUP_ITEM, false)}>
        <ConnectedCardGroup key={urn} urn={urn} component={CardGroup} typename={typename} visible={visible} />
      </View>
    ))}
  </View>
);
export default MarketBetCardGroup;
