import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  title: {
    ...typography["typography-h380"],
    marginBottom: spacings["spacing-2"],
    color: colors.NeutralsTextDefault,
  },
  cardContainer: {
    marginTop: spacings["spacing-3"],
  },
  toggleContainer: {
    marginBottom: spacings["spacing-3"],
  },
});
