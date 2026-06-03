import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    ...tokens.RegulatoryHeaderPadding,
    ...tokens.RegulatoryHeaderVerticalGap,
    backgroundColor: tokens.RegulatoryHeaderBackgroundColour,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    ...tokens.RegulatoryHeaderVerticalGap,
  },
  textItem: {
    color: tokens.RegulatoryHeaderTextContentTextColour,
    ...tokens.RegulatoryHeaderTextContentTextTypography,
    textAlign: "center",
  },
  linkItemContainer: {
    flexWrap: "nowrap",
    justifyContent: "center",
  },
  linkItem: {
    color: tokens.RegulatoryHeaderTextLinkColour,
    ...tokens.RegulatoryHeaderTextLinkTypography,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexGrow: 1,
    ...tokens.SessionHorizontalGap,
  },
  sessionItemLabel: {
    ...tokens.SessionContentTextTypography,
    color: tokens.SessionTextContentTextColour,
  },
  sessionItemTime: {
    ...tokens.SessionContentTextHighlightedTypography,
    color: tokens.SessionTextContentTextHighlightedColour,
  },
  imageItem: {
    height: tokens.RegulatoryHeaderLogoSizing,
  },
});
