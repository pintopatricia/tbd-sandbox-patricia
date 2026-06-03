import { StyleSheet } from "react-native";
import { colors, typography, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  content: { ...typography["typography-h156"], color: colors.NeutralsTextDefault },
  spacing: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.SmSpacingSmall,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
