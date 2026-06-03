import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.ForbiddenContentBorderRadius.borderRadius,
    gap: tokens.ForbiddenContentVerticalGap.gap,
    ...tokens.ForbiddenContentPadding,
  },
  lock: {
    width: tokens.ForbiddenContentIconSizing,
    height: tokens.ForbiddenContentIconSizing,
  },
  label: {
    ...tokens.ForbiddenContentContentTextTypography,
  },
});

export const lightTheme = StyleSheet.create({
  light: {
    color: tokens.ForbiddenContentTextContentTextColour,
  },
  lightBg: {
    backgroundColor: tokens.ForbiddenContentBackgroundColour,
  },
  link: {
    color: tokens.ForbiddenContentTextLinkColour,
    ...tokens.ForbiddenContentLinkTypography,
  },
});

export const darkTheme = StyleSheet.create({
  dark: {
    color: tokens.ForbiddenContentTextContentTextColour,
  },
  darkBg: {
    backgroundColor: tokens.ForbiddenContentBackgroundColour,
  },
  link: {
    color: tokens.ForbiddenContentTextLinkColour,
    ...tokens.ForbiddenContentLinkTypography,
  },
});

export const cardSize = StyleSheet.create({
  default: {
    height: tokens.ForbiddenContentLargeContainerSizing,
  },
  small: {
    height: tokens.ForbiddenContentSmallContainerSizing,
  },
});
