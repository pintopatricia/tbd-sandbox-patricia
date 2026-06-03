import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  miniBanner: {
    flexDirection: "column",
    ...tokens.PromoBannerVerticalGapPrimary,
    width: "100%",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: tokens.SmSpacingXSmall,
    padding: tokens.SmSpacingXSmall,
    width: "100%",
    backgroundColor: tokens.SmColoursSurfaceStaticBrandPrimaryBase,
    ...tokens.SmBorderRadiusDefault,
    ...tokens.SmDropShadowSmall,
  },
  leftIcon: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    maxWidth: 40,
    maxHeight: 80,
    overflow: "hidden",
    width: 24,
    height: 48,
  },
  rightChevron: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    maxWidth: 62,
    maxHeight: 80,
    overflow: "hidden",
    width: 24,
    height: 48,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    flexDirection: "column",
    justifyContent: "center",
    gap: tokens.SmSpacingXxxSmall,
    minWidth: 0,
    minHeight: 54,
  },
  brandTitle: {
    ...tokens.SmBodyMediumBrand,
    maxHeight: 16,
    alignSelf: "stretch",
    color: tokens.MiniBannerDefaultTitleColour,
  },
  title: {
    ...tokens.SmBodySmallStrong,
    color: tokens.MiniBannerDefaultTitleColour,
  },
  subText: {
    ...tokens.SmCaptionMediumBase,
    color: tokens.MiniBannerDefaultTitleColour,
  },
});
