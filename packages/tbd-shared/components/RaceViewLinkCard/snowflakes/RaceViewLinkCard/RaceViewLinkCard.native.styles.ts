import { StyleSheet } from "react-native";
import { colors, heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  raceViewLinkCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: spacings["spacing-3"],
    height: 126,
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: 4,
  },
  title: {
    flexGrow: 1,
    marginBottom: spacings["spacing-3"],
    color: colors.NeutralsTextDefault,
  },
  image: {
    width: heights["icon-size"],
    height: heights["icon-size"],
    marginBottom: spacings["spacing-3"],
    borderRadius: 50,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  space: {
    justifyContent: "space-between",
  },
  flexEnd: {
    justifyContent: "flex-end",
  },
  subTitleContainer: {
    flexDirection: "column",
  },
  subtitleLabel: {
    marginBottom: spacings["spacing-1"],
    color: colors.NeutralsTextSecondary,
  },
  subtitle: {
    color: colors.NeutralsTextDefault,
  },
  arrow: {
    margin: spacings["spacing-1"],
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
});
