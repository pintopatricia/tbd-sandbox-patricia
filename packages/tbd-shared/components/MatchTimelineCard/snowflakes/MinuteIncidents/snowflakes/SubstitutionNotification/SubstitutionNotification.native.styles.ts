import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  notification: {
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
  title: {
    ...typography["typography-h180"],
    color: colors.NeutralsTextDefault,
  },
  homeText: {
    textAlign: "right",
  },
  entry: {
    flexDirection: "row",
  },
  entryHome: {
    flexDirection: "row-reverse",
  },
  icon: {
    height: 12,
    width: 12,
    marginVertical: spacings["spacing-half"],
  },
  substitutionText: {
    ...typography["typography-h120"],
    flexShrink: 1,
    color: colors.NeutralsTextSecondary,
    marginHorizontal: spacings["spacing-1"],
  },
});
