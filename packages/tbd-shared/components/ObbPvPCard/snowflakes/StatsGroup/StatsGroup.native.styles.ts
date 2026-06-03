import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

// TODO CHANGE TOKENS
export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    display: "flex",
    ...tokens.StatsGroupHorizontalGap,
  },
  progressBar: {
    flexShrink: 1,
    flexGrow: 1,
    height: tokens.ProgressBarBarContainerSizing,
  },
  statZone: {
    flexDirection: "row",
    flexShrink: 1,

    alignItems: "center",
  },
  statZoneLabel: {
    minWidth: tokens.StatsGroupLabelSizing,
    color: tokens.StatsGroupLabelColour,
    ...tokens.StatsGroupLabelTypography,
  },
  statZonePlaceholder: {
    ...tokens.StatsGroupPlaceholderHorizontalGap,
  },
  statZoneLabelPlaceholder: {
    width: tokens.StatsGroupPlaceholderWidthSizing,
    height: tokens.StatsGroupPlaceholderHeightSizing,
    flexShrink: 0,
    flexGrow: 0,
    ...tokens.StatsGroupPlaceholderBorderRadius,
  },

  mainLabel: {
    color: tokens.StatsGroupLabelColour,
    ...tokens.StatsGroupLabelTypography,
  },

  secondaryLabel: {
    color: tokens.StatsGroupSupportingContentTextColour,
    ...tokens.StatsGroupSupportingContentTypography,
  },

  disabled: {
    color: tokens.StatsGroupDisabledLabelColour,
  },

  inverted: {
    textAlign: "right",
  },

  textZone: {
    flexDirection: "column",

    alignItems: "center",

    textAlign: "center",
  },
  placeholder: {
    width: "100%",
    height: "100%",
  },
  textZonePlaceholder: {
    ...tokens.StatsGroupPlaceholderVerticalGap,
  },
  mainLabelPlaceholder: {
    width: tokens.StatsGroupPlaceholderWidthSizing,
    height: tokens.StatsGroupPlaceholderHeightSizing,
    ...tokens.StatsGroupPlaceholderBorderRadius,
  },
  secondaryLabelPlaceholder: {
    width: tokens.StatsGroupPlaceholderSupportingContentWidthSizing,
    height: tokens.StatsGroupPlaceholderSupportingContentHeightSizing,
    ...tokens.StatsGroupPlaceholderBorderRadius,
  },
});
