import { StyleSheet } from "react-native";
import { heights, lineHeights, spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  popupBox: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  popupContent: {
    marginHorizontal: spacings["spacing-8"],
    zIndex: 3,
    padding: spacings["spacing-4"],
    backgroundColor: tokens.ModalBackgroundColour,
    borderRadius: 2,
    shadowColor: tokens.ModalDropshadow.shadowColor,
    shadowOffset: tokens.ModalDropshadow.shadowOffset,
    shadowOpacity: tokens.ModalDropshadow.shadowOpacity,
    shadowRadius: tokens.ModalDropshadow.shadowRadius,
    elevation: 3,
  },
  popupTitle: {
    color: tokens.ModalTextTitleColour,
    marginBottom: heights["icon-size-small"],
    ...typography["typography-h370"],
  },
  popupBody: {
    color: tokens.ModalTextTitleColour,
    textAlign: "justify",
    ...typography["typography-h220"],
  },
  separator: {
    height: lineHeights["line-height-1"],
    backgroundColor: tokens.ModalBackgroundColour,
    marginTop: spacings["spacing-2"],
    marginBottom: spacings["spacing-2"],
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
