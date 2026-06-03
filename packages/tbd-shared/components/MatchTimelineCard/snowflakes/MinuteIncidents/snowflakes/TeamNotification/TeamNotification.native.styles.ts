import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
  away: {
    textAlign: "left",
  },
  home: {
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
});
