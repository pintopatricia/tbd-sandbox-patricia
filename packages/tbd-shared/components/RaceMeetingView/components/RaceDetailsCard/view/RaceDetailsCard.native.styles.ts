import { StyleSheet } from "react-native";
import { colors, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  raceDetailsContainer: {
    paddingVertical: tokens.SmSpacingXSmall,
    paddingHorizontal: tokens.SmSpacingSmall,
  },
  raceDetailsContainerStickyColor: {
    backgroundColor: colors.StickyHeaderBackgroundColour,
  },
});
