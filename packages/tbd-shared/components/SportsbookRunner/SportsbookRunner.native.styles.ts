import { StyleSheet } from "react-native";
import { heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  hrRunnerMargin: {
    marginTop: spacings["spacing-half"],
  },
  button: {
    minHeight: heights["bet-button-height"],
    marginLeft: spacings["spacing-2"],
    width: heights["bet-button-width"],
  },
  overflownHidden: {
    overflow: "hidden",
  },
  bottomRadius: {
    borderBottomRightRadius: spacings["spacing-1"],
    borderBottomLeftRadius: spacings["spacing-1"],
  },
  topRadius: {
    borderTopLeftRadius: spacings["spacing-1"],
    borderTopRightRadius: spacings["spacing-1"],
  },
  nonRunner: {
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
    minHeight: heights["bet-button-height"],
    overflow: "hidden",
    marginLeft: spacings["spacing-2"],
  },
  buttonAndPriceHistoryContainer: {
    display: "flex",
    flexShrink: 0,
    alignItems: "flex-end",
    ...tokens.HorseRacingRunnerVerticalGapPrimary,
  },
  priceHistoryContainer: {
    marginTop: spacings["spacing-half"],
    marginBottom: spacings["spacing-half"],
    height: 16,
  },
  hrSbkButton: {
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
});
