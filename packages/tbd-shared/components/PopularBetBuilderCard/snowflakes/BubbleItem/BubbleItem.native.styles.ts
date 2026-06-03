import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    ...tokens.BubbleItemHorizontalGapPrimary,
  },
  regularTitle: {
    color: tokens.BubbleItemTextContentTextColour,
    ...tokens.BubbleItemTitleTypography,
  },
  description: {
    color: tokens.BubbleItemTextContentTextColour,
    ...tokens.BubbleItemContentTextTypography,
  },
  subDescription: {
    color: tokens.BubbleItemTextSupportingTextColour,
    ...tokens.BubbleItemSupportingTextTypography,
  },
  leftArea: {
    top: tokens.BubbleItemLinePadding.paddingTop,
    flexDirection: "row",
    justifyContent: "center",
  },
  line: {
    position: "absolute",
    height: "100%",
    width: tokens.BubbleItemLineSizing,
    backgroundColor: tokens.BubbleItemLineColour,
  },
  lastLine: {
    display: "none",
  },
  label: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  lastLabel: {
    borderLeftColor: "transparent",
  },
  titleInfo: {
    flexWrap: "wrap",
    flexShrink: 1,
  },
  boldTitle: {
    color: tokens.BubbleItemTextTitleHighlightedColour,
    ...tokens.BubbleItemTitleHighlightedTypography,
  },
  circle: {
    width: tokens.BubbleItemPointerSizing,
    height: tokens.BubbleItemPointerSizing,
    ...tokens.BubbleItemPointerBorderRadius,
    backgroundColor: tokens.BubbleItemPointerColour,
    zIndex: 1,
  },
  informationContainer: {
    flexGrow: 1,
    flexShrink: 1,
    ...tokens.BubbleItemContentPadding,
  },
  iconContainer: {
    flexShrink: 0,
  },
  icon: {
    width: tokens.BubbleItemSilkWidthSizing,
    height: tokens.BubbleItemSilkHeightSizing,
  },
  firstLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ...tokens.BubbleItemHorizontalGapSecondary,
  },
  iconAndTitleContainer: {
    flexDirection: "row",
    flexShrink: 1,
    ...tokens.BubbleItemHorizontalGapSecondary,
  },
  children: {
    flexDirection: "row",
    ...tokens.BubbleItemHorizontalGapSecondary,
  },
});
