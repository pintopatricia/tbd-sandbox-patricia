import { StyleSheet } from "react-native";
import { colors, spacings, heights, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  title: {
    ...typography["typography-h380"],
    color: colors.NeutralsTextDefault,
    paddingVertical: spacings["spacing-2"],
  },
  racingResultHeaders: {
    flexDirection: "row",
    paddingVertical: spacings["spacing-3"],
  },
  staticCell: {
    width: 36,
  },
  positionCell: {
    width: 44,
  },
  cell: {
    flexGrow: 1,
    flexBasis: 1,
  },
  runnerInfoCell: {
    flexGrow: 3,
    flexBasis: 3,
  },
  lastCell: {
    textAlign: "right",
  },
  headerText: {
    ...typography["typography-h098"],
    textTransform: "uppercase",
    color: colors.NeutralsTextDisabled,
  },
  racingResultRow: {
    flexDirection: "row",
    paddingTop: spacings["spacing-2"],
  },
  positionBox: {
    alignSelf: "flex-start",
    maxWidth: 38,
    height: heights["results-table-position-size"],
    paddingHorizontal: spacings["spacing-1"],
    borderRadius: 2,
    backgroundColor: colors.NeutralsBackgroundElevation5,
  },
  positionLabel: {
    ...typography["typography-h158"],
    textAlign: "center",
    color: colors.NeutralsTextDefault,
    textTransform: "uppercase",
  },
  distanceLabel: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
  },
  startingPriceLabel: {
    ...typography["typography-h152"],
    textAlign: "right",
    color: colors.NeutralsTextDefault,
  },
  favLabel: {
    ...typography["typography-h120"],
    textAlign: "right",
    color: colors.NeutralsTextSecondary,
  },
  runnerInfoContainer: {
    flexDirection: "row",
    paddingRight: spacings["spacing-4"],
  },
  runnerLine: {
    flexShrink: 1,
    flexDirection: "row",
  },
  silkContainer: {
    width: 25,
    height: 20,
    marginLeft: spacings["spacing-2"],
  },
  silk: {
    width: 25,
    height: 20,
    overflow: "visible",
  },
  leftColumn: {
    display: "flex",
    alignItems: "center",
    marginLeft: spacings["spacing-2"],
    marginRight: spacings["spacing-1"],
    minWidth: 24,
  },
  saddleCloth: {
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
    textAlign: "center",
  },
  drawNumber: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
  },
  horseInformation: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
    paddingRight: spacings["spacing-4"],
    textTransform: "capitalize",
  },
  runnerInfoInline: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
    paddingRight: spacings["spacing-4"],
  },
  winnerRibbonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
  tableInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacings["spacing-1"],
  },
  infoIcon: {
    width: 14,
    height: 14,
    marginRight: spacings["spacing-2"],
  },
  ranLabel: {
    ...typography["typography-h082"],
    color: colors.NeutralsTextSecondary,
  },

  dnfsBoard: {
    flexDirection: "row",
    marginTop: spacings["spacing-2"],
    padding: spacings["spacing-2"],

    backgroundColor: colors.MessagingInfoBackgroundElevation1,
    borderRadius: 4,
  },

  dnfInfoIcon: {
    alignSelf: "center",
    width: heights["icon-size"],
    height: heights["icon-size"],
    marginRight: spacings["spacing-2"],
    marginLeft: spacings["spacing-half"],
  },

  dnfCodesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dnfItem: {
    flexDirection: "row",
    paddingRight: spacings["spacing-3"],
  },

  dnfCode: {
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
  },
  dnfValue: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
    marginLeft: spacings["spacing-1"],
  },
});
