import { StyleSheet } from "react-native";
import { colors, typography, spacings, heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardNotification: {
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-1"],
  },
  cardAway: {
    alignItems: "flex-start",
  },
  cardHome: {
    alignItems: "flex-end",
  },
  textAway: {
    textAlign: "left",
  },
  textHome: {
    textAlign: "right",
  },
  title: {
    ...typography["typography-h180"],
    color: colors.NeutralsTextDefault,
  },
  description: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
  },
  iconContainer: {
    width: heights["icon-size-small"],
    height: heights["icon-size-small"],
    marginBottom: spacings["spacing-1"],
  },
});
