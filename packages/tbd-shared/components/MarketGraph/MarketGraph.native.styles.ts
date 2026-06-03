import { StyleSheet } from "react-native";

import { spacings, stackings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: tokens.NeutralsBackgroundElevation1,
    zIndex: stackings["modal-stack"],
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: spacings["spacing-7"] * 2, // 52px, similar to FullScreenModal.web
    padding: spacings["spacing-3"],
    backgroundColor: tokens.NeutralsBackgroundElevation1
  },
  headerTitle: {
    ...typography["typography-h152"],
    color: tokens.NeutralsTextDefault
  },
  headerButton: {
    position: "absolute",
    right: spacings["spacing-3"],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: tokens.IconButtonLargeIconSizing,
    height: tokens.IconButtonLargeIconSizing,
  },
  eventMarketInfo: {
    ...tokens.RichTextVerticalGap,
    padding: spacings["spacing-3"],
  },
  eventInfo: {
    ...tokens.RichTextTitleExtraLargeTypography,
    color: tokens.RichTextTextTitleColour,
  },
  marketInfo: {
    color: tokens.RichTextTextContentTextColour,
    ...tokens.RichTextContentTextTypography,
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  marketGraphsWebView: {
    width: "100%",
    height: "100%"
  },
});
