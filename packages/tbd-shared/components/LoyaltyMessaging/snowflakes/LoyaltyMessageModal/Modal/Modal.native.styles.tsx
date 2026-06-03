import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.ComponentsNeutralsOverlayBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    maxWidth: 480,
    maxHeight: "85%",
    backgroundColor: tokens.LoyaltyMessageModalBackgroundColour,
    borderRadius: 8,
    overflow: "hidden",
  },
  content: {
    padding: 16,
    justifyContent: "space-between",
    ...tokens.LoyaltyMessageModalVerticalGapPrimary,
  },
  header: {
    paddingBottom: 4,
  },
  title: {
    paddingBottom: 8,
    ...tokens.LoyaltyMessageModalTitleTypography,
    color: tokens.LoyaltyMessageModalTextTitleColour,
  },
  actionLink: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: tokens.LoyaltyMessageModalImageSizing,
  },
});
