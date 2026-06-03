import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  virtualRunnerLine: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },

  virtualRunnerInnerContainer: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    overflow: "hidden",
  },

  imageContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-1"],
  },

  image: {
    width: 32,
    height: 25,
    overflow: "visible",
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-1"],
  },

  informationContainer: {
    overflow: "hidden",
  },

  name: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  description: {
    color: colors.NeutralsTextSecondary,
    ...typography["typography-h120"],
  },

  leftColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
    marginRight: spacings["spacing-1"],
  },

  virtualRunnerNumber: {
    color: colors.NeutralsTextDefault,
    textAlign: "center",
    ...typography["typography-h158"],
  },

  horseRacing: {
    width: 25,
    height: 30,
  },
  square: {
    width: 30,
    height: 30,
  },
  football: {
    width: 30,
    height: 38,
  },
});
