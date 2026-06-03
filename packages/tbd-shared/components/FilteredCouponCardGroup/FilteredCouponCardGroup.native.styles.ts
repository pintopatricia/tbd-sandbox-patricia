import { colors, spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

const HEADER_HEIGHT = 24;

export default StyleSheet.create({
  container: {
    ...tokens.CardGroupVerticalGap,
    ...tokens.CardGroupPadding,
  },
  containerWithoutMargin: {
    paddingLeft: 0,
    paddingRight: 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: HEADER_HEIGHT,
  },

  title: {
    ...tokens.CardGroupTitleTypography,
    color: tokens.CardGroupTitleColour,
  },

  filter: {
    overflow: "hidden",
  },
  filterWithMargin: {
    marginLeft: tokens.CardGroupPadding.paddingLeft,
  },
  noResults: {
    alignItems: "center",
    marginTop: spacings["spacing-8"],
  },

  noResultsLabel: {
    ...typography["typography-h280"],
    color: colors.NeutralsTextSecondary,
    marginBottom: spacings["spacing-1"],
  },

  noResultsSuggestion: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextSecondary,
  },

  noResultsReset: {
    marginTop: spacings["spacing-4"],
  },

  notification: {
    margin: spacings["spacing-3"],
  },

  pebbleListContainer: {
    marginRight: tokens.FilterByPadding.paddingRight,
    marginLeft: tokens.FilterByPadding.paddingLeft,
  },
});
