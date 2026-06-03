import { heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  icon: {
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
  notificationToggleContainer: {
    margin: spacings["spacing-4"],
  },
  toggleContainer: {
    ...tokens.NotificationsSubscriptionPadding,
    backgroundColor: tokens.NotificationsSubscriptionBackgroundColour,
    ...tokens.NotificationsSubscriptionBorderRadius,
  },
  eventOptionContainer: {
    ...tokens.NotificationsSubscriptionPadding,
  },
  eventListContainer: {
    backgroundColor: tokens.NotificationsSubscriptionBackgroundColour,
    ...tokens.NotificationsSubscriptionBorderRadius,
    ...tokens.CardVerticalGap,
  },
  headerContentContainer: {
    ...tokens.BottomSheetHeaderVerticalGap,
  },
});
