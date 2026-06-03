import { MouseEvent } from "react";
import DOMPurify from "dompurify";
import { MarketRulesCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { TabsGroupContentProps } from "@ppb/the-wall-common/types";
import { Link } from "@ppb/the-wall-web";
import { i18n } from "../../../../helpers/i18n";
import { formatFullDateAndTime } from "../../../../helpers/dates";
import { MarketRulesSection } from "../MarketRulesSection/MarketRulesSection.web";
import styles from "./MarketRulesContent.web.css";

export const buildMarketRulesContent = (
  marketRules: MarketRulesCard,
  locale: string,
  timezone: string,
  discountRateUrl: string,
  onDiscountRateLinkClick: (event: MouseEvent) => void,
): TabsGroupContentProps[] => [
  {
    id: "exchange",
    content: marketRules && (
      <div className={styles.container}>
        <h4 className={`${styles.title} typography-h320`}>
          {i18n({
            key: "I18N.MARKET_RULES.TITLE",
            interpolationValues: { marketName: marketRules.marketName },
          })}
        </h4>
        <MarketRulesSection name={i18n({ key: "I18N.MARKET_RULES.COMMISSION" })}>
          <p>{`${marketRules.marketBaseRate}% ${i18n({
            key: "I18N.MARKET_RULES.DISCOUNT_RATE",
          })}`}</p>
          {marketRules.discountAllowed && <p>{`${i18n({ key: "I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT" })}`}</p>}
          <Link
            onClick={onDiscountRateLinkClick}
            item={{
              viewLink: { viewUrl: discountRateUrl },
              isTextLink: true,
            }}
          >
            {i18n({ key: "I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED" })}
          </Link>
        </MarketRulesSection>
        {marketRules.eventStartTime && (
          <MarketRulesSection name={i18n({ key: "I18N.MARKET_RULES.EVENT_START_TIME" })}>
            <p>{formatFullDateAndTime(new Date(marketRules.eventStartTime), locale, timezone)}</p>
          </MarketRulesSection>
        )}
        {marketRules.sections?.map((section, index) => (
          <MarketRulesSection key={index} name={section.name}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }} />
          </MarketRulesSection>
        ))}
        {marketRules.footer && (
          <div
            className={`${styles.footer} typography-h152`}
            dangerouslySetInnerHTML={{ __html: marketRules.footer }}
          />
        )}
      </div>
    ),
  },
];
