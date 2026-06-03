import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    ...tokens.BottomSheetVerticalGap,
  },
  header: {
    ...tokens.BottomSheetVerticalGap,
  },
  playerList: {
    ...tokens.BottomSheetVerticalGap,
    width: "100%",
  },
});
