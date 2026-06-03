import { StyleSheet } from "react-native";
import { heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardContainer: {
    ...tokens.MashUpsCardPadding,
    ...tokens.CardBorder,
    ...tokens.CardsDropshadow,
    ...tokens.MashUpsCardSquadVerticalGap,
    backgroundColor: tokens.CardBackgroundColour,
  },
  squadLabel: {
    ...tokens.MicroPlayerSecondaryLabelTypography,
    color: tokens.MicroPlayerSecondaryLabelColour,
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
  vsText: {
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-2"],
    paddingTop: spacings["spacing-1"],
    ...tokens.MashUpsCardSquadsLabelTypography,
    color: tokens.MashUpsCardSquadsLabelColour,
  },
  oddsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  squadOdds: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.OddsHorizontalGap.gap,
  },
  label: {
    ...tokens.MashUpsCardOddsLabelTypography,
    color: tokens.MashUpsCardOddsLabelColour,
  },
  outcomeLabel: {
    ...tokens.MashUpsCardLabelTypography,
    color: tokens.SquadBetCardLabelColour,
  },
  betButtonsContainer: {
    flexDirection: "row",
    gap: spacings["spacing-2"],
    height: heights["bet-button-height"],
  },
  betButton: {
    flex: 1,
  },
});
