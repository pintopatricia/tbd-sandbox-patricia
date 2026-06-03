import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  dropShadow: {
    ...tokens.CardDropShadow,
  },
  eventMarketCard: {
    overflow: "hidden",
    ...tokens.FeaturedMatchesBorder,
    ...tokens.FeaturedMatchesBorderRadius,
  },
  header: {
    ...tokens.FeaturedMatchesHeaderPadding,
    backgroundColor: tokens.FeaturedMatchesHeaderBackgroundColour,
    justifyContent: "center",
    minHeight: tokens.FeaturedMatchesHeaderMinHeight,
  },
  container: {
    ...tokens.FeaturedMatchesVerticalGap,
    backgroundColor: tokens.FeaturedMatchesBackgroundColour,
  },
});
