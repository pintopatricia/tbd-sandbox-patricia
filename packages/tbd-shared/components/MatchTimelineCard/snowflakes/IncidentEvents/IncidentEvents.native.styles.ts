import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  incidentColumn: {
    flex: 1,
    ...tokens.IncidentEventsVerticalGap,
  },
  scoreboardVariantHomeColumn: {
    ...tokens.IncidentEventsScoreboardRightPadding,
  },
  scoreboardVariantAwayColumn: {
    ...tokens.IncidentEventsScoreboardLeftPadding,
  },
  defaultVariantHomeColumn: {
    ...tokens.IncidentEventsDefaultRightPadding,
    borderRightColor: tokens.IncidentEventsBorder.borderColor,
    borderRightWidth: tokens.IncidentEventsBorder.borderWidth,
  },
  defaultVariantAwayColumn: {
    ...tokens.IncidentEventsDefaultLeftPadding,
  },
});
