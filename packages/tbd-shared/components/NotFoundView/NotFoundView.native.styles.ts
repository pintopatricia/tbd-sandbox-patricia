import { colors, heights, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  notFoundViewContainer: {
    paddingTop: spacings["spacing-4"],
  },
  relatedLinks: {
    color: colors.NeutralsTextDefault,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  link: {
    alignItems: "center",
    paddingTop: spacings["spacing-8"],
    paddingBottom: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-4"],
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: colors.NeutralsBackgroundElevation3,
  },
  icon: {
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
  text: {
    marginTop: spacings["spacing-2"],
    color: colors.NeutralsTextDefault,
    textAlign: "center",
    ...typography["typography-h152"],
  },
});
