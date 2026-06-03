import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  modalContainer: {
    maxHeight: "100%",
  },
  messageContainer: {
    minHeight: spacings["spacing-10"],
    marginBottom: spacings["spacing-3"],
  },
  message: {
    ...tokens.LoyaltyMessageModalContentTextTypography,
    color: tokens.LoyaltyMessageModalTextContentTextColour,
  },
  ctaButtonContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: spacings["spacing-3"],
    paddingBottom: spacings["spacing-3"],
  },
  tcLink: {
    ...tokens.LoyaltyMessageModalTcLinkTypography,
    color: tokens.LoyaltyMessageModalTextTcLinkColour,
  },
});
