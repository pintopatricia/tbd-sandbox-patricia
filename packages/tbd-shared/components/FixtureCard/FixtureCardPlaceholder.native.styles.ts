import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    ...tokens.EventHeaderPadding,
    height: 100,
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
