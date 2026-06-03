import { StyleSheet } from "react-native";
import { heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  reUseSelectionsButtonContainer: {
    height: heights["bet-button-height"],
    marginBottom: spacings["spacing-2"],
    overflow: "hidden",
    borderRadius: spacings["spacing-1"],
  },
});
