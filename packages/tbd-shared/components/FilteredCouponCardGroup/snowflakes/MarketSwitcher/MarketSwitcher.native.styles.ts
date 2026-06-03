import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketSwitcher: {
    alignItems: "flex-start",
    gap: tokens.MarketSwitcherVerticalGap.gap,
    ...tokens.MarketSwitcherBorderRadius,
    ...tokens.MarketSwitcherPadding,
  },
  title: {
    color: tokens.MarketSwitcherLabelColour,
    ...tokens.MarketSwitcherLabelTypography,
  },
  labelContainer: {
    flexDirection: "row",
    gap: tokens.MarketSwitcherHorizontalGap.gap,
    alignSelf: "stretch",
  },
  label: {
    color: tokens.MarketSwitcherTitleColour,
    ...tokens.MarketSwitcherTitleTypography,
  },
  icon: {
    flexShrink: 0,
    width: tokens.MarketSwitcherIconSizing,
    height: tokens.MarketSwitcherIconSizing,
  },
});
