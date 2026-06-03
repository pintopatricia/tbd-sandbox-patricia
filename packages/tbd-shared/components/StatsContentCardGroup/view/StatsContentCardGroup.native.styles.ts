import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  statsContent: {
    ...tokens.StatsContentPadding,
  },
  supportingContentItem: {
    marginRight: spacings["spacing-1"],
    minWidth: tokens.SupportingContentButtonStatsMinHeight,
    flex: 1,
  },
  lastItem: {
    marginRight: 0,
  },
  viewItemContainer: {
    paddingTop: spacings["spacing-2"],
  },
  dividerContainer: {
    paddingBottom: spacings["spacing-2"],
  },
});
