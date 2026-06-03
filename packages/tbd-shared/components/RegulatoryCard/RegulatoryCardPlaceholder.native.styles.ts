import { StyleSheet } from "react-native";
import { spacings, colors } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    minHeight: 400,
    width: "100%",
    borderRadius: spacings["spacing-1"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
