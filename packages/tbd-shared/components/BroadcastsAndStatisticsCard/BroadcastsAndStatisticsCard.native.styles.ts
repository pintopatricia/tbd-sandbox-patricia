import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: spacings["spacing-3"],
  },
  supportingContentContainer: {
    flexDirection: "row",
  },
  liveStreamContainer: {
    paddingTop: spacings["spacing-1"],
  },
  gap: {
    width: spacings["spacing-1"],
  },
});
