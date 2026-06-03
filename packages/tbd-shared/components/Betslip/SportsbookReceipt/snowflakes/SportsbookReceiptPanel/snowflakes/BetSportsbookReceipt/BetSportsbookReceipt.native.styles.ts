import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  betReceiptContainer: {
    backgroundColor: tokens.BetSportsbookReceiptBackgroundColor,
  },
  content: {
    ...tokens.BetSportsbookReceiptContainerVerticalGap,
    ...tokens.BetSportsbookReceiptContainerPadding,
  },
});
