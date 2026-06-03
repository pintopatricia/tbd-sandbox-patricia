import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  borderRadius: tokens.BetSelectionsBorderRadius,
  header: {
    ...tokens.BetSelectionsHeaderHorizontalGap,
    ...tokens.BetSelectionsHeaderPadding,
    ...tokens.BetSelectionsHeaderDropShadow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.BetSelectionsHeaderBackgroundColour,
  },
  title: {
    ...tokens.BetSelectionsHeaderLabelTypography,
    flex: 1,
    color: tokens.BetSelectionsHeaderLabelColour,
  },
  selections: {
    ...tokens.BetSelectionsBottomContentVerticalGap,
    ...tokens.BetSelectionsBottomContentPadding,
    backgroundColor: tokens.BetSelectionsBackgroundColour,
  },
  chevron: {
    width: tokens.BetSelectionsHeaderChevronIconSizing,
    height: tokens.BetSelectionsHeaderChevronIconSizing,
    color: tokens.BetSelectionsHeaderChevronIconColour,
  },
});
