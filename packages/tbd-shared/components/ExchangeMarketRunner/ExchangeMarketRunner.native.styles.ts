import { StyleSheet } from "react-native";
import { heights, spacings } from "@ppb/the-wall-common/base-theme";

const buttonWidthContainer = heights["bet-button-width"] * 2 + 1;

export default StyleSheet.create({
  buttonColumnContainer: {
    display: "flex",
    flexShrink: 0,
    alignItems: "flex-end",
  },
  spacingDiv: {
    height: 20,
  },
  nonRunner: {
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
    minHeight: heights["bet-button-height"],
    overflow: "hidden",
    marginLeft: spacings["spacing-2"],
  },
  buttonContainer: {
    marginLeft: spacings["spacing-2"],
    flexDirection: "row",
    minWidth: buttonWidthContainer,
    minHeight: heights["bet-button-height"],
  },
  buttonContainerRacingRunner: {
    marginLeft: spacings["spacing-2"],
    flexDirection: "row",
    minWidth: buttonWidthContainer,
    minHeight: heights["bet-button-height"],
    borderRadius: spacings["spacing-1"],
  },
  topCap: {
    borderTopLeftRadius: spacings["spacing-1"],
    borderTopRightRadius: spacings["spacing-1"],
  },
  bottomCap: {
    borderBottomLeftRadius: spacings["spacing-1"],
    borderBottomRightRadius: spacings["spacing-1"],
  },
  overflownHidden: {
    overflow: "hidden",
  },
  marketDepthButtonsContainer: {
    marginLeft: 0,
    borderRadius: spacings["spacing-1"],
  },
  marketDepthButtonsContainerRacingRunner: {
    borderRadius: spacings["spacing-1"],
    marginLeft: spacings["spacing-3"],
  },
  horseRacingRunnersList: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: spacings["spacing-half"],
  },
  runnerMargin: {
    paddingLeft: spacings["spacing-3"],
    paddingRight: spacings["spacing-3"],
  },
});
