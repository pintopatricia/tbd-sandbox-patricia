import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  iconButton: {
    height: tokens.MyBetsHeaderIconRightSizing,
    width: tokens.MyBetsHeaderIconRightSizing,
  },
  tooltipContainer: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
  },
});
