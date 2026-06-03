import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  noContentAvailableContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: spacings["spacing-6"],
    marginBottom: spacings["spacing-10"],
  },

  iconContainer: {
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: spacings["spacing-4"],
    width: 64,
    height: 64,
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 32,
    justifyContent: "center",
  },

  icon: {
    width: 40,
    height: 40,
  },

  firstLabel: {
    color: colors.NeutralsTextSecondary,
    textAlign: "center",
    paddingBottom: spacings["spacing-2"],
    ...typography["typography-h380"],
  },

  secondLabel: {
    color: colors.NeutralsTextSecondary,
    textAlign: "center",
    ...typography["typography-h152"],
  },
});
