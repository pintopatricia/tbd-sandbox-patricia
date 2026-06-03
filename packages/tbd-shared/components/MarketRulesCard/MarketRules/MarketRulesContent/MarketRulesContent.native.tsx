import { useCallback, useState } from "react";
import { MarketRulesCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ActionLink, Text } from "@ppb/the-wall-native";
import { TabsGroupContentProps } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { View } from "react-native";
import { i18n } from "../../../../helpers/i18n";
import { formatFullDateAndTime } from "../../../../helpers/dates";
import { MarketRulesSection } from "../MarketRulesSection/MarketRulesSection.native";
import styles from "./MarketRulesContent.native.styles";
import {
  MARKET_RULES_CONTENT,
  MARKET_BASE_RATE,
  DISCOUNT_ALLOWED,
  EVENT_START_TIME,
  CONTENT,
  FOOTER,
} from "./MarketRulesContent.native.selectors";

function Section({ html }: { html: string }) {
  const [height, setHeight] = useState(0);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    setHeight(Number(event.nativeEvent.data));
  }, []);

  return (
    <WebView
      showsVerticalScrollIndicator={false}
      onMessage={onMessage}
      injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
      style={{ height, backgroundColor: "transparent" }}
      source={{
        html: `<html><meta name="viewport" content="width=device-width, initial-scale=1" /><body>${html}</body></html>`,
      }}
    />
  );
}

export const buildMarketRulesContent = (
  marketRules: MarketRulesCard,
  locale: string,
  timezone: string,
  discountRateUrl: string,
  onDiscountRateLinkClick: (text: string, href: string) => void,
): TabsGroupContentProps[] => [
  {
    id: "exchange",
    content: marketRules && (
      <View {...getTestProps(MARKET_RULES_CONTENT, false)} style={styles.content}>
        <Text style={styles.title}>
          {i18n({
            key: "I18N.MARKET_RULES.TITLE",
            interpolationValues: { marketName: marketRules.marketName },
          })}
        </Text>
        <MarketRulesSection name={i18n({ key: "I18N.MARKET_RULES.COMMISSION" })}>
          <Text {...getTestProps(MARKET_BASE_RATE)} style={styles.text}>{`${marketRules.marketBaseRate}% ${i18n({
            key: "I18N.MARKET_RULES.DISCOUNT_RATE",
          })}`}</Text>
          {marketRules.discountAllowed && (
            <Text {...getTestProps(DISCOUNT_ALLOWED)} style={styles.text}>
              {i18n({ key: "I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT" })}
            </Text>
          )}
          <ActionLink
            text={i18n({
              key: "I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED",
            })}
            onClick={() =>
              onDiscountRateLinkClick(
                i18n({
                  key: "I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED",
                }),
                discountRateUrl,
              )
            }
            noPadding
          />
        </MarketRulesSection>
        {marketRules.eventStartTime && (
          <MarketRulesSection name={i18n({ key: "I18N.MARKET_RULES.EVENT_START_TIME" })}>
            <Text {...getTestProps(EVENT_START_TIME)} style={styles.text}>
              {formatFullDateAndTime(new Date(marketRules.eventStartTime), locale, timezone)}
            </Text>
          </MarketRulesSection>
        )}
        {marketRules.sections?.map((section, index) => (
          <MarketRulesSection key={index} name={section.name}>
            <View {...getTestProps(CONTENT)}>
              <Section html={section.content} />
            </View>
          </MarketRulesSection>
        ))}
        {marketRules.footer && (
          <View {...getTestProps(FOOTER)}>
            <Section html={marketRules.footer} />
          </View>
        )}
      </View>
    ),
  },
];
