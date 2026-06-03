import { FunctionComponent, MouseEvent, useMemo } from "react";
import { TabsGroup } from "@ppb/the-wall-web";
import { MarketRulesCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import styles from "./MarketRules.web.css";
import { buildMarketRulesContent } from "./MarketRulesContent/MarketRulesContent.web";
import { i18n } from "../../../helpers/i18n";

export type MarketRulesViewModal = {
  onDiscountRateLinkClick: (event: MouseEvent) => void;
};

export type MarketRulesProps = {
  marketRules?: MarketRulesCard;
  locale: string;
  timezone: string;
  discountRateUrl: string;
};

const noop = (): void => {};

const MarketRules: FunctionComponent<MarketRulesProps & MarketRulesViewModal> = ({
  marketRules,
  locale,
  timezone,
  discountRateUrl,
  onDiscountRateLinkClick,
}) => {
  const rulesHeaders = [
    {
      id: "exchange",
      title: i18n({ key: "I18N.EXCHANGE" }),
    },
  ];

  const rulesContent = useMemo(
    () =>
      marketRules && buildMarketRulesContent(marketRules, locale, timezone, discountRateUrl, onDiscountRateLinkClick),
    [discountRateUrl, locale, marketRules, onDiscountRateLinkClick, timezone],
  );

  return (
    <>
      {rulesContent && (
        <div className={styles.content}>
          <TabsGroup
            headers={rulesHeaders}
            contents={rulesContent}
            defaultTab="exchange"
            label="Market Rules Tabs"
            background={false}
            onTabSwitch={noop}
          />
        </div>
      )}
    </>
  );
};

export default MarketRules;
