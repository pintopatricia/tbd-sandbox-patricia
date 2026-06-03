import { StyleSheet } from "react-native";
import { colors, heights, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  matchTimelineCondensed: {
    justifyContent: "center",
    height: heights["supporting-content-preview-height"],
    padding: spacings["spacing-2"],
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineContainerCondensed: {
    marginRight: spacings["spacing-8"],
  },
  teamCrests: {
    alignItems: "center",
    marginRight: spacings["spacing-1"],
  },
  teamCrest: {
    height: heights["icon-size-small"],
    width: heights["icon-size-small"],
  },
  homeTeamCondensed: {
    marginBottom: spacings["spacing-2"],
  },
  prematch: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
    padding: spacings["spacing-1"],
  },
  timelines: {
    flexDirection: "row",
    flexShrink: 1,
  },
  timelineCondensed: {
    marginRight: spacings["spacing-1"],
  },
  lastIncident: {
    marginTop: spacings["spacing-3"],
  },
});
