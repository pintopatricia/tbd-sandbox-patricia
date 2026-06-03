import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";
import styles from "./BetCardGroup.native.styles";
import { ComponentProps } from "./props";
import { BET_CARD_GROUP, BET_CARD_GROUP_ITEM } from "./BetCardGroup.native.selectors";

const FIXTURE_CARDS_TYPES = ["FixtureCard", "EventHeaderCard"];

const BetCardGroup: FunctionComponent<ComponentProps> = ({ items }) => (
  <View style={styles.betCardGroup} {...getTestProps(BET_CARD_GROUP, false)}>
    {items?.map(({ urn, typename }, index) => {
      const fixtureCardStyle = FIXTURE_CARDS_TYPES.includes(typename) ? styles.fixtureCardGroupItem : undefined;
      const cardGroupItemStyle = typename === "MarketBetCardGroup" ? styles.marketBetCardGroupItem : fixtureCardStyle;
      const cardItemStyle = [cardGroupItemStyle, index === items.length - 1 && styles.lastCardItem];

      return (
        <View key={urn} style={cardItemStyle} {...getTestProps(BET_CARD_GROUP_ITEM, false)}>
          {/* 
           Using a different fixture component to avoid layouts shifting in all 
           views/screens with fixtures (native) as well as drop all unnecessary 
           data fetching for My Bets.
          */}
          {typename === "FixtureCard" ? (
            <ConnectedFixtureCard
              urn={urn}
              component={MyBetsFixtureCard}
              placeholder={FixtureCardPlaceholder}
              iconsList={undefined}
            />
          ) : (
            <ConnectedCardGroup key={urn} urn={urn} component={CardGroup} typename={typename} />
          )}
        </View>
      );
    })}
  </View>
);
export default BetCardGroup;
