import { StyleSheet } from "react-native";
import { colors, spacings, typography, heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  oddsBoostIcon: {
    height: heights["promo-odds-boost-tag-height"],
  },
  promotionCard: {
    position: "relative",
    height: heights["promo-card-height"],
    borderRadius: 4,
    backgroundColor: colors.NeutralsBackgroundElevation2,
    overflow: "hidden",
  },
  promotionImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  promotionHeader: {
    paddingTop: spacings["spacing-5"],
    paddingHorizontal: spacings["spacing-3"],
    justifyContent: "flex-start",
  },
  promotionHeaderOddsBoostAndLink: {
    paddingBottom: spacings["spacing-2"],
  },
  promotionBody: {
    paddingHorizontal: spacings["spacing-3"],
    zIndex: 1,
  },
  promotionName: {
    ...typography["typography-h158"],
    maxWidth: heights["promo-content-max-width"],
    textTransform: "uppercase",
    color: colors.AgnosticNeutralsTextAlternative,
  },
  promoTypeLabel: {
    ...typography["typography-h220"],
    color: colors.AgnosticSignpostingGenerosityTextDefault,
  },
  promotionTitle: {
    ...typography["typography-h180"],
    maxWidth: heights["promo-content-max-width"],
    color: colors.AgnosticSignpostingGenerosityTextDefault,
    textTransform: "uppercase",
  },
  promotionFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  promotionFooterContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-3"],
  },
  promotionGradient: {
    flex: 1,
    experimental_backgroundImage: `linear-gradient(0deg, ${colors.ComponentsPromotionsBackgroundGradientStart} 25%, ${colors.ComponentsPromotionsBackgroundGradientEnd} 75%)`,
  },
  promotionTermsAndConditions: {
    marginRight: spacings["spacing-3"],
    flexGrow: 1,
    minWidth: "33%",
  },
  termsAndConditionsPressable: {
    alignSelf: "flex-start",
    paddingTop: spacings["spacing-1"],
    paddingRight: spacings["spacing-1"],
  },
  termsAndConditionsSummary: {
    ...typography["typography-h082"],
    marginTop: spacings["spacing-1"],
    maxWidth: heights["promo-content-max-width"],
    color: colors.AgnosticNeutralsTextAlternative,
  },
  termsAndConditionsLabel: {
    ...typography["typography-h072"],
    color: colors.AgnosticActionTertiaryTextDefault,
  },
  promotionAction: {
    maxWidth: "66%",
  },
  betButton: {
    marginTop: spacings["spacing-3"],
    height: heights["bet-button-height"],
    width: heights["bet-button-width"],
    alignSelf: "flex-end",
    borderRadius: 4,
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
  },
  triangle: {
    position: "absolute",
    width: 75,
    height: 75,
    backgroundColor: colors.SignpostingGenerosityBackgroundDefault,
    opacity: 0.6,
  },
  topRight: {
    top: -52,
    right: -40,
    transform: [{ rotate: "45deg" }],
  },
  bottomLeft: {
    bottom: -52,
    left: -41,
    transform: [{ rotate: "45deg" }],
  },
  promotionContent: {
    height: "100%",
  },
  oddsBoostButtonContainer: {
    backgroundColor: colors.NeutralsBackgroundElevation2,
    width: "100%",
    height: "100%",
  },
});
