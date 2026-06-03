import { StyleSheet } from "react-native";
import { colors, spacings, heights, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingVertical: spacings["spacing-4"],
    paddingHorizontal: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: spacings["spacing-1"],
  },
  icon: {
    height: heights["icon-size"],
    width: heights["icon-size"],
  },
  label: {
    ...typography["typography-h580"],
    color: colors.NeutralsTextDefault,
    flexGrow: 1,
    marginBottom: spacings["spacing-6"],
  },
  buttonText: {
    ...typography["typography-h320"],
    color: colors.ActionTertiaryTextDefault,
  },
});
