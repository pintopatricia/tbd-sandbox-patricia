import { StyleSheet } from "react-native";
import { SPACINGS } from "@ppb/the-wall-common/base-theme-tokens";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  favouriteMarketsEmptyState: {
    paddingHorizontal: SPACINGS["spacing-3"],
    paddingTop: tokens.TabsGroupRegularPadding.paddingTop,
  },

  cardContent: {
    paddingHorizontal: SPACINGS["spacing-6"],
  },
});
