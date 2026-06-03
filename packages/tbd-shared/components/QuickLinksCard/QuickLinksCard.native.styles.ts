import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { shadowStyle } from "react-native-fast-shadow";

export default StyleSheet.create({
  title: {
    ...tokens.QuickLinkCardTitleTypography,
    color: tokens.QuickLinkCardTitleColour,
  },
  container: {
    ...tokens.QuickLinkCardTitleGap,
  },
  listContainer: {
    overflow: "hidden",
    ...tokens.QuickLinkBorderRadius,
  },
  primaryList: {
    ...tokens.QuickLinkCardGap,
  },
  shadow: {
    ...shadowStyle({
      color: tokens.QuickLinkDropShadow.shadowColor,
      opacity: tokens.QuickLinkDropShadow.shadowOpacity,
      radius: tokens.QuickLinkDropShadow.shadowRadius,
      offset: [tokens.QuickLinkDropShadow.shadowOffset.width, tokens.QuickLinkDropShadow.shadowOffset.height],
    }),
  },
  icon: {
    height: tokens.QuickLinkIconSizing,
    width: tokens.QuickLinkIconSizing,
  },
});
