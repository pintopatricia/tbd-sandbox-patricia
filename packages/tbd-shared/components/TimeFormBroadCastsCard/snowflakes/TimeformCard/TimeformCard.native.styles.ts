import { StyleSheet } from "react-native";
import { spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  timeformCard: {
    borderRadius: 4,
    experimental_backgroundImage: `linear-gradient(135deg, ${tokens.BrandTimeformBackgroundGradientStart} 0%, ${tokens.BrandTimeformBackgroundGradientEnd} 100%)`,
  },
  content: {
    paddingTop: spacings["spacing-1"],
    paddingBottom: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-3"],
  },
  runnerRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacings["spacing-2"],
  },
  runnerText: {
    ...typography["typography-h152"],
    color: tokens.AgnosticNeutralsTextAlternative,
    marginRight: spacings["spacing-2"],
    flexShrink: 1,
  },
  verdictSection: {
    marginTop: spacings["spacing-4"],
  },
  verdictLabel: {
    ...typography["typography-h098"],
    color: tokens.AgnosticNeutralsTextDisabled,
  },
  verdict: {
    ...typography["typography-h152"],
    color: tokens.AgnosticNeutralsTextAlternative,
    marginTop: spacings["spacing-1"],
  },
  noMarginBottom: { marginBottom: 0 },
});
