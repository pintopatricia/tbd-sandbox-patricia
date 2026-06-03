import { StyleSheet, Dimensions } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

const horizontalPaddings = tokens.CardGroupPadding.paddingLeft + tokens.CardGroupPadding.paddingRight;
const screenWithoutHorizontalPaddings = Dimensions.get("window").width - horizontalPaddings;
const cardSize = {
  twoColumnsLayoutHero: screenWithoutHorizontalPaddings,
  twoColumnsLayout: (screenWithoutHorizontalPaddings - tokens.CardGroupHorizontalGap.gap) / 2,
  fourColumnsLayout: (screenWithoutHorizontalPaddings - tokens.CardGroupHorizontalGap.gap) / 4,
};

export default StyleSheet.create({
  twoColumnsHeroTile: {
    width: cardSize.twoColumnsLayoutHero,
    height: cardSize.twoColumnsLayout,
  },
  twoColumnTile: {
    width: cardSize.twoColumnsLayout,
    height: cardSize.twoColumnsLayout,
  },
  twoColumnsHiddenTile: {
    display: "none",
  },
  gamesGrid: {
    ...tokens.CardGroupHorizontalGap,
    ...tokens.CardGroupPadding,
  },
  columnsStyle: {
    ...tokens.CardGroupHorizontalGap,
  },
  separator: {
    height: spacings["spacing-2"],
  },
});
