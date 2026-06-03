import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export const defaultStyleSheet = StyleSheet.create({
  mainText: {
    ...typography["typography-h280"],
    color: colors.NeutralsTextDefault,
  },
  secondaryText: {
    ...typography["typography-h120"],
    color: colors.NeutralsTextSecondary,
  },
  iconContainer: {
    marginTop: spacings["spacing-1"],
  },
});

export const leftStyleSheet = StyleSheet.create({
  ...defaultStyleSheet,
  container: {
    flexDirection: "row",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentFormContainer: {
    flex: 1,
    marginLeft: spacings["spacing-3"],
  },
  extraTime: {
    ...defaultStyleSheet.secondaryText,
    paddingLeft: spacings["spacing-1"],
  },
  penaltiesScore: {
    ...defaultStyleSheet.secondaryText,
    marginRight: spacings["spacing-1"],
  },
  recentFormOpponent: {
    ...defaultStyleSheet.secondaryText,
    color: colors.NeutralsTextDefault,
  },
  recentFormLabel: {
    ...defaultStyleSheet.secondaryText,
  },
});

export const rightStyleSheet = StyleSheet.create({
  ...defaultStyleSheet,
  container: {
    flexDirection: "row-reverse",
  },
  scoreContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  recentFormContainer: {
    flex: 1,
    marginRight: spacings["spacing-3"],
  },
  extraTime: {
    ...defaultStyleSheet.secondaryText,
    paddingRight: spacings["spacing-1"],
  },
  penaltiesScore: {
    ...defaultStyleSheet.secondaryText,
    marginLeft: spacings["spacing-1"],
  },
  recentFormOpponent: {
    ...defaultStyleSheet.secondaryText,
    textAlign: "right",
    color: colors.NeutralsTextDefault,
  },
  recentFormLabel: {
    ...defaultStyleSheet.secondaryText,
    textAlign: "right",
  },
});
