import { StyleSheet } from "react-native";
import { spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";
import { shadowStyle } from "react-native-fast-shadow";

export default StyleSheet.create({
  section: {
    gap: tokens.SectionElementsFooterVerticalGapSecondary.gap,
  },
  sectionElements: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    ...tokens.SectionElementsFooterContentTextTypography,
    color: tokens.SectionElementsFooterTextContentTextColour,
    marginTop: tokens.SectionElementsFooterVerticalGapSecondary.gap,
  },
  sectionTitle: {
    ...tokens.SectionElementsFooterTitleTypography,
    color: tokens.SectionElementsFooterTextTitleColour,

    width: "100%",
  },
  imageSection: {
    paddingRight: tokens.SectionElementsFooterWrapGap.gap,
    paddingBottom: tokens.SectionElementsFooterWrapGap.gap,
  },
  image: {
    height: tokens.SectionElementsFooterLogosSizing,
    width: 100,
  },
  largeImage: {
    height: 90,
  },
  imageSectionStretched: {
    width: "100%",
    paddingBottom: tokens.SectionElementsFooterVerticalGapSecondary.gap,
  },
  quickLinksContainer: {
    width: "100%",
    marginTop: tokens.SectionElementsFooterVerticalGapSecondary.gap,
  },
  quickLinksList: {
    overflow: "hidden",
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
  resetMarginTop: {
    marginTop: 0,
  },
  marginBottom: {
    marginBottom: tokens.SectionElementsFooterVerticalGapSecondary.gap,
  },
  userDetails: {
    width: "100%",
    marginTop: spacings["spacing-2"],
  },
  clockContainer: {
    marginTop: spacings["spacing-3"],
    flexDirection: "column",
    justifyContent: "center",
  },
  clockWithText: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacings["spacing-1"],
    backgroundColor: tokens.NeutralsBackgroundElevation1,
    borderRadius: spacings["spacing-1"],
  },
  clockText: {
    ...typography["typography-h120"],
    marginRight: spacings["spacing-1-and-half"],
    color: tokens.NeutralsTextDefault,
  },
  session: {
    paddingTop: spacings["spacing-4"],
  },
});
