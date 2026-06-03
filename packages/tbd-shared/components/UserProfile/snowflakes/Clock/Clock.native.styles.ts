import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  clock: {
    alignSelf: "flex-start",
    padding: spacings["spacing-1"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: spacings["spacing-1"],
  },

  clockText: {
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
  },
});
