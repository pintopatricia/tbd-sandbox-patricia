import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

const CARD_WIDTH = tokens.SquadBetCardSecondaryWidth;
const CARD_GAP = tokens.ScrollableSwimlaneHeaderHorizontalGap.gap;

export default StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
  },
  scrollContent: {
    paddingLeft: tokens.ScrollableSwimlaneSwimlanePadding.paddingLeft,
    paddingRight: tokens.ScrollableSwimlaneSwimlanePadding.paddingRight,
    gap: CARD_GAP,
  },
});

export { CARD_WIDTH, CARD_GAP };
