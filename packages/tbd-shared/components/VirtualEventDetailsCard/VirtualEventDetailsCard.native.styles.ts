import { StyleSheet } from "react-native";
import { spacings, gutters, colors } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  raceDetailsContainer: {
    padding: spacings["spacing-2"],
    marginBottom: gutters["gutter-1"],
    backgroundColor: colors.RaceMarketCardHeaderBackgroundColour,
  },
});
