import { StyleSheet, Dimensions } from "react-native";
import { spacings, widths } from "@ppb/the-wall-common/base-theme";

const sharedStyles = StyleSheet.create({
  item: {
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default StyleSheet.create({
  singleCard: {
    ...sharedStyles.item,
    width: Dimensions.get("window").width - spacings["spacing-3"] * 2,
  },
  multipleCards: {
    ...sharedStyles.item,
    width: Math.min(
      Dimensions.get("window").width * widths["swimlane-item-container-width-percentage"],
      widths["swimlane-item-container-max-width"],
    ),
    marginRight: spacings["spacing-3"],
  },
  lastItem: {
    marginRight: 0,
  },
});
