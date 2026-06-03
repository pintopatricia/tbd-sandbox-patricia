import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  bet: {
    flexGrow: 1,
    gap: tokens.BetBuilderSummaryVerticalGap.gap,
    padding: tokens.BetBuilderSummaryPadding.padding,
  },

  description: {
    flexDirection: "column",
  },

  title: {
    color: tokens.BetBuilderSummaryTitleColour,
    ...tokens.BetBuilderSummaryTitleTypography,
  },
});
