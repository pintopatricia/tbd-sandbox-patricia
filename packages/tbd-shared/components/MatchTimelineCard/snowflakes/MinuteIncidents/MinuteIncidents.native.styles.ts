import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  incidentsTimeline: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  minuteContainerSeparator: {
    width: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.SignpostingInplayBorderDisabled,
    paddingBottom: spacings["spacing-1"],
    alignSelf: "center",
  },
  timeLabel: {
    color: colors.SignpostingInplayTextDefault,
    textAlign: "center",
    paddingTop: spacings["spacing-1"],
    ...typography["typography-h158"],
  },
  extraTimeLabel: {
    color: colors.SignpostingInplayTextDisabled,
    textAlign: "center",
    opacity: 0.5,
    ...typography["typography-h120"],
  },
  minuteContainer: {
    alignSelf: "center",
    marginHorizontal: spacings["spacing-2"],
    flexShrink: 0,
    flexGrow: 1,
    width: 28,
    maxWidth: 28,
  },
  notificationIncident: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginTop: spacings["spacing-2"],
  },
  homeIncident: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacings["spacing-2"],
  },
  awayIncident: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: spacings["spacing-2"],
  },
  sideNotification: {
    flexGrow: 3,
    flexShrink: 1,
  },
  middleNotification: {
    flexGrow: 1,
  },
  firstRowNotification: {
    marginTop: 0,
  },
  symmetricClone: {
    opacity: 0,
    flexGrow: 3,
    flexShrink: 1,
  },
});
