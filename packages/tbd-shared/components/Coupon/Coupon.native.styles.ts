import { StyleSheet } from "react-native";
import { tokens, heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  couponSupportingContentButton: {
    ...tokens.CouponSupportingContentButtonBorderRadius,
  },

  couponEventScoreContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...tokens.CouponPadding,
    gap: tokens.CouponHorizontalGapPrimary.gap,
  },

  fixtureHeaderContainer: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: "center",
  },

  betButtonsContainer: {
    flexDirection: "row",
    gap: 1,
    minHeight: heights["bet-button-height"],
  },
  statsContainer: {
    backgroundColor: tokens.StatsBackgroundColour,
  },
});
