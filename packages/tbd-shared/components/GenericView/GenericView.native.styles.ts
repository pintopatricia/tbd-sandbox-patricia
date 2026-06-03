import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  genericView: {
    height: "100%",
  },

  default: {
    backgroundColor: tokens.NeutralsBackgroundElevation1,
  },

  transparent: {
    backgroundColor: "transparent",
  },

  highlighted: {
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
    marginTop: -StyleSheet.hairlineWidth,
    marginBottom: -StyleSheet.hairlineWidth,
  },

  header: {
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
  },

  genericViewItemContainer: {
    paddingTop: spacings["spacing-card-top-default"],
  },

  genericViewItemContainerHorizontalMargin: {
    paddingHorizontal: spacings["spacing-3"],
  },

  // groups define their own margins
  groupContainer: {
    margin: 0,
  },

  // rich content cards are UI exceptions for the margin top
  richContentContainer: {
    paddingTop: spacings["spacing-card-top-default"],
  },

  cardFollowedBySticky: {
    paddingBottom: spacings["spacing-4"],
  },
});
