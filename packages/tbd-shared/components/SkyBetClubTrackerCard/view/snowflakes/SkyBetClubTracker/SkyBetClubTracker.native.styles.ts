import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    display: "flex",
    ...tokens.BannerCardDefaultBorder,
    ...tokens.BannerCardBorderRadius,
    gap: tokens.BannerCardGap.gap,
    paddingTop: tokens.BannerCardPadding.paddingTop,
    paddingRight: tokens.BannerCardPadding.paddingRight,
    paddingBottom: tokens.BannerCardPadding.paddingBottom,
    paddingLeft: tokens.BannerCardPadding.paddingLeft,
    backgroundColor: tokens.BannerCardBackgroundColour,
  },
  topContainer: {
    display: "flex",
    gap: tokens.BannerCardTrackerSectionVerticalGapPrimary.gap,
  },
  trackingCounter: {
    flex: 1,
    flexWrap: "nowrap",
  },
  trackingCounterValueIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.TrackingBarEnhancedTrackingCounterIconSizing,
    height: tokens.TrackingBarEnhancedTrackingCounterIconSizing,
  },
  trackingCounterValue: {
    ...tokens.TrackingBarEnhancedTrackingCounterContentTextTypography,
    minWidth: tokens.TrackingBarEnhancedTrackingCounterSizing,
    textAlign: "center",
    fontWeight: "bold",
  },
  notJoinedStateLabel: {
    color: tokens.TrackingBarEnhancedTrackingCounterNoTrackingLabelColour,
  },
  joinedStateLabel: {
    color: tokens.TrackingBarEnhancedTrackingCounterValueTrackingLabelColour,
  },
  supportingText: {
    ...tokens.BannerCardSupportingTextTypography,
    color: tokens.BannerCardTextSupportingTextColour,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.BannerCardTrackerSectionVerticalGapPrimary.gap,
  },
  logoIconContainer: {
    display: "flex",
    justifyContent: "center",
  },
  logoIcon: {
    width: tokens.BannerCardTrackerSectionIconWidthSizing,
    height: tokens.BannerCardTrackerSectionIconHeightSizing,
  },
  logoTextContainer: {
    display: "flex",
    justifyContent: "center",
    gap: tokens.BannerCardTrackerSectionVerticalGapSecondary.gap,
    flexShrink: 1,
  },
  logoTextSecondLineContainer: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.BannerCardTrackerSectionHorizontalGapSecondary.gap,
    alignItems: "center",
  },
  contentText: {
    ...tokens.BannerCardContentTextTypography,
    color: tokens.BannerCardTextContentTextColour,
  },
  highlightedText: {
    ...tokens.BannerCardContentTextHighlightedTypography,
    fontWeight: "bold",
  },
});
