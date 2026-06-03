import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { MarketRulesSectionProps } from "./MarketRulesSection.types";
import { MARKET_RULES_SECTION, TITLE } from "./MarketRulesSection.native.selectors";
import styles from "./MarketRulesSection.native.styles";

export const MarketRulesSection: FunctionComponent<MarketRulesSectionProps> = ({ name, children }) => (
  <View {...getTestProps(MARKET_RULES_SECTION, false)} style={styles.marketRulesSection}>
    <Text {...getTestProps(TITLE)} style={styles.title}>
      {name}
    </Text>
    {children}
  </View>
);
