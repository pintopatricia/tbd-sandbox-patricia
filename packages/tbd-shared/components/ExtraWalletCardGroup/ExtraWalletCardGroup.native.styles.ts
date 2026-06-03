import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  extraWalletCardGroup: {
    display: "flex",
    ...tokens.BottomSheetVerticalGap,
  },
  extraWalletCardGroupOption: {
    display: "flex",

    minHeight: tokens.FreeBetsSizing,
  },
});
