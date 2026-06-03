import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  timesBackedContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.TimesBackedHorizontalGapPrimary,
  },
  timesBackedLabel: {
    flexDirection: "row",
    ...tokens.TimesBackedHorizontalGapSecondary,
    ...tokens.TimesBackedLabelTypography,
    color: tokens.TimesBackedTextLabelColour,
  },
  timesBackedCount: {
    ...tokens.TimesBackedLabelHighlightedTypography,
    color: tokens.TimesBackedTextLabelHighlightedColour,
  },
  timesBackedIcon: {
    alignSelf: "center",
    height: tokens.TimesBackedIconSizing,
    width: tokens.TimesBackedIconSizing,
  },
});
