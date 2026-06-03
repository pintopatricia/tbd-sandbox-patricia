import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

const height = 2 * spacings["spacing-2"] + tokens.SupportingContentButtonIconSizing;

export default StyleSheet.create({
  statsContent: {
    ...tokens.StatsContentPadding,
    width: "100%",
    gap: spacings["spacing-2"],
    flexDirection: "row",
  },

  supportingContentItem: {
    minWidth: tokens.SupportingContentButtonStatsMinHeight,
    flex: 1,
    height,
  },
});
