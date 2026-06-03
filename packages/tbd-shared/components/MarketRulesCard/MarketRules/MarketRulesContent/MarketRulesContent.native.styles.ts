import { StyleSheet } from "react-native";
import { colors, spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  content: {
    width: "100%",
    paddingBottom: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation1,
    gap: tokens.MarketRulesSectionContainerPadding.paddingBottom,
  },
  title: {
    marginTop: spacings["spacing-4"],
    marginBottom: spacings["spacing-4"],
    color: colors.NeutralsTextDefault,
    ...typography["typography-h380"],
  },
  text: {
    color: tokens.MarketRulesSectionLabelColour,
    ...tokens.MarketRulesSectionLabelTypography,
  },
});
