import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  icon: {
    width: tokens.GenericSwitcherCardIconSizing,
    height: tokens.GenericSwitcherCardIconSizing,
    ...tokens.GenericSwitcherCardIconBorderRadius,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.SmSpacingXSmall,
  },
  selectorWrapper: {
    flex: 1,
  },
  date: {
    ...tokens.GenericSwitcherCardSupportingTextTypography,
    color: tokens.GenericSwitcherCardTextSupportingTextColour,
  },
  switcher: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.SmSpacingXSmall,
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
    paddingVertical: tokens.SmSpacingSmall,
    paddingRight: tokens.SmSpacingXSmall,
    paddingLeft: tokens.SmSpacingSmall,
  },
});
