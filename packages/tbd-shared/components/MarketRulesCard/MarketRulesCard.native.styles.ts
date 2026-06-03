import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    padding: spacings["spacing-3"],
    marginHorizontal: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: 4,
  },
  buttonText: {
    color: colors.NeutralsTextDefault,
    flex: 1,
    ...typography["typography-h152"],
  },
});
