import { StyleSheet } from "react-native";
import { tokens, heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  matchStatSelectionCardContainer: {
    display: "flex",
    flexDirection: "column",
    ...tokens.HalfTimePulseMarketCardPadding,
    ...tokens.HalfTimePulseMarketCardVerticalGap,
    alignItems: "flex-start",
    alignSelf: "stretch",
    ...tokens.HalfTimePulseCardBorderRadius,
    backgroundColor: tokens.HalfTimePulseMarketCardBackgroundColour,
  },

  marketDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...tokens.HalfTimePulseStatContainerSpacingGap,
    alignSelf: "stretch",
  },

  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },

  odds: {
    display: "flex",
    height: heights["bet-button-height"],
    width: heights["bet-button-width"],
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  titleWrapper: {
    display: "flex",
    alignItems: "flex-start",
    rowGap: tokens.HalfTimePulseMarketCardPlayerTitleVerticalGap.gap,
    columnGap: tokens.HalfTimePulseMarketCardPlayerTitleHorizontalGap.gap,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  title: {
    alignSelf: "stretch",
    color: tokens.HalfTimePulseMarketCardPlayerTitleColour,
    ...tokens.HalfTimePulseMarketCardPlayerTitleTypography,
  },

  subtitle: {
    alignSelf: "stretch",
    color: tokens.HalfTimePulseMarketCardMarketDescriptionColour,
    ...tokens.HalfTimePulseMarketCardMarketDescriptionTypography,
  },

  icon: {
    width: heights["icon-size-large"],
    height: heights["icon-size-large"],
    aspectRatio: 1 / 1,
  },

  infoContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
});
