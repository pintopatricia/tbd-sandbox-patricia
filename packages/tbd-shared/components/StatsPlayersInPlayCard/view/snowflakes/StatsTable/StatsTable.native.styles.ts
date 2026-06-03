import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  tableContainer: {
    ...tokens.StatsTableCardGap,
  },
  genericTableContainer: {
    flex: 0,
  },
  tableHeaderText: {
    ...tokens.TableHeaderCellLabel,
    color: tokens.TableHeaderCellColourLabel,
  },
  playerNameAndTeamContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
    ...tokens.TableRowGap,
    width: "100%",
  },
  playerName: {
    ...tokens.TableRowTitleTypography,
    color: tokens.TableRowDefaultTitleColor,
  },
  teamName: {
    ...tokens.TableRowLabelTypography,
    color: tokens.TableRowDefaultLabelColor,
  },
  total: {
    ...tokens.TableRowContentTextTypography,
    color: tokens.TableRowDefaultContentTextColor,
  },
  tableCell: {
    backgroundColor: tokens.TableBodyRowDefaultBackgroundColor,
  },
  tableCellFirstChild: {
    flexBasis: tokens.StatsTableRowCellContentTitleMediumSizing,
  },
  tableRowSpacing: {
    height: tokens.TableBodyVerticalGap.gap,
    backgroundColor: "transparent",
  },
});
