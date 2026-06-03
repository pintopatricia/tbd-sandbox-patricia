import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: 88,
    height: 68,
    padding: spacings["spacing-2"],
    backgroundColor: tokens.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-1"],
  },
});
