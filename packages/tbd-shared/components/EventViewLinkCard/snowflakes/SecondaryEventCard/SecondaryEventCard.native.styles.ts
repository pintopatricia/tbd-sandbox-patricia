import { StyleSheet } from "react-native";
import { colors, spacings, heights, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  secondaryEventCard: {
    flexDirection: "column",
    minHeight: heights["scrollable-swimlane-min-height"],
    padding: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: 4,
  },

  startTimeContainer: {
    paddingTop: spacings["spacing-3"],
    flexDirection: "row",
  },

  runnerNameAway: {
    paddingTop: spacings["spacing-1"],
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  runnerNameHome: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  startTime: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  date: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  inplay: {
    color: colors.SignpostingInplayTextDefault,
    ...typography["typography-h152"],
  },
});
