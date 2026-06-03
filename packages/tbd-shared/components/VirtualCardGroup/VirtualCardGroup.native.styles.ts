import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardItem: {
    marginBottom: spacings["spacing-2"],
  },
  pebbleCardItem: {
    // PebbleCardGroup specifies its own margin instead of the parent container spacing the items
    // This is less than ideal, producing code as below
    // FIXME: Refactor PebbleCardGroup spacings and others to the closest parent
    marginHorizontal: -spacings["spacing-3"],
  },
});
