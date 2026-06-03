import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: tokens.SmSpacingXSmall,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    flexGrow: 1,
    flexBasis: 1,
    justifyContent: "center",
  },
  leftItem: {
    marginRight: tokens.SmSpacingXxxSmall,
  },
  rightItem: {
    marginLeft: tokens.SmSpacingXxxSmall,
  },
});
