import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  playerCardContainer: {
    minWidth: tokens.PlayerListCardMinWidthSizing,
    ...tokens.PlayerListCardBorderRadius,
  },
  highlighted: {
    ...tokens.PlayerListCardSelectedBorder,
  },
  playerInfoContainer: {
    alignItems: "flex-start",
    height: tokens.PlayerListCardPlayerInfoSizing,
    backgroundColor: tokens.PlayerListCardHeaderBackgroundColour,
    ...tokens.PlayerListCardVerticalGap,
    ...tokens.PlayerListCardPadding,
    borderTopRightRadius: tokens.PlayerListCardBorderRadius.borderRadius,
    borderTopLeftRadius: tokens.PlayerListCardBorderRadius.borderRadius,
  },
  name: {
    color: tokens.PlayerListCardLabelColour,
    ...tokens.PlayerListCardLabelTypography,
  },
  position: {
    color: tokens.PlayerListCardSupportingTextColour,
    ...tokens.PlayerListCardSupportingTextTypography,
  },
  playerValuesContainer: {
    flexDirection: "row",
    backgroundColor: tokens.PlayerListCardContentBackgroundColour,
    ...tokens.PlayerListCardHorizontalGap,
    ...tokens.PlayerListCardPadding,
    borderBottomRightRadius: tokens.PlayerListCardBorderRadius.borderRadius,
    borderBottomLeftRadius: tokens.PlayerListCardBorderRadius.borderRadius,
  },
  playerStats: {
    flex: 1,
    ...tokens.PlayerListCardStatsVerticalGap,
  },
  statsLabel: {
    color: tokens.PlayerListCardSupportingTextColour,
    ...tokens.PlayerListCardSupportingTextTypography,
    textTransform: "capitalize",
  },
  statsContainer: {
    ...tokens.PlayerListCardStatsValueVerticalGap,
  },
  statsValue: {
    color: tokens.PlayerListCardStatsTextColour,
    ...tokens.PlayerListCardStatsTextTypography,
  },
  odds: {
    justifyContent: "center",
    alignItems: "center",
    width: tokens.PlayerListCardOddsWidthSizing,
    height: tokens.PlayerListCardOddsHeightSizing,
    backgroundColor: tokens.PlayerListCardOddsBackgroundColour,
    ...tokens.PlayerListCardOddsBorderRadius,
    ...tokens.PlayerListCardOddsPadding,
  },
  placeholder: {
    width: tokens.PlayerListCardPlaceholderWidthSizing,
    height: tokens.PlayerListCardPlaceholderHeightSizing,
  },
  labelDisabled: {
    color: tokens.PlayerListCardDisabledLabelColour,
  },
  supportingTextDisabled: {
    color: tokens.PlayerListCardDisabledSupportingTextColour,
  },
  statsDisabled: {
    color: tokens.PlayerListCardDisabledStatsTextColour,
  },
});
