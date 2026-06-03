import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  chip: {
    flexShrink: 0,
    marginRight: spacings["spacing-3"],
  },
  firstChip: {
    paddingLeft: spacings["spacing-3"],
  },
});
