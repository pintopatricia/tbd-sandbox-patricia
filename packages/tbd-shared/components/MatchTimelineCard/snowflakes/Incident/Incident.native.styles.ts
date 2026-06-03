import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    ...tokens.IncidentHorizontalGapSmall,
  },
  reverse: {
    flexDirection: "row-reverse",
  },
  wrapContainer: {
    flexDirection: "row",
    flex: 1,
    ...tokens.IncidentHorizontalGap,
    alignItems: "center",
  },
  wrapContainerLines: {
    gap: 0, // Remove gap when display order is lines
    flexDirection: "column-reverse",
    alignItems: "stretch",
  },
  minute: {
    color: tokens.IncidentTextContentTextColour,
    ...tokens.IncidentContentTextTypography,
  },
  minuteReverse: {
    textAlign: "right",
  },
  player: {
    color: tokens.IncidentTextLabelColour,
    ...tokens.IncidentLabelTypography,
    flexShrink: 1,
  },
  playerReverse: {
    textAlign: "right",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
