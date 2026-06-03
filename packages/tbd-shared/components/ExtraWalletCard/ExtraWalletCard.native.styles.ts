import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  extraWalletCard: {
    ...tokens.OptionVerticalGap,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...tokens.OptionHorizontalGapSecondary,
  },
});
