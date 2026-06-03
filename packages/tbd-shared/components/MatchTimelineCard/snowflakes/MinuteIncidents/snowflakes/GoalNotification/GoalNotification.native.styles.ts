import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  goalNotification: {
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
  goal: {
    backgroundColor: colors.SignpostingIndicatorsRichContentIconWarning,
  },
  ownGoal: {
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
  goalAway: {
    alignItems: "flex-start",
  },
  goalHome: {
    alignItems: "flex-end",
  },
  textAway: {
    textAlign: "left",
  },
  textHome: {
    textAlign: "right",
  },
  textGoalTitle: {
    color: colors.AgnosticNeutralsTextDefault,
  },
  textGoalDescription: {
    color: colors.AgnosticNeutralsTextDefault,
  },
  textOwnGoal: {
    color: colors.NeutralsTextDefault,
  },
  title: {
    ...typography["typography-h180"],
  },
  description: {
    ...typography["typography-h120"],
  },
  iconContainer: {
    position: "absolute",
    width: 56,
    height: 56,
  },
  iconAway: {
    right: -12,
    bottom: -12,
  },
  iconHome: {
    bottom: -12,
    left: -12,
  },
});
