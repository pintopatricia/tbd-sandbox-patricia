import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  brand: {
    width: tokens.BrandLogoDefaultWidthSizing,
    height: tokens.BrandLogoDefaultHeightSizing,
  },
  exchange: {
    height: tokens.BrandLogoExchangeHeightSizing,
    width: tokens.BrandLogoExchangeWidthSizing,
  },
  games: {
    height: tokens.BrandLogoGamesHeightSizing,
    width: tokens.BrandLogoGamesWidthSizing,
  },
});
