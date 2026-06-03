import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  enhancedTrackingContainer: {
    flexDirection: "row",
    gap: spacings["spacing-1"],
    width: "75%",
    marginTop: spacings["spacing-2"],
    marginBottom: spacings["spacing-1"],
  },
  enhancedTracking: {
    flex: 1,
    width: "100%",
  },
});
