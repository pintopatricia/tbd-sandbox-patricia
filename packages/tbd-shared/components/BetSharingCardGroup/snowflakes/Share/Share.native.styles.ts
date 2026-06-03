import { StyleSheet } from "react-native";
import { tokens, spacings, typography, stackings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    gap: spacings["spacing-2"],
  },
  description: {
    ...typography["typography-h156"],
    color: tokens.NeutralsTextDefault,
  },
  screenshotFrame: {
    flex: 1,
    paddingHorizontal: spacings["spacing-5"],
    position: "relative",
  },
  screenshotOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: stackings["overlay-stack"],
  },
  buttonsContainer: {
    gap: spacings["spacing-2"],
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
});
