import { FunctionComponent, useMemo } from "react";
import { MarketRulesCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ScrollView, View } from "react-native";
import { TabsGroup } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { buildMarketRulesContent } from "./MarketRulesContent/MarketRulesContent.native";
import styles from "./MarketRules.native.styles";
import { MARKET_RULES } from "./MarketRules.native.selectors";
import { i18n } from "../../../helpers/i18n";

export type MarketRulesViewModal = {
  onDiscountRateLinkPress: (text: string, href: string) => void;
};

export type MarketRulesProps = {
  marketRules?: MarketRulesCard;
  locale: string;
  timezone: string;
  discountRateUrl: string;
};

const noop = (): void => {};

export const MarketRules: FunctionComponent<MarketRulesProps & MarketRulesViewModal> = ({
  marketRules,
  locale,
  timezone,
  discountRateUrl,
  onDiscountRateLinkPress,
}) => {
  const rulesHeaders = [
    {
      id: "exchange",
      title: i18n({ key: "I18N.EXCHANGE" }),
    },
  ];

  const rulesContent = useMemo(
    () =>
      marketRules && buildMarketRulesContent(marketRules, locale, timezone, discountRateUrl, onDiscountRateLinkPress),
    [discountRateUrl, locale, marketRules, onDiscountRateLinkPress, timezone],
  );

  return (
    <View {...getTestProps(MARKET_RULES, false)} style={styles.marketRulesContainer}>
      {rulesContent && (
        <ScrollView style={styles.content}>
          <TabsGroup
            headers={rulesHeaders}
            contents={rulesContent}
            defaultTab="exchange"
            label="Market Rules Tabs"
            background={false}
            onTabSwitch={noop}
            shouldShowIndicator
          />
        </ScrollView>
      )}
    </View>
  );
};
