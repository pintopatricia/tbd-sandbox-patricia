import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export const styles = StyleSheet.create({
  timeUnit: {
    ...tokens.TimerVerticalGap,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  timerDigits: {
    ...tokens.TimerHorizontalGap,
    flexDirection: "row",
    alignItems: "center",
  },
  timerLabel: {
    ...tokens.TimerLabelTypography,
    ...tokens.TimerPadding,
    color: tokens.TimerLabelColour,
    alignItems: "center",
    width: tokens.TimerLabelWidth,
  },
  timerBorder: {
    ...tokens.TimerBorderRadius,
    ...tokens.TimerPadding,
    flexDirection: "row",
    backgroundColor: tokens.TimerBackgroundColour,
  },
  text: {
    ...tokens.TimerSupportingTextTypography,
    color: tokens.TimerSupportingTextColour,
    textAlign: "center",
  },
});
