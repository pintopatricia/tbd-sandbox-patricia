import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  stubCardPlaceholder: {
    height: 196,
    backgroundColor: tokens.CardBackgroundColour,
    ...tokens.CardBorderRadius,
  },
});
