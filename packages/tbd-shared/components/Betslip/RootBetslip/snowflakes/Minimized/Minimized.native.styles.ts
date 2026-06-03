import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  minimizedBetslip: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 4,
    paddingRight: 0,
    paddingLeft: 8,
    ...tokens.MinimisedHorizontalGapPrimary,
  },
  children: {
    flexShrink: 1,
  },
});
