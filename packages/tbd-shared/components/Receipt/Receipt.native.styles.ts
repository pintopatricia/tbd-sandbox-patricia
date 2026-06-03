import { StyleSheet } from "react-native";
import { stackings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  receiptPanel: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: stackings["betslip-stack"],
  },
});
