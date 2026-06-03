import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  title: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h380"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacings["spacing-3"],
  },
  infoContainer: {
    width: spacings["spacing-5"],
    height: spacings["spacing-5"],
    margin: spacings["spacing-1"],
  },
  card: {
    padding: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
  cardWithoutHorizontalPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  hint: {
    padding: spacings["spacing-3"],
    paddingTop: 0,
    color: colors.NeutralsTextSecondary,
    ...typography["typography-h152"],
    lineHeight: 20,
  },
  extraContent: {
    paddingBottom: spacings["spacing-2"],
  },
});
