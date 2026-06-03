import { StyleSheet } from "react-native";
import { heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardContainer: {
    ...tokens.MashUpsCardPadding,
    ...tokens.CardBorder,
    ...tokens.MashUpsCardSquadVerticalGap,
    backgroundColor: tokens.CardBackgroundColour,
  },
  cardTitle: {
    color: tokens.CardTitleColour,
    ...tokens.CardTitleTypography,
  },
  squadsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  microPlayerContainer: {
    ...tokens.MashUpsCardSquadVerticalGap,
    flex: 1,
    alignItems: "center",
  },
  entryPointGap: {
    paddingTop: 28,
  },
  defaultGap: {
    paddingTop: spacings["spacing-1"],
  },
  vsText: {
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-2"],
    ...tokens.MashUpsCardSquadsLabelTypography,
    color: tokens.MashUpsCardSquadsLabelColour,
  },
  outcomeLabel: {
    ...tokens.TimesBackedLabelTypography,
    color: tokens.SquadBetCardLabelColour,
  },
  betButtonsContainer: {
    flexDirection: "row",
    gap: spacings["spacing-2"],
    height: heights["bet-button-height"],
  },
  outcomesLabel: {
    ...tokens.MashUpsCardLabelTypography,
    color: tokens.SquadBetCardLabelColour,
  },
  betButton: {
    flex: 1,
  },
});
