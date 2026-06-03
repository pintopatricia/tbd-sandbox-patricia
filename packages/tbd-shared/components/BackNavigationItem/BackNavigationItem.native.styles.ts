import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.PageHeaderPadding,
    ...tokens.PageHeaderVerticalGap,
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
  },
  backButton: {
    height: tokens.PageHeaderIconSizing,
    width: tokens.PageHeaderIconSizing,
  },
  content: {
    width: "90%",
    ...tokens.BetTitleTitleTypography,
    textTransform: "uppercase",
    color: tokens.PrimaryButtonPrimaryDefaultTextLabelColour,
  },
});
