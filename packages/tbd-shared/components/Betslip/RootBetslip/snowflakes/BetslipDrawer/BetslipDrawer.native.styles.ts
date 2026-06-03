import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betslipDrawerWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  betslipDrawer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    overflow: "hidden",
    backgroundColor: tokens.ExpandableBackgroundColour,
    ...tokens.ExpandableBorderRadius,
  },
  betslipDrawerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
