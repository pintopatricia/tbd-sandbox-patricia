import { tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  messageContainer: {
    paddingHorizontal: spacings["spacing-3"],
    position: "absolute",
    top: tokens.HeaderContainerSizing,
    left: 0,
    width: "100%",
    height: "auto",
    zIndex: 999,
  },
});
