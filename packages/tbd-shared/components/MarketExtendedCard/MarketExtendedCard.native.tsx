import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";
import { ComponentProps } from "./props";
import { MARKET_EXTENDED, MARKET_EXTENDED_CARD } from "./MarketExtendedCard.native.selectors";
import styles from "./MarketExtendedCard.native.styles";

const MarketExtendedCard: FunctionComponent<ComponentProps> = ({
  title,
  displayRunners,
  cardUrn,
  runnerViewLinks,
  eventViewLink,
  numberOfItemsToDisplay,
  marketPromo,
  visible,
}) => (
  <View {...getTestProps(MARKET_EXTENDED, false)} style={styles.marketContainer}>
    <View {...getTestProps(MARKET_EXTENDED_CARD, false)} style={styles.marketCard}>
      <ConnectedMarket
        cardUrn={cardUrn}
        displayRunners={displayRunners}
        runnerViewLinks={runnerViewLinks}
        component={Market}
        eventViewLink={eventViewLink}
        template={MarketTemplate.Default}
        numberOfItemsToDisplay={numberOfItemsToDisplay}
        marketPromo={marketPromo}
        title={title}
        visible={visible}
      />
    </View>
  </View>
);

export default MarketExtendedCard;
