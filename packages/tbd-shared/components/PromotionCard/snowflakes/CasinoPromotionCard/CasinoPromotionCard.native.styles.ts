import { StyleSheet } from "react-native";
import { colors, heights, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  promotionCard: {
    position: "relative",
    height: heights["promo-card-height"],
    borderRadius: 4,
    backgroundColor: colors.NeutralsBackgroundElevation2,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  promotionImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  promotionHeader: {
    flexDirection: "row",
    flex: 1,
  },
  promotionFooter: {
    backgroundColor: colors.AgnosticNeutralsBorderDefault,
    paddingVertical: spacings["spacing-1"],
  },
  promotionLeftContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
  },
  promotionRightContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  promotionTitle: {
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
    textTransform: "uppercase",
    backgroundColor: colors.AgnosticNeutralsTextAlternative,
    paddingLeft: spacings["spacing-4"],
    paddingRight: spacings["spacing-1"],
    marginBottom: spacings["spacing-1"],
    alignSelf: "flex-start",
  },
  promotionSubtitle: {
    ...typography["typography-h182"],
    textTransform: "uppercase",
    color: colors.AgnosticNeutralsTextAlternative,
    marginLeft: spacings["spacing-4"],
  },
  promotionButtonContainer: {
    alignItems: "center",
    marginLeft: spacings["spacing-4"],
    marginVertical: spacings["spacing-1"],
  },
  termsAndConditionsSummary: {
    ...typography["typography-h072"],
    color: colors.NeutralsTextDefault,
    paddingHorizontal: spacings["spacing-4"],
  },
});
