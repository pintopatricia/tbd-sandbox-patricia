import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardContainer: {
    ...tokens.CardPadding,
    ...tokens.CardBorderRadius,
    ...tokens.CardBorder,
    backgroundColor: tokens.CardBackgroundColour,
  },
  cardTitleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: tokens.CardTitleColour,
    ...tokens.CardTitleTypography,
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
});
