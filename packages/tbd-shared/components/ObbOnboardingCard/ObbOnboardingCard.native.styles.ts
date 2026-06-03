import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    ...tokens.MashUpsCardSquadVerticalGap,
    ...tokens.CardPadding,
  },
  squadsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  microPlayerContainer: {
    ...tokens.MashUpsCardSquadVerticalGap,
    flex: 1,
    justifyContent: "center",
    minWidth: 125,
  },
  microPlayerContainerSquadBet: {
    width: 300,
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-2"],
    ...tokens.MashUpsCardSquadsLabelTypography,
    color: tokens.MashUpsCardSquadsLabelColour,
  },
  betButtonsContainer: {
    flexDirection: "row",
    gap: spacings["spacing-2"],
    flex: 1,
  },
  betButton: {
    flex: 1,
    height: 40,
  },
});
