import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";
import { shadowStyle } from "react-native-fast-shadow";

export default StyleSheet.create({
  dropShadow: {
    ...shadowStyle({
      color: tokens.FreezeCardDropShadow.shadowColor,
      opacity: tokens.FreezeCardDropShadow.shadowOpacity,
      radius: tokens.FreezeCardDropShadow.shadowRadius,
      offset: [tokens.FreezeCardDropShadow.shadowOffset.width, tokens.FreezeCardDropShadow.shadowOffset.height],
    }),
    marginBottom: spacings["spacing-3"],
  },
  freezeCard: {
    backgroundColor: tokens.FreezeCardDefaultBackgroundColour,
    ...tokens.FreezeCardDefaultBorder,
    ...tokens.FreezeCardBorderRadius,
  },
  freezeCardFinished: {
    backgroundColor: tokens.FreezeCardFinishedBackgroundColour,
    ...tokens.FreezeCardFinishedBorder,
  },
  freezeCardSuspended: {
    backgroundColor: tokens.FreezeCardSuspendedBackgroundColour,
    ...tokens.FreezeCardSuspendedBorder,
  },
  freezeCardIneligible: {
    backgroundColor: tokens.FreezeCardIneligibleBackgroundColour,
    ...tokens.FreezeCardIneligibleBorder,
  },
  freezeCardActive: {
    backgroundColor: tokens.FreezeCardActiveBackgroundColour,
    ...tokens.FreezeCardActiveBorder,
  },
  freezeCardSelected: {
    backgroundColor: tokens.FreezeCardSelectedBackgroundColour,
    ...tokens.FreezeCardSelectedBorder,
  },
  top: {
    ...tokens.FreezeCardTopPadding,
  },
  divider: {
    width: "100%",
    height: tokens.DividerContainerSizing,
    backgroundColor: tokens.FreezeCardDividerColour,
    ...tokens.DividerBorderRadius,
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...tokens.FreezeCardVerticalGap,

    ...tokens.FreezeCardBottomPadding,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    ...tokens.FreezeCardHorizontalGapSecondary,
  },
  dynamic: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexShrink: 1,

    ...tokens.FreezeCardHorizontalGap,
  },
  icon: {
    width: tokens.FreezeCardIconSizing,
    height: tokens.FreezeCardIconSizing,
  },
  label: {
    ...tokens.FreezeCardLabelTypography,
    color: tokens.FreezeCardDefaultTextLabelColour,
    flexShrink: 1,
  },
  labelFinished: {
    color: tokens.FreezeCardFinishedTextLabelColour,
  },
  labelSuspended: {
    color: tokens.FreezeCardSuspendedTextLabelColour,
  },
  labelIneligible: {
    color: tokens.FreezeCardIneligibleTextLabelColour,
  },
  labelActive: {
    color: tokens.FreezeCardActiveTextLabelColour,
  },
  labelSelected: {
    color: tokens.FreezeCardSelectedTextLabelColour,
  },
  contentText: {
    ...tokens.FreezeCardContentTextTypography,
    color: tokens.FreezeCardDefaultTextContentTextColour,
  },
  contentTextFinished: {
    color: tokens.FreezeCardFinishedTextContentTextColour,
  },
  contentTextSuspended: {
    color: tokens.FreezeCardSuspendedTextContentTextColour,
  },
  contentTextIneligible: {
    color: tokens.FreezeCardIneligibleTextContentTextColour,
  },
  contentTextActive: {
    color: tokens.FreezeCardActiveTextContentTextColour,
  },
  contentTextSelected: {
    color: tokens.FreezeCardSelectedTextContentTextColour,
  },
  statusLabel: {
    marginLeft: "auto",
  },
});
