import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    height: 135,
    borderRadius: spacings["spacing-2"],
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
