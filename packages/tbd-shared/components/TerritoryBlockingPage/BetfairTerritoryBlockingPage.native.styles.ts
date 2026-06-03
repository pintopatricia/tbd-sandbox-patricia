import { colors, heights, spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  betfairLogoContainer: {
    height: tokens.HeaderContainerSizing,
    paddingLeft: spacings["spacing-3"],
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    height: 50,
    width: "50%",
  },
  logoImageContainer: {
    height: 12,
    width: 69,
  },
  container: {
    paddingTop: heights["territory-block-image-padding"],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography["typography-h580"],
    color: colors.NeutralsTextDefault,
    paddingTop: spacings["spacing-5"],
    paddingBottom: spacings["spacing-3"],
  },
  message: {
    ...typography["typography-h220"],
    width: "80%",
    textAlign: "center",
    color: colors.NeutralsTextDefault,
  },
  infoContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: heights["territory-block-info-padding"],
  },
  infoBackground: {
    backgroundColor: colors.NeutralsBackgroundElevation3,
    height: heights["territory-block-size"],
    width: heights["territory-block-size"],
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    width: spacings["spacing-8"],
    height: spacings["spacing-8"],
  },
  infoText: {
    ...typography["typography-h152"],
    paddingTop: spacings["spacing-3"],
    textAlign: "center",
    color: colors.NeutralsTextDefault,
  },
  blockedTerritoryIconContainer: {
    // NOTE: old icon size
    height: 132,
    width: 132,
  },
});
