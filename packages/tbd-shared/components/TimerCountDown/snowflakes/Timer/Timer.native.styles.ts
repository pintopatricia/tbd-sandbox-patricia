import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export const styles = StyleSheet.create({
  timerContainer: {
    ...tokens.TimerHorizontalGap,
    alignItems: "center",
    width: "auto",
  },
  countDownTimer: {
    ...tokens.TimerHorizontalGap,
    flexDirection: "row",
  },
  timerTopLabel: {
    ...tokens.TimerTitleTypography,
    color: tokens.TimerTitleColour,
  },
  timerSign: {
    ...tokens.TimerLabelTypography,
    ...tokens.TimerPadding,
    color: tokens.TimerTitleColour,
  },
});
