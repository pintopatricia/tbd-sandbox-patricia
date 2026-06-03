import { StyleSheet } from "react-native";
import { tokens, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betLegCardContainer: {
    ...tokens.SportsbookBetLegCardPadding,
  },
  sportsIconContainer: {
    display: "flex",
    flexDirection: "row",

    alignItems: "center",

    width: tokens.BetSelectionDetailsIconSizing,
    height: tokens.BetSelectionDetailsIconSizing,
  },
  betLegCardContent: {
    marginBottom: spacings["spacing-2"],
  },
  dividerContainer: {
    marginTop: spacings["spacing-1"],
    marginBottom: spacings["spacing-1"],
  },
});
