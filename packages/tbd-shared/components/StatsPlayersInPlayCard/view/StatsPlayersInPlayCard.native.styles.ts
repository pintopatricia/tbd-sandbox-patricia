import { StyleSheet } from "react-native";
import { tokens, widths } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  statsPlayersContainer: {
    marginTop: tokens.StatsTableCardGap.gap,
    rowGap: tokens.StatsTableCardGap.gap,
  },
  swimlaneContainer: {
    flexDirection: "column",
    marginRight: tokens.StatsTableCardGap.gap,
    rowGap: tokens.StatsTableCardGap.gap,
    width: widths["swimlane-item-container-max-width"],
    backgroundColor: tokens.StatsTableCardBackgroundColor,
    ...tokens.StatsTableCardPadding,
    ...tokens.StatsTableCardBorder,
    ...tokens.StatsTableCardBorderRadius,
  },
  title: {
    color: tokens.StatsTableCardTitleColor,
  },
  lastSwimlaneEntry: {
    marginRight: 0,
  },
});
