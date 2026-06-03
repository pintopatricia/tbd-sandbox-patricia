import { FunctionComponent, MouseEvent, useCallback } from "react";
import { ComponentProps } from "./props";
import MarketRulesComponent from "./MarketRules/MarketRules.web";

const MarketRules: FunctionComponent<ComponentProps> = ({
  marketRules,
  localeCodeBcp47,
  timezone,
  discountRateUrl,
  dispatchNavigateToDiscountRateExplainedAction,
}) => {
  const handleDiscountRateLinkClick = useCallback(
    (event: MouseEvent) => {
      const { text, href } = event.target as HTMLAnchorElement;
      dispatchNavigateToDiscountRateExplainedAction(text, href);
    },
    [dispatchNavigateToDiscountRateExplainedAction],
  );

  return (
    <MarketRulesComponent
      marketRules={marketRules}
      timezone={timezone}
      locale={localeCodeBcp47}
      discountRateUrl={discountRateUrl}
      onDiscountRateLinkClick={handleDiscountRateLinkClick}
    />
  );
};

export default MarketRules;
