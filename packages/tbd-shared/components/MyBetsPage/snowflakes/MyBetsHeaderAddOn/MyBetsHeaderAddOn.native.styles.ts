import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  helpLink: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...tokens.MyBetsHeaderAddOnPadding,
    ...tokens.MyBetsHeaderAddOnHorizontalGap,
  },

  helpLinkButtonIcon: {
    width: tokens.MyBetsHeaderAddOnIconSizing,
    height: tokens.MyBetsHeaderAddOnIconSizing,
  },
});
