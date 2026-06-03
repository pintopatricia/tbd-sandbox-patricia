import { StyleSheet } from "react-native";

import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  sheetWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    backgroundColor: tokens.PlaceFooterBackgroundColour,
    overflow: "hidden",
  },
  sheetHeader: {
    paddingVertical: 12,
    backgroundColor: tokens.ExpandableHeaderBackgroundColour,
    ...tokens.ExpandableBorderRadius,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flex: 1,
    minWidth: 0,
  },
  minimizedTitle: {
    ...tokens.MinimisedTitleTypography,
    color: tokens.MinimisedTitleColour,
    opacity: 1,
  },
  titleOpaquePart: {
    color: `${tokens.MinimisedTitleColour}CC`,
  },
  headerAction: {
    ...tokens.ExpandableIconPadding,
  },
  headerDetails: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacings["spacing-2"],
  },
  // If the Quick Betslip becomes a feature, we should request tokens for it
  headerDetailsInfo: {
    flex: 1,
    fontFamily: "Sky Text",
    fontWeight: "400",
    lineHeight: 20,
    fontSize: 14,
    letterSpacing: 0,
    textTransform: "none",
    textDecorationLine: "none",
    color: tokens.MinimisedSupportingTextColour,
  },
  // If the Quick Betslip becomes a feature, we should request tokens for it
  subtitleBoldPart: {
    fontFamily: "Sky Text",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: 14,
    letterSpacing: 0,
    textTransform: "none",
    textDecorationLine: "none",
    color: tokens.MinimisedTitleColour,
  },
  // If the Quick Betslip becomes a feature, we should request tokens for it
  headerDetailsMore: {
    fontFamily: "Sky Text",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: 12,
    letterSpacing: 0,
    textTransform: "none",
    textDecorationLine: "none",
    color: tokens.MinimisedSupportingTextColour,
    marginLeft: 4,
  },
  keyboardContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  keyboardContent: {
    marginTop: 16,
  },
  notifier: {
    marginBottom: 8,
  },
  oddsMovementAlertContainer: {
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  sheetContent: {
    overflow: "hidden",
  },
  sheetContentWithNotifier: {
    ...tokens.PlaceFooterPadding,
  },
  quickStakesContainer: {
    paddingVertical: spacings["spacing-2"],
  },
  betSummaryContainer: {
    ...tokens.PlaceFooterPadding,
  },
  sheetFooter: {
    flexDirection: "row",
    paddingHorizontal: spacings["spacing-2"],
    ...tokens.BetControlsVerticalGap,
    overflow: "hidden",
  },
  sheetFooterWithoutNotification: {
    paddingTop: spacings["spacing-2"],
  },
  stakeInput: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacings["spacing-2"],
  },
  currencyNumberInputFieldStakeInput: {
    minHeight: 48,
  },
  placeButton: {
    flex: 1,
  },
  actionIcon: {
    width: tokens.ExpandableIconSizing,
    height: tokens.ExpandableIconSizing,
  },
  minimizedSupportingText: {
    ...tokens.MinimisedSupportingTextTypography,
    color: tokens.MinimisedSupportingTextColour,
  },
});
