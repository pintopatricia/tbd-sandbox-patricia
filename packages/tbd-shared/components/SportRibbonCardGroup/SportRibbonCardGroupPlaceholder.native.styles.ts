import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sportRibbonCardPlaceholder: {
    width: 54,
    height: tokens.SportsRibbonPlaceholderHeightSizing,
    marginRight: tokens.SportsRibbonPlaceholderHorizontalGap.gap,
  },
  placeholderContainer: {
    flexDirection: "row",
    marginLeft: tokens.SportsRibbonPlaceholderHorizontalGap.gap,
  },
  // TODO: The native placeholder doesnt currently expand to fill the parent container
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
