import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    ...tokens.SettlementConditionCardVerticalGap,
    ...tokens.SettlementConditionCardPadding,
    backgroundColor: tokens.SettlementConditionCardBackgroundColour,
    ...tokens.SettlementConditionCardBorderRadius,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.SettlementConditionCardHorizontalGap,
  },
  title: {
    ...tokens.SettlementConditionCardLabelTypography,
    color: tokens.SettlementConditionCardLabelColour,
  },
  label: {
    ...tokens.SettlementConditionCardLabelTypography,
    color: tokens.SettlementConditionCardLabelColour,
  },
});
