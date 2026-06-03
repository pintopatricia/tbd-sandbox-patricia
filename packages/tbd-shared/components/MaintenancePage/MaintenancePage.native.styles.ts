import { Dimensions, StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export const splashedStyles = StyleSheet.create({
  container: {
    ...tokens.PartialSplashingPagePadding,
  },
  containerContent: {
    paddingBottom: tokens.PartialSplashingPagePadding.paddingVertical,
    ...tokens.PartialSplashingPageVerticalGap,
  },
  wrap: {
    ...tokens.PartialSplashingPageVerticalGap,
  },
  title: {
    ...tokens.PartialSplashingPageTitleTypography,
    color: tokens.PartialSplashingPageTextTitleColour,
  },
  description: {
    ...tokens.PartialSplashingPageContentTextTypography,
    color: tokens.PartialSplashingPageTextContentTextColour,
  },
  links: {
    overflow: "hidden",
    ...tokens.QuickLinkCardGap,
  },
  twitterTitle: {
    ...tokens.PartialSplashingPageContentTextTypography,
    color: tokens.PartialSplashingPageTextContentTextColour,
  },
  twitterWrap: {
    alignSelf: "center",
    height: 620,
    width: 290,
  },
  twitterFrame: {
    backgroundColor: "transparent",
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export const webSplashViewStyles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: Dimensions.get("screen").width / 2,
    top: (Dimensions.get("screen").height - 128) / 2,
  },
  refreshButtonContainer: {
    backgroundColor: tokens.NeutralsBackgroundElevation1,
    padding: 8,
  },
});
