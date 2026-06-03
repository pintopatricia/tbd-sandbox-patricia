import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  contextualStatsContainer: {
    display: "flex",
    ...tokens.HalfTimePulseStatContainerSpacingHorizontalPadding,
    ...tokens.HalfTimePulseStatContainerSpacingVerticalPadding,
    alignItems: "center",
    flexDirection: "row",
    ...tokens.HalfTimePulseStatContainerSpacingGap,
    ...tokens.HalfTimePulseCardBorderRadius,
    backgroundColor: tokens.HalfTimePulseStatContainerBackgroundColour,
    flex: 1,
  },

  contextualStatsText: {
    flex: 1,
    ...tokens.HalfTimePulseStatTextTypography,
    color: tokens.HalfTimePulseStatTextColour,
  },

  icon: {
    minWidth: tokens.HalfTimePulseStatCardIconSizing,
    height: tokens.HalfTimePulseStatCardIconSizing,
  },
});
