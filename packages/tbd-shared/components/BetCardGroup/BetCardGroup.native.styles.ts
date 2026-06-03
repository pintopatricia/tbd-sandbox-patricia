import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betCardGroup: {
    ...tokens.CardVerticalGap,
    ...tokens.SportsbookBetPanelBorderRadius,
    ...tokens.CardDropShadow,
    backgroundColor: tokens.CardBackgroundColour,
    marginTop: spacings["spacing-card-top-default"],
    overflow: "hidden",
  },
  fixtureCardGroupItem: {
    paddingTop: spacings["spacing-2"],
    paddingRight: spacings["spacing-2"],
  },
  marketBetCardGroupItem: {
    paddingHorizontal: spacings["spacing-2"],
  },
  lastCardItem: {
    paddingBottom: spacings["spacing-2"],
  },
});
