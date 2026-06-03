import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  sectionHeader: {
    ...tokens.SectionHeaderVerticalGap,
    backgroundColor: tokens.SectionHeaderBackgroundColour,
  },
  title: {
    color: tokens.SectionHeaderTitleColour,
    ...tokens.SectionHeaderTitlePadding,
    ...tokens.SectionHeaderTitleTypography,
  },
});
