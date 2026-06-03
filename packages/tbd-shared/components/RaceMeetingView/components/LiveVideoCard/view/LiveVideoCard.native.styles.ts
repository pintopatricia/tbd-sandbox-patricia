import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingHorizontal: spacings["spacing-3"],
  },
  options: {
    flexDirection: "row",
    gap: spacings["spacing-1"],
  },
  content: {
    paddingTop: spacings["spacing-1"],
  },
});
