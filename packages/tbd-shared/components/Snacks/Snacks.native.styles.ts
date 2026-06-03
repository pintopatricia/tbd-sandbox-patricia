import { StyleSheet } from "react-native";

import { heights, spacings, stackings, tokens } from "@ppb/the-wall-common/base-theme";

const defaultSize = spacings["spacing-2"] + tokens.BottomBarHeightSizing;

export default StyleSheet.create({
  snacks: {
    position: "absolute",
    zIndex: stackings["messaging-stack"],
    bottom: defaultSize,
    right: spacings["spacing-1"],
    left: spacings["spacing-1"],
    paddingHorizontal: spacings["spacing-1"],
    gap: spacings["spacing-2"],
  },
  snacksBetslipCollapsed: {
    bottom: defaultSize + heights["betslip-top-offset"] + heights["betslip-collapsed-height"],
  },
});
