import { StyleSheet } from "react-native";
import { tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    backgroundColor: tokens.PopularBetBuilderCardBackgroundColour,
    ...tokens.PopularBetBuilderCardBorderRadius,
  },
  header: {
    flexDirection: "row",
    ...tokens.PopularBetBuilderCardHeaderHorizontalGap,
    ...tokens.PopularBetBuilderCardHeaderPadding,
    backgroundColor: tokens.PopularBetBuilderCardHeaderBackgroundColour,
  },
  headerFixture: {
    backgroundColor: tokens.PopularBetBuilderCardHighlightedHeaderBackgroundColour,
  },
  fixtureHeader: {
    flex: 1,
  },
  content: {
    ...tokens.PopularBetBuilderCardContentPadding,
    ...tokens.PopularBetBuilderCardContentVerticalGap,
  },
  boostedIconContainer: {
    alignSelf: "center",

    height: tokens.PopularBetBuilderCardHeaderBoostIconBoxSizing,
    width: tokens.PopularBetBuilderCardHeaderBoostIconBoxSizing,
    ...tokens.PopularBetBuilderCardHeaderBoostIconBoxPadding,
    ...tokens.PopularBetBuilderCardHeaderBoostIconBoxBorderRadius,
    backgroundColor: tokens.PopularBetBuilderCardHeaderBoostIconBoxColour,
  },
  boostedIcon: {
    height: tokens.PopularBetBuilderCardHeaderBoostIconSizing,
    width: tokens.PopularBetBuilderCardHeaderBoostIconSizing,
  },
  selectionTypeIcon: {
    width: tokens.BubbleItemIconSizing,
    height: tokens.BubbleItemIconSizing,
  },
  cardTitle: {
    color: tokens.PriceInputPopulatedTextLabelColour,
    ...typography["typography-h280"],
  },
  marketTitle: {
    color: tokens.PriceInputPopulatedTextLabelColour,
    ...typography["typography-h280"],
  },
});
