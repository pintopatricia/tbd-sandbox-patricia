import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  pebbleMarketTemplate: {
    flexGrow: 1,
    overflow: "hidden",
  },
  pebbleListContainer: {
    paddingTop: spacings["spacing-2"],
    paddingBottom: spacings["spacing-3"],
  },
  scrollViewStyle: {
    paddingLeft: spacings["spacing-2"],
  },
});
