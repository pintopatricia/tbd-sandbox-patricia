import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  teamName: {
    width: 96,
    height: 16,
    marginVertical: spacings["spacing-half"],
  },

  fixtureHeaderContainer: {
    paddingLeft: spacings["spacing-2"],
  },

  betButton: {
    width: tokens.PriceButtonSbkContainerSizing,
    height: tokens.PriceButtonSbkContainerSizing,
  },
  statsButton: {
    height: tokens.PriceButtonSbkContainerSizing,
    width: 38,
  },
  tempPlaceholderOverride: {
    height: "100%",
  },
});
