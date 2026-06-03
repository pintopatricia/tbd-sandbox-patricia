import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    flexShrink: 1,
  },
  singleSignposting: {
    alignSelf: "flex-end",
    flexDirection: "row",
    height: 24,
  },
  content: {
    ...tokens.SportsbookReceiptPanelContainerPadding,
    ...tokens.SportsbookReceiptPanelContainerVerticalGap,
    flexShrink: 1,
  },
  scrollable: {
    ...tokens.SportsbookReceiptPanelContainerVerticalGap,
  },
  list: {
    ...tokens.SportsbookReceiptPanelCardVerticalGapBig,
  },
  combination: {
    ...tokens.SportsbookReceiptPanelCardVerticalGap,
  },
  combinationSummary: {
    ...tokens.SportsbookReceiptPanelBetInfoVerticalGap,
    ...tokens.SportsbookReceiptPanelBetInfoPadding,
  },
  summary: {
    ...tokens.SportsbookReceiptPanelSummaryPadding,
    ...tokens.SportsbookReceiptPanelSummaryVerticalGap,
    flexShrink: 0,
  },
  reUseSelectionsContainer: {
    // make sure to keep space for the button inside the receipt panel.
    // SportsbookBetButton is using absolute positioning
    height: tokens.PriceButtonSbkContainerSizing,
  },
  receiptContentContainer: {
    ...tokens.SportsbookReceiptPanelCardBorderRadius,
    ...tokens.SportsbookReceiptPanelCardPadding,
    ...tokens.SportsbookReceiptPanelCardVerticalGap,
    backgroundColor: tokens.SportsbookReceiptPanelCardBackgroundColour,
  },
  boostedMultiplesHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  boostedMultiplesIcon: {
    width: tokens.SportsbookReceiptPanelIconSizingWidth,
    height: tokens.SportsbookReceiptPanelIconSizingHeigth,
  },
  option: {
    justifyContent: "center",
    height: tokens.BetSummaryOptionHeightSizing,
  },
});
