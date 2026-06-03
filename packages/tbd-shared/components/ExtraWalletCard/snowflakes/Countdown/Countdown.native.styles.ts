import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  countdown: {
    ...tokens.CountdownContentTextDefaultTypography,
    color: tokens.CountdownContentTextDefaultColour,
  },
  alert: {
    ...tokens.CountdownContentTextAlertTypography,
    color: tokens.CountdownContentTextAlertColour,
  },
});
