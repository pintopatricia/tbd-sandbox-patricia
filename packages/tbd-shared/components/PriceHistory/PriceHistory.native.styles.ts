import { StyleSheet } from "react-native";
import { colors, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  priceHistory: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
    textAlign: "right",
    width: 100,
    minHeight: 55,
  },
});
