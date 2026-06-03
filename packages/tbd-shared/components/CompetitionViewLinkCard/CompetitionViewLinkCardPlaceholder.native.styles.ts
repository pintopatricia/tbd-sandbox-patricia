import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: 88,
    height: 68,
    padding: spacings["spacing-2"],
  },

  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
