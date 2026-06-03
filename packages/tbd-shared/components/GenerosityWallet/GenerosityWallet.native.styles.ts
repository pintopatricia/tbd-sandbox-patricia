import { StyleSheet } from "react-native";
import { stackings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  generosityWallet: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: stackings["bottom-sheet-stack"],
    height: "100%",
  },
  bonusPageActionLink: {
    alignItems: "center",
  },
});
