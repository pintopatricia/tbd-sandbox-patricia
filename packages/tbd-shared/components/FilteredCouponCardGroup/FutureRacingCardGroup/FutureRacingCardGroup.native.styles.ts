import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    ...typography["typography-h380"],
    marginBottom: spacings["spacing-3"],

    color: colors.NeutralsTextDefault,
  },
  container: {
    marginHorizontal: spacings["spacing-3"],
    marginBottom: spacings["spacing-4"],
  },
  separator: {
    marginBottom: spacings["spacing-3"],
  },
});
