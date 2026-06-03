import { tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

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
  },
  timesBackedContainer: {
    paddingTop: tokens.HalfTimePulseMarketCardPadding.padding,
    paddingLeft: tokens.HalfTimePulseMarketCardPadding.padding,
  },
  title: {
    ...tokens.HalfTimePulseMarketCardPlayerTitleTypography,
    color: tokens.HalfTimePulseMarketCardPlayerTitleColour,
    flexShrink: 1,
  },
  showMoreContainer: {
    width: "100%",
    paddingBottom: tokens.SquadBetCardSecondaryPadding.padding,
  },
});
