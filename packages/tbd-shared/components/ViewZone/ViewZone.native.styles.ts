import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  title: {
    ...typography["typography-h380"],
    color: colors.NeutralsTextDefault,
    marginBottom: spacings["spacing-card-top-default"],
    marginLeft: spacings["spacing-3"],
  },
});
