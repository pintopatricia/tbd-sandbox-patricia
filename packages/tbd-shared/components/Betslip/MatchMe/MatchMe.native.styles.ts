import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.OptionHorizontalGapPrimary.gap,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.SmSpacingXSmall,
    flex: 1,
  },
  infoIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: tokens.SmSizingAssetsMedium,
    height: tokens.SmSizingAssetsMedium,
  },
  textContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  label: {
    ...tokens.RichTextContentTextHighlightedTypography,
    color: tokens.RichTextTextContentTextColour,
  },
  oddsRange: {
    ...tokens.RichTextCaptionSupportingTextTypography,
    color: tokens.RichTextCaptionTextSupportingTextColour,
  },
});
