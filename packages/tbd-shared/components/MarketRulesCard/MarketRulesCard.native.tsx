import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { MarketRules as MarketRulesComponent } from "./MarketRules/MarketRules.native";
import { MARKET_RULES_CARD } from "./MarketRulesCard.native.selectors";
import { ComponentProps } from "./props";

const MarketRulesCard: FunctionComponent<ComponentProps> = ({
  marketRules,
  localeCodeBcp47,
  timezone,
  discountRateUrl,
  dispatchNavigateToDiscountRateExplainedAction,
}) => {
  const handleDiscountRateLinkPress = useCallback(
    (text: string, href: string) => {
      navigate({
        viewUrn: "ppb:tbd:view:external",
        viewUrl: `http:${href}`,
        viewDisplayMode: DisplayMode.BlankInapp,
      });

      dispatchNavigateToDiscountRateExplainedAction(text, href);
    },
    [dispatchNavigateToDiscountRateExplainedAction],
  );

  return (
    <View {...getTestProps(MARKET_RULES_CARD, false)}>
      <MarketRulesComponent
        marketRules={marketRules}
        locale={localeCodeBcp47}
        timezone={timezone}
        discountRateUrl={discountRateUrl}
        onDiscountRateLinkPress={handleDiscountRateLinkPress}
      />
    </View>
  );
};

export default MarketRulesCard;
