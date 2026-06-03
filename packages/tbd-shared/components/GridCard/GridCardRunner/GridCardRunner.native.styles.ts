import { StyleSheet } from "react-native";
import { gutters, heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  gridRunnerLine: {
    marginTop: gutters["gutter-1"],
  },
  gridRunnerLineFirst: {
    marginTop: 0,
  },
  gridHeaderItem: {
    width: heights["bet-button-width"],
    minHeight: heights["bet-button-height"],
    marginLeft: spacings["spacing-1"],
    overflow: "hidden",
    flexShrink: 0,
  },
});
