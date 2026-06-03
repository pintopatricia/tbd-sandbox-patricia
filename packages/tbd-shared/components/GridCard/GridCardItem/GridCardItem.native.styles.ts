import { StyleSheet } from "react-native";
import { heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  gridCardItem: {
    width: heights["bet-button-width"],
    minHeight: heights["bet-button-height"],
    flexShrink: 0,
    flex: 1,
  },
});
