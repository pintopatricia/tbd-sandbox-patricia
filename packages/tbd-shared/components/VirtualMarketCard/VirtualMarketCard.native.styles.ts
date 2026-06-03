import { StyleSheet } from "react-native";
import { heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketContainer: {
    flexGrow: 1,
  },
  runnerTopMargin: {
    marginTop: spacings["spacing-2"],
  },
  button: {
    minHeight: heights["bet-button-height"],
    marginLeft: spacings["spacing-2"],
    width: heights["bet-button-width"],
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
  overflownHidden: {
    overflow: "hidden",
  },
  virtualsLink: {
    marginTop: spacings["spacing-6"],
    overflow: "hidden",
    borderRadius: spacings["spacing-1"],
  },
});
