import { Dimensions, StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

const cardSize = {
  twoColumnsLayoutHero: Dimensions.get("window").width - 2 * spacings["spacing-3"],
  twoColumnsLayout: (Dimensions.get("window").width - 3 * spacings["spacing-3"]) / 2,
};

export default StyleSheet.create({
  gamingBrowseContainer: {
    marginHorizontal: -spacings["spacing-3"],
    maxWidth: Dimensions.get("window").width,
  },
  searchContainer: {
    marginHorizontal: spacings["spacing-3"],
  },
  gameContainer: {
    marginBottom: spacings["spacing-3"],
  },
  twoColumnsHiddenTile: {
    marginRight: 0,
    height: cardSize.twoColumnsLayout,
    width: 0,
  },
  twoColumns: {
    marginHorizontal: spacings["spacing-3"],
    height: cardSize.twoColumnsLayout,
    width: cardSize.twoColumnsLayout,
  },
  twoColumnsNoSpacing: {
    marginLeft: 0,
  },
  twoColumnsHeroTile: {
    width: cardSize.twoColumnsLayoutHero,
  },
  text: {
    ...typography["typography-h120"],
    marginBottom: spacings["spacing-3"],
    marginTop: spacings["spacing-2"],
    marginHorizontal: spacings["spacing-3"],
    color: colors.NeutralsTextSecondary,
  },
});
