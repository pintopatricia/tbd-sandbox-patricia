import { colors, spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  logoContainer: {
    height: tokens.HeaderContainerSizing,
    ...tokens.HeaderPadding,
    flexDirection: "row",
    alignItems: "center",
  },
  logoImageContainer: {
    height: tokens.BrandLogoDefaultHeightSizing,
    width: tokens.BrandLogoDefaultWidthSizing,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    ...tokens.PrimaryButtonVerticalGap,
  },
  retryButton: {
    minWidth: tokens.ErrorPagePrimaryButtonContainerMinWidth,
  },
  helpCenterContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    marginBottom: 22,
  },
  helpCenterBackground: {
    backgroundColor: colors.NeutralsBackgroundElevation5,
    height: 80,
    width: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  helpCenterIcon: {
    width: 32,
    height: 32,
  },
  helpCenterText: {
    ...typography["typography-h152"],
    paddingTop: spacings["spacing-2"],
    textAlign: "center",
    color: colors.NeutralsTextDefault,
  },
});
