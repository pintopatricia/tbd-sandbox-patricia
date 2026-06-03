import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingTop: spacings["spacing-1"],
  },
  card: {
    paddingHorizontal: spacings["spacing-3"],
  },
  cardOptions: {
    flexDirection: "row",
  },
  gap: {
    width: spacings["spacing-1"],
  },
});
