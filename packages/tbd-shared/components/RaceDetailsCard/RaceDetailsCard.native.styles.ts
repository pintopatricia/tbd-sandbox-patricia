import { StyleSheet } from "react-native";
import { colors, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  link: {
    backgroundColor: "transparent",
  },
  raceDetailsContainer: {
    paddingVertical: tokens.SmSpacingXSmall,
    paddingHorizontal: tokens.SmSpacingSmall,
  },
  /* The need for this sticky color style and its logic should be reevaluated when tokenizing this connected component */
  raceDetailsContainerStickyColor: {
    backgroundColor: colors.StickyHeaderBackgroundColour,
  },
});
