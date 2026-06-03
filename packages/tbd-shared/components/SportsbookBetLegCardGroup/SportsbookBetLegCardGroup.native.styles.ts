import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    backgroundColor: tokens.SportsbookBetLegCardGroupBackgroundContainerColour,
    ...tokens.SportsbookBetLegCardGroupContainerBorderRadius,
    ...tokens.SportsbookBetLegCardGroupBorder,
  },
  supportingContentCardContainer: {
    ...tokens.SportsbookBetLegCardGroupSupportingContentCardPadding,
  },
  supportingContentCardStatsContainer: {
    ...tokens.SportsbookBetLegCardGroupSupportingContentCardHorizontalGap,
  },
  supportingContentCard: {
    backgroundColor: tokens.SportsbookBetLegCardGroupBackgroundSupportingContentCardBoxColour,
    ...tokens.SportsbookBetLegCardGroupSupportingContentCardBoxBorderRadius,
  },
  supportingContentCardBox: {
    flexGrow: 1,
    flexShrink: 0,
    ...tokens.SportsbookBetLegCardGroupSupportingContentCardBoxPadding,
  },
  dividerContainer: {
    ...tokens.SportsbookBetLegCardGroupDividerPadding,
  },
});
