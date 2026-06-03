import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketRulesSection: {
    backgroundColor: tokens.MarketRulesSectionBackgroundColour,
    ...tokens.MarketRulesSectionBorderRadius,
    ...tokens.MarketRulesSectionCardPadding,
    ...tokens.MarketRulesSectionCardVerticalGap,
  },
  title: {
    color: tokens.MarketRulesSectionTitleColour,
    ...tokens.MarketRulesSectionTitleTypography,
  },
});
