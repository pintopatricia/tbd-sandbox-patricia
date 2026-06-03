import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    ...tokens.RaceMarketCardBorder,
    ...tokens.RaceMarketCardBorderRadius,
    backgroundColor: tokens.RaceMarketCardBackgroundColour,
    overflow: "hidden", // makes sure children respect the border radius
  },
  raceDetailsContainer: {
    ...tokens.RaceMarketCardHeaderPadding,
    backgroundColor: tokens.RaceMarketCardHeaderBackgroundColour,
  },
});
