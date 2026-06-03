import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { shadowStyle } from "react-native-fast-shadow";

export default StyleSheet.create({
  receiptDropShadow: {
    ...shadowStyle({
      color: tokens.ReceiptPanelShadow.shadowColor,
      opacity: tokens.ReceiptPanelShadow.shadowOpacity,
      radius: tokens.ReceiptPanelShadow.shadowRadius,
      offset: [tokens.ReceiptPanelShadow.shadowOffset.width, tokens.ReceiptPanelShadow.shadowOffset.height],
    }),
  },
  receipt: {
    flexDirection: "column",
    ...tokens.ReceiptPanelVerticalGap,
    backgroundColor: tokens.ReceiptPanelBackgroundColour,
    ...tokens.ReceiptPanelBorderRadius,
  },
  container: {
    overflow: "hidden",
    flexDirection: "column",
    ...tokens.ReceiptPanelContainerVerticalGap,
    ...tokens.ReceiptPanelContainerPadding,
    ...tokens.ReceiptPanelContainerBorderRadius,
  },
  segmentsWrap: {
    ...tokens.ReceiptPanelContainerBetSegmentsPadding,
  },
  betReceiptContainer: {
    backgroundColor: tokens.ReceiptPanelContainerBackgroundColour,
  },
});
