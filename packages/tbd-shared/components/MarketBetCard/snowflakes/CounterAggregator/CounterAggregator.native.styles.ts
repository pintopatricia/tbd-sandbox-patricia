import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  headerContainer: {
    ...tokens.CounterAggregatorVerticalGap,
    justifyContent: "center",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.CounterAggregatorVerticalGap.gap,
  },
  contentTop: {
    ...tokens.CounterAggregatorHorizontalGapSecondary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    ...tokens.CounterAggregatorTitleTypography,
    color: tokens.CounterAggregatorTextTitleColour,
    bottom: 1,
  },
  subtitle: {
    ...tokens.CounterAggregatorContentTextTypography,
    color: tokens.CounterAggregatorTextContentTextColour,
  },
  button: {
    alignSelf: "flex-end",
  },
});
