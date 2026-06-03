import { StyleSheet } from "react-native";
import { typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  infoTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  text: {
    ...typography["typography-h156"],
    textAlign: "center",
  },
  LegDetailsText: {
    ...typography["typography-h158"],
  },
});
