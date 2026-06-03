import { StyleSheet } from "react-native";
import { colors, spacings, heights, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betButton: {
    position: "absolute",
    width: "100%",
    minWidth: heights["bet-button-width"],
    height: "100%",
    paddingVertical: spacings["spacing-1"],
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    color: colors.NeutralsTextDefault,
    overflow: "hidden",
  },
  secondaryLabelContainer: {
    flexDirection: "row",
    paddingHorizontal: spacings["spacing-half"],
  },
  secondaryLabel: {
    flexShrink: 1,
  },
  secondaryLabelHandicap: {
    ...typography["typography-h082"],
    marginLeft: spacings["spacing-1"],
  },
  lineThrough: {
    textDecorationLine: "line-through",
  },
  white: {
    color: colors.NeutralsTextDefault,
  },
  sportsbook: {
    color: colors.ActionSportsbookTextSecondary,
  },
  sportsbookClosed: {
    color: colors.NeutralsTextDefault,
  },
  exchangeBack: {
    color: colors.ActionExchangeBackTextDefault,
  },
  exchangeLay: {
    color: colors.ActionExchangeLayTextDefault,
  },
  oddsBoost: {
    color: colors.SignpostingGenerosityTextDefault,
  },
  outerContainer: { flex: 1 },
  icon: {
    flexShrink: 0,
    width: heights["icon-size"],
    height: heights["icon-size"],
    marginRight: spacings["spacing-2"],
  },
  horizontalBetButton: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: spacings["spacing-2"],
  },
});
