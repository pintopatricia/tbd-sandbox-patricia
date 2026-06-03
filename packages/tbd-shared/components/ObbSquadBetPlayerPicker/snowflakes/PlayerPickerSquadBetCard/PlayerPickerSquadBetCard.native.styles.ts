import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardContainer: {
    ...tokens.CardPadding,
    ...tokens.CardBorderRadius,
    ...tokens.CardsDropshadow,
    backgroundColor: tokens.CardBackgroundColour,
  },
  spacingTop: {
    marginTop: tokens.CardVerticalGap.gap,
  },
  spacingBottom: {
    marginBottom: tokens.CardVerticalGap.gap,
  },
  outcomesLabel: {
    ...tokens.SquadBetCardLabelTypography,
    color: tokens.SquadBetCardLabelColour,
  },
  microPlayer: {
    flexShrink: 0,
    width: tokens.MicroPlayerWidthSizing,
  },
  microPlayerSpacing: {
    marginRight: tokens.MicroPlayerSwimlaneHorizontalGap.gap,
  },
  contextualStatsContainer: {
    flexDirection: "row",
  },
});
