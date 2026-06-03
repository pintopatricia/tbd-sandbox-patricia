import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  contextualStatsComparisonContainer: {
    flexDirection: "row",
    paddingVertical: tokens.HalfTimePulseStatContainerSpacingVerticalPadding.padding,
    paddingHorizontal: tokens.HalfTimePulseStatContainerSpacingHorizontalPadding.padding,
    ...tokens.HalfTimePulseStatContainerBorderRadius,
    ...tokens.HalfTimePulseStatContainerSpacingGap,
    backgroundColor: tokens.HalfTimePulseStatContainerBackgroundColour,
  },
  text: {
    ...tokens.HalfTimePulseStatTextTypography,
    color: tokens.HalfTimePulseStatTextColour,
  },
  contextualTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.HalfTimePulseStatsHorizontalGap,
  },
  iconContainer: {
    minWidth: tokens.HalfTimePulseStatCardIconSizing,
    height: tokens.HalfTimePulseStatCardIconSizing,
  },
});
