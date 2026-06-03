import { Dimensions, StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

const halfScreenHeight = Dimensions.get("window").height / 2;

export default StyleSheet.create({
  gameInfoContainer: {
    width: "100%",
    height: "100%",
    ...tokens.GameInfoVerticalGapPrimary,
  },

  heroContainer: {
    height: halfScreenHeight,
    width: "100%",
  },

  tileFlattenedImageBackground: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  tileGradient: {
    height: "100%",
    width: "100%",
    experimental_backgroundImage: tokens.GameInfoThumbnailGradientColour,
  },

  tileItems: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    ...tokens.GameInfoThumbnailPadding,
  },

  jackpotLogo: {
    // TODO: Implement CustomLogo component in Native
    width: tokens.CustomLogoGameInfoCustomLogoSizing,
    height: tokens.CustomLogoGameInfoCustomLogoSizing,
  },

  jackpotLogoImg: {
    width: "100%",
    height: "100%",
  },

  gameDetailsContainer: {
    alignItems: "center",
    ...tokens.GameInfoVerticalGapSecondary,
  },

  jackpotRibbon: {
    height: tokens.BadgeGameInfoJackpotHeightSizing,
    width: tokens.BadgeGameInfoJackpotWidthSizing,
    ...tokens.JackpotSmallDropShadow,
  },

  jackpotBadge: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    ...tokens.BadgeGameInfoPadding,
  },

  jackpotBadgeValue: {
    textAlign: "center",
    color: tokens.BadgeJackpotLabelColour,
    ...tokens.BadgeGameInfoLabelTypography,
    ...tokens.BadgeGameInfoPadding,
  },

  extraInfoDetails: {
    ...tokens.GameInfoVerticalGapTertiary,
  },

  textRtp: {
    alignSelf: "center",
    color: tokens.GameInfoTextContentTextColour,
    ...tokens.GameInfoContentTextTypography,
  },

  textInfo: {
    alignSelf: "center",
    textAlign: "center",
    color: tokens.GameInfoTextContentTextHighlightedColour,
    ...tokens.GameInfoContentTextHighlightedTypography,
  },

  copyrightTitle: {
    textAlign: "center",
    color: tokens.GameInfoTextSupportingTextColour,
    ...tokens.GameInfoSupportingTextTypography,
  },

  howToPlayDetails: {
    ...tokens.GameInfoTextPadding,
  },

  richText: {
    ...tokens.RichTextPadding,
    ...tokens.RichTextVerticalGap,
  },

  howToPlayTextTitle: {
    color: tokens.RichTextTextTitleColour,
    ...tokens.GameInfoTitleTypography,
  },
});
