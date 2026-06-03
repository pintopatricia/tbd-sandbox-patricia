import { StyleSheet } from "react-native";
import { spacings, gutters } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketDepthButtonContainer: {
    alignItems: "flex-end",
  },
  cashoutContainer: {
    flexDirection: "row",
  },
  liability: {
    flexBasis: "40%",
  },
  cashout: {
    flexBasis: "60%",
  },
  divider: {
    paddingVertical: spacings["spacing-2"],
  },
  runnerMargin: {
    marginTop: gutters["gutter-1"],
    paddingLeft: spacings["spacing-3"],
    paddingRight: spacings["spacing-3"],
  },
  horseRacingRunnersList: {
    paddingLeft: 0,
  },
  runnersList: {
    paddingTop: spacings["spacing-3"],
    paddingBottom: spacings["spacing-3"],
  },
  // temporary adjustment to the children with old variables, until this component gets tokenized.
  marginBottomSpacing4: {
    marginBottom: spacings["spacing-4"],
  },
  marginBottomSpacing1: {
    marginBottom: spacings["spacing-1"],
  },
  marginTopGutter1: {
    marginTop: gutters["gutter-1"],
  },
  runnersOnMarketDepth: {
    paddingBottom: 0,
  },
});
