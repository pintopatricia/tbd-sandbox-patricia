import { StyleSheet } from "react-native";
import { colors, heights, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacings["spacing-6"],
  },
  fullResultsLabel: {
    ...typography["typography-h098"],
    color: colors.NeutralsTextDisabled,
  },
  refreshIcon: {
    width: heights["icon-size-small"],
    height: heights["icon-size-small"],
    marginLeft: spacings["spacing-1"],
  },
  cardContainer: {
    marginHorizontal: spacings["spacing-3"],
  },
  infoWrapper: {
    flexDirection: "column",
  },
  winningAndBspTitle: {
    ...typography["typography-h380"],
    marginTop: spacings["spacing-6"],
    marginBottom: spacings["spacing-4"],
    color: colors.NeutralsTextDefault,
  },
  winningTimeLabel: {
    ...typography["typography-h098"],
    paddingTop: spacings["spacing-1"],
    color: colors.NeutralsTextSecondary,
  },
  bspAdvantageLabel: {
    ...typography["typography-h098"],
    paddingTop: spacings["spacing-1"],
    color: colors.NeutralsTextSecondary,
  },
  winningTime: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
    paddingTop: spacings["spacing-1"],
  },
  bspAdvantage: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
    paddingTop: spacings["spacing-1"],
  },
});
