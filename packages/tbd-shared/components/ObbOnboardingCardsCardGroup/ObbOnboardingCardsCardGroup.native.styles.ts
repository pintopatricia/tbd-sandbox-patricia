import { tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

const CARD_WIDTH = tokens.SquadBetCardSecondaryWidth;
const CARD_GAP = tokens.ScrollableSwimlaneHeaderHorizontalGap.gap;

export default StyleSheet.create({
  statusLabelWrapper: {
    position: "relative",
    width: spacings["spacing-10"],
    height: spacings["spacing-5"],
  },
  statusLabelAbsolute: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  scrollContent: {
    paddingLeft: tokens.ScrollableSwimlaneSwimlanePadding.paddingLeft,
    paddingRight: tokens.ScrollableSwimlaneSwimlanePadding.paddingRight,
    gap: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
});

export { CARD_WIDTH, CARD_GAP };
