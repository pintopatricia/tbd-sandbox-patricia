import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    width: 327,
    height: 220,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    ...tokens.CardPadding,
    ...tokens.CardVerticalGap,
    ...tokens.CardStatsBorderRadius,
    ...tokens.CardStatBorder,
    backgroundColor: tokens.CardBackgroundColour,
  },
  title: {
    width: 110,
    height: 20,
  },
  microPlayerContainer: {
    flexDirection: "row",
  },
  microPlayer: {
    minWidth: 96,
    height: 64,
    marginRight: 4,
  },
  statsLabel: {
    width: 110,
    height: 14,
  },
  outcomesLabel: {
    width: 252,
    height: 20,
  },
  betButton: {
    width: 59.75,
    height: 48,
    marginRight: 4,
  },
  betButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
