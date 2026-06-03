import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

const pageBackground = tokens.PageBackgroundColour;

export default StyleSheet.create({
  cbbFloatingButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cbbFloatingButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage: `linear-gradient(0deg, ${pageBackground} 0%, ${pageBackground}E6 49.96%, ${pageBackground}00 100%)`,
  },
});
