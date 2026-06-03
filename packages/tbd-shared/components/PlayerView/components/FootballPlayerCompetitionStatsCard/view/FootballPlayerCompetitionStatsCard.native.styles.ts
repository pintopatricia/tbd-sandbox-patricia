import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: spacings["spacing-2"],
    marginHorizontal: spacings["spacing-3"],
    marginBottom: spacings["spacing-4"],
  },

  collapseWrapper: {
    overflow: "hidden",
    backgroundColor: tokens.CardBackgroundColour,
    ...tokens.CardBorderRadius,
  },

  stats: {
    flexDirection: "row",
    gap: spacings["spacing-9"],
    ...tokens.TooltipPadding,
  },

  statItem: {
    flex: 1,
    flexDirection: "column",
  },

  statTitle: {
    color: tokens.CardGroupTitleColour,
    ...tokens.CardGroupTitleTypography,
  },

  statLabel: {
    color: tokens.CardGroupTitleColour,
    ...tokens.OddsLargeLabelTypography,
  },

  statValue: {
    color: tokens.CardGroupTitleColour,
    fontWeight: "500",
    fontSize: 56,
    lineHeight: 64,
    fontFamily: "SSportsD",
  },

  collapseHeader: {
    alignItems: "flex-start",
    backgroundColor: tokens.CardHeaderSecondaryBackgroundColour,
    ...tokens.CardHeaderHorizontalGap,
    ...tokens.SportsRibbonPlaceholderPadding,
  },
  collapseHeaderText: {
    ...tokens.CardHeaderMediumTitleTypography,
    color: tokens.CardHeaderSecondaryTitleColour,
  },
  placeholder: {
    height: 200,
  },
});
