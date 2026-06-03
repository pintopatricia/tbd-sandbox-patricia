import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  statsContainer: {
    ...tokens.StatsContainerVerticalGap,
    ...tokens.StatsContainerPadding,
    backgroundColor: tokens.StatsBackgroundColour,
    borderBottomWidth: tokens.StatsBorder.borderWidth,
    borderBottomColor: tokens.StatsBorder.borderColor,
    borderStyle: tokens.StatsBorder.borderStyle,
  },
  pebblesContainer: {
    ...tokens.StatsPebblesPadding,
  },
  statsContent: {
    ...tokens.StatsContentPadding,
  },
});
