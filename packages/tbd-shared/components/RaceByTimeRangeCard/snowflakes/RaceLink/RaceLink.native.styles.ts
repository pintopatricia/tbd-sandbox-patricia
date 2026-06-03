import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    width: tokens.RaceLinkWidthSizing,
    alignItems: "center",
    backgroundColor: tokens.RaceLinkBackgroundColour,
    ...tokens.RaceLinkPadding,
    ...tokens.RaceLinkHorizontalGap,
    ...tokens.RaceLinkBorder,
    ...tokens.RaceLinkBorderRadius,
    ...tokens.RaceLinkDropShadow,
  },
  detailed: {
    minHeight: tokens.RaceLinkDetailedHeightSizing,
  },
  grid: {
    width: "100%",
  },
  raceTitle: {
    color: tokens.RaceLinkLabelColour,
    ...tokens.RaceLinkLabelTypography,
  },
  textWrapper: {
    alignSelf: "flex-start",
    flexShrink: 1,
  },
  subtitle: {
    color: tokens.RaceLinkSupportingTextColour,
    ...tokens.RaceLinkSupportingTextTypography,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  iconWrapper: {
    display: "flex",
    ...tokens.RaceLinkIconVerticalGap,
  },
  icon: {
    height: tokens.RaceLinkIconSizing,
    width: tokens.RaceLinkIconSizing,
  },
});
