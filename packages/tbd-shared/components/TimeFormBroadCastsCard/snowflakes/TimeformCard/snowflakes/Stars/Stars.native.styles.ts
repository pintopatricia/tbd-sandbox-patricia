import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  starsContent: {
    flexDirection: "row",
    flexShrink: 0,
  },
  star: {
    width: 12,
    height: 12,
    marginRight: spacings["spacing-2"],
    alignSelf: "center",
  },
  noMarginRight: { marginRight: 0 },
});
