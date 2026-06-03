import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  card: {
    minWidth: 155,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
  title: {
    ...typography["typography-h180"],
    color: colors.SignpostingInplayTextDefault,
    textAlign: "center",
  },
  description: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextDefault,
    textAlign: "center",
  },
});
