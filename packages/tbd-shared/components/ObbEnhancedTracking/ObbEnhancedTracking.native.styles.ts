import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  obbEnhancedTrackingContainer: {
    flexDirection: "column",
    marginTop: spacings["spacing-2"],
    marginBottom: spacings["spacing-1"],
  },
  trackingBarContainer: {
    width: "75%",
  },

  statsListTrackingContainer: {
    flexDirection: "column",
    ...tokens.SportsbookBetLegCardPlayerVerticalGap,
  },
  statsListTrackingLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacings["spacing-2"],
  },
  playerNameStyle: {
    color: tokens.SportsbookBetLegCardPlayerLabelColour,
    ...tokens.SportsbookBetLegCardPlayerNameLabelTypography,
  },
  playerProgressTitle: {
    color: tokens.SportsbookBetLegCardPlayerLabelColour,
    ...tokens.SportsbookBetLegCardPlayerLabelTypography,
  },
});
