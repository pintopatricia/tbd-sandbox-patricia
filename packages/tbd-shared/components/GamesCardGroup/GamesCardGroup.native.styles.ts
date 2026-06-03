import { StyleSheet, Dimensions } from "react-native";
import { colors, heights, spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";

const horizontalPaddings = tokens.CardGroupPadding.paddingLeft + tokens.CardGroupPadding.paddingRight;
const screenWithoutHorizontalPaddings = Dimensions.get("window").width - horizontalPaddings;
const cardSize = {
  twoColumnsLayoutHero: screenWithoutHorizontalPaddings,
  twoColumnsLayout: (screenWithoutHorizontalPaddings - tokens.SwimlaneHorizontalGapPrimary.gap) / 2,
  // (view width - the spacing between cards - the left spacing - right spacing ) divided by 4
  fourColumnsLayout: (screenWithoutHorizontalPaddings - 3 * tokens.SwimlaneHorizontalGapPrimary.gap) / 4,
};

export default StyleSheet.create({
  cardsGroupContainer: {
    ...tokens.CardGroupPadding,
    ...tokens.CardGroupVerticalGap,
  },
  title: {
    color: tokens.CardGroupTitleColour,
    ...tokens.CardGroupTitleTypography,
  },
  gamesGrid: {
    width: "100%",
    ...tokens.CardGroupStackingVerticalGap,
  },
  columns: {
    ...tokens.SwimlaneHorizontalGapPrimary,
  },
  twoColumns: {
    height: cardSize.twoColumnsLayout,
    width: cardSize.twoColumnsLayout,
  },
  twoColumnsHeroTile: {
    width: cardSize.twoColumnsLayoutHero,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  twoColumnsHiddenTile: {
    display: "none",
  },
  fourColumns: {
    width: cardSize.fourColumnsLayout,
  },

  // TO DO: add tokens for segmented components if they are used
  segmentedTitle: {
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
  },
  segmentedGameContainer: {
    height: heights["gaming-card-size"],
    width: heights["gaming-card-size"],
    marginRight: spacings["spacing-3"],
  },
  segmentedAllCardsContainer: {
    flexDirection: "row",
  },
  segmentedGamesCardsContainers: {
    flexDirection: "row",
    flexWrap: "nowrap",
    height: heights["gaming-card-size"],
    marginTop: spacings["spacing-3"],
  },
  gamingCategoryLink: {
    marginTop: spacings["spacing-3"],
  },

  itemSeparatorView: {
    height: spacings["spacing-3"],
  },
});
