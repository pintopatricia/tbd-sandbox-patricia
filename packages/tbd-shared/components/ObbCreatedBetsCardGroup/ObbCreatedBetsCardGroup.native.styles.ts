import { tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  scrollContent: {
    paddingLeft: tokens.ScrollableSwimlaneSwimlanePadding.paddingLeft,
    paddingRight: tokens.ScrollableSwimlaneSwimlanePadding.paddingRight,
    gap: tokens.ScrollableSwimlaneHeaderHorizontalGap.gap,
  },
  cardWrapper: {
    width: tokens.SquadBetCardSecondaryWidth,
  },
  fullWidthWrapper: {
    width: Dimensions.get("window").width - tokens.ScrollableSwimlaneSwimlanePadding.paddingLeft * 2,
  },
  noGapContent: {
    gap: 0,
  },
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
});
