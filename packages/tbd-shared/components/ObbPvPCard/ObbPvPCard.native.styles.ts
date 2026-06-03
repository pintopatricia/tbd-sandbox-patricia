import { heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  playerParticipantsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  playerParticipantContainer: {
    width: "100%",
    flexShrink: 1,
  },
  betButtonContainer: {
    height: heights["bet-button-height"],
    display: "flex",
    flexDirection: "row",
    gap: 1,
  },
  betButton: {
    flex: 1,
  },
  versusContainer: {
    width: tokens.ObbCardVersusWidth,
    height: tokens.ObbCardVersusHeight,
  },
  bottomSheetHeader: {
    gap: spacings["spacing-2"],
  },
  neutral: {
    ...tokens.CardBorderRadius,
    backgroundColor: tokens.PlayerSelectorBackgroundColour,
  },
  unavailableIcon: {
    width: tokens.EmptyStateIconSizing,
    height: tokens.EmptyStateIconSizing,
  },
});
