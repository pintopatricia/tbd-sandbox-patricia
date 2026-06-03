import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  detailed: {
    gap: tokens.DetailedSummaryHorizontalGapPrimary.gap,
  },
  group: {
    gap: tokens.DetailedSummaryHorizontalGapSecondary.gap,
  },
  groupTitle: {
    color: tokens.DetailedSummaryTextTitleColour,
    ...tokens.DetailedSummaryTitleTypography,
  },
  item: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    gap: tokens.DetailedSummaryHorizontalGapSecondary.gap,
  },
  itemTitle: {
    flex: 1,
    color: tokens.DetailedSummaryTextContentTextColour,
    ...tokens.DetailedSummaryContentTextTypography,
  },
  itemAmount: {
    color: tokens.DetailedSummaryTextContentTextHighlightedColour,
    ...tokens.DetailedSummaryContentTextHighlightedTypography,
  },
});
