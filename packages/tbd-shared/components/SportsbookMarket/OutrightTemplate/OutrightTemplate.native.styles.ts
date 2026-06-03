import { StyleSheet } from "react-native";
import { heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  bodyContainer: {
    width: "100%",
    paddingTop: spacings["spacing-4"],
  },
  item: {
    flex: 1,
    flexGrow: 0.5,
    height: heights["bet-button-height"],
    maxWidth: "50%",
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
    justifyContent: "center",
  },
  columnDivider: {
    marginRight: spacings["spacing-2"],
  },
  rowDivider: {
    height: spacings["spacing-2"],
  },
});
