import { StyleSheet } from "react-native";
import { gutters, heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingBottom: spacings["spacing-2"],
    paddingHorizontal: spacings["spacing-2"],
  },
  column: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: spacings["spacing-2"],
  },
  marketHeader: {
    paddingBottom: spacings["spacing-3"],
  },
  correctScoreRunnerLine: {
    marginBottom: gutters["gutter-1"],
  },
  betButtonWrapper: {
    height: heights["bet-button-height"],
    width: heights["bet-button-width"],
    marginLeft: spacings["spacing-2"],
    overflow: "hidden",
  },
});
