import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholder: {
    minWidth: tokens.PriceButtonSbkContainerSizing,
    height: tokens.PriceButtonSbkContainerSizing,
  },

  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
