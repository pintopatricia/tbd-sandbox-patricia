import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    ...tokens.SportsbookBetLegCardPadding,
    height: 49,
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
