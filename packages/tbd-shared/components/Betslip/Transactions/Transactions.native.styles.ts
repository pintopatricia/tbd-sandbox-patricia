import { StyleSheet } from "react-native";
import { colors, typography, spacings, stackings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  banner: {
    backgroundColor: colors.NeutralsBackgroundElevation1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: stackings["overlay-stack"],
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  icon: {
    width: 54,
    height: 54,
    marginBottom: spacings["spacing-4"],
  },
  title: {
    marginBottom: spacings["spacing-2"],
    color: colors.NeutralsTextDefault,
    ...typography["typography-h380"],
  },
  subtitle: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },
});
