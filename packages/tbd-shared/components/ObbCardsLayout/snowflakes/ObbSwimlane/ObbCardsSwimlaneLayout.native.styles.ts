import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: { gap: tokens.CardGroupVerticalGap.gap },
  title: { ...tokens.CardGroupTitleTypography, color: tokens.CardGroupTitleColour, flexGrow: 1 },
  cardWrapper: {
    width: tokens.SquadBetCardWidth,
  },
  scrollView: {
    marginHorizontal: -spacings["spacing-3"],
  },
  scrollViewContent: {
    flexGrow: 1,
    gap: tokens.MicroPlayerSwimlaneHorizontalGap.gap,
    paddingHorizontal: spacings["spacing-3"],
  },
});
