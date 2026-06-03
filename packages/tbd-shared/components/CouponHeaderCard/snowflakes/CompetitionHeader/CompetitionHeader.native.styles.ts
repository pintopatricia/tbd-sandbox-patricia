import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  competitionHeader: {
    display: "flex",
    flexDirection: "row",
    height: tokens.CompetitionHeaderContainerSizing,
    backgroundColor: tokens.CompetitionHeaderDefaultBackgroundColour,
    ...tokens.CompetitionHeaderHorizontalGapPrimary,
    ...tokens.CompetitionHeaderPadding,
  },
  titleLink: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: "center",
    ...tokens.CompetitionHeaderDefaultTitleTypography,
    color: tokens.CompetitionHeaderDefaultTextTitleColour,
    overflow: "hidden",
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    ...tokens.CompetitionHeaderHorizontalGapSecondary,
  },
  column: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.CompetitionHeaderColumnSizing,
    height: "100%",
    borderStyle: tokens.CompetitionHeaderColumnBorder.borderStyle,
    borderLeftColor: tokens.CompetitionHeaderColumnBorder.borderColor,
  },
  columnLabel: {
    ...tokens.CompetitionHeaderContentTextTypography,
    color: tokens.CompetitionHeaderDefaultTextContentTextColour,
  },
  firstColumn: {
    borderLeftColor: "transparent",
  },
  lastColumn: {
    width: tokens.CompetitionHeaderStatsColumnSizing,
  },
});
