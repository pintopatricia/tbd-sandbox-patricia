import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

const SILK_WIDTH = 57;
const SILK_HEIGHT = 46;

export default StyleSheet.create({
  runnerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  silk: {
    width: SILK_WIDTH,
    height: SILK_HEIGHT,
    marginRight: spacings["spacing-4"],
  },
  runnerContainer: {
    flex: 1,
    overflow: "hidden",
  },
  runner: {
    paddingBottom: spacings["spacing-1"],
    overflow: "hidden",
  },
  jockeyContainer: {
    ...typography["typography-h152"],
    flexDirection: "row",
    paddingBottom: spacings["spacing-half"],
  },
  trainerContainer: {
    ...typography["typography-h152"],
    flexDirection: "row",
  },
  runnerTitleAttribute: {
    ...typography["typography-h380"],
    paddingRight: spacings["spacing-1"],
    color: colors.NeutralsTextDefault,
    flexShrink: 1,
  },
  runnerAttributeLabel: {
    ...typography["typography-h152"],
    paddingRight: spacings["spacing-1"],
    color: colors.NeutralsTextSecondary,
  },
  runnerAttribute: {
    ...typography["typography-h152"],
    paddingRight: spacings["spacing-1"],
    color: colors.NeutralsTextDefault,
    flexShrink: 1,
  },
});
