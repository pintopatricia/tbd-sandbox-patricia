import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketContainer: {
    marginHorizontal: spacings["spacing-3"],
  },
  marketCard: {
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
});
