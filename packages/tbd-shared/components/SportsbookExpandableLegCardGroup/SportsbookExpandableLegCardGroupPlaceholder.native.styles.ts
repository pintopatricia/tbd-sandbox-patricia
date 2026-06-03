import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    borderRadius: spacings["spacing-1"],
    height: 135,
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
