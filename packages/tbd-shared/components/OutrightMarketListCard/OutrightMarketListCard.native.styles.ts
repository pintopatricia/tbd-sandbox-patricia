import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { SPACINGS } from "@ppb/the-wall-common/base-theme-tokens";

export default StyleSheet.create({
  container: {
    marginHorizontal: spacings["spacing-3"],
  },
  item: {
    gap: spacings["spacing-2"],
    marginHorizontal: spacings["spacing-2"],
    marginBottom: spacings["spacing-2"],
  },

  title: {
    ...typography["typography-h092"],
    textAlign: "left",
    color: colors.NeutralsTextSecondary,
  },
  showMore: {
    marginBottom: SPACINGS["spacing-2"],
    marginHorizontal: SPACINGS["spacing-2"],
  },
});
