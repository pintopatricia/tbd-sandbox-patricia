import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  sportRibbonPlaceholderContainer: {
    height: 100,
  },

  headerPlaceholder: {
    height: 125, // Mid point between sbg and bf
    paddingVertical: spacings["spacing-3"],
  },

  contentContainer: {
    paddingHorizontal: spacings["spacing-3"],
  },

  swimlaneCardGroupPlaceholder: {
    marginBottom: spacings["spacing-3"],
    height: 200,
  },

  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
