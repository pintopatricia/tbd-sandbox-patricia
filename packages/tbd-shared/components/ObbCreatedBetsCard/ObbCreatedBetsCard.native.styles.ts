import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: tokens.CardBorderRadius.borderRadius,
    backgroundColor: tokens.CardBackgroundColour,
    width: tokens.SquadBetCardSecondaryWidth,
    ...tokens.CardsDropshadow,
  },
  fullWidthCard: {
    width: "100%",
  },
  header: {
    padding: tokens.SquadBetCardSecondaryHeaderPadding.padding,
    backgroundColor: tokens.SquadBetCardSecondaryHeaderBackgroundColour,
  },
  seeAllContainer: {
    alignItems: "center",
    padding: tokens.SquadBetCardSecondaryPadding.padding,
  },
  namesTextTitle: {
    ...tokens.HalfTimePulseMarketCardPlayerTitleTypography,
    color: tokens.HalfTimePulseMarketCardPlayerTitleColour,
    flexShrink: 1,
  },
});
