import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet, type TextStyle } from "react-native";

const baseText: TextStyle = {
  width: "100%",
  maxWidth: tokens.MicroPlayerWidthSizing,
  overflow: "hidden",
  textAlign: "center",
  fontStyle: "normal",
  color: tokens.MicroPlayerLabelColour,
};

export default StyleSheet.create({
  microPlayer: {
    alignItems: "center",
    overflow: "hidden",
    width: tokens.MicroPlayerWidthSizing,
  },
  jerseyContainer: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    backgroundColor: tokens.MicroPlayerBackgroundTopColour,
    height: tokens.MicroPlayerContainerTopSizing,
  },
  jerseyContainerLarge: {
    minHeight: 50,
    height: undefined,
  },
  nameContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: tokens.MicroPlayerContainerBottomSizing,
    backgroundColor: tokens.MicroPlayerBackgroundBottomColour,
    ...tokens.MicroPlayerSpacing,
  },
  firstName: {
    ...baseText,
    ...tokens.MicroPlayerLabelTypography,
  },
  lastName: {
    ...baseText,
    ...tokens.MicroPlayerLabelBigTypography,
  },
  imageSmall: {
    width: tokens.MicroPlayerJerseySizing,
    height: tokens.MicroPlayerJerseySizing,
  },
  imageLarge: {
    // TODO: Replace hardcoded values with a design token)
    width: 41,
    height: 41,
  },
  imageMultiVariant: {
    position: "absolute",

    width: tokens.MicroPlayerJerseySizing,
    height: tokens.MicroPlayerJerseySizing,
  },
  imageMultiVariantLarge: {
    position: "absolute",

    width: 56,
    height: 56,
  },
  defaultImage: {
    width: tokens.MicroPlayerJerseySizing - 10,
    height: tokens.MicroPlayerJerseySizing - 10,
  },
  nameEmptyState: {
    width: "100%",

    ...tokens.MicroPlayerLabelTypography,
    color: tokens.MicroPlayerLabelColour,
    textAlign: "center",
  },
  multiplePlayers: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  multipleFirstName: {
    color: tokens.MicroPlayerLabelColour,
    ...tokens.MicroPlayerLabelTypography,
  },
  multipleLastName: {
    color: tokens.MicroPlayerLabelColour,
    ...tokens.MicroPlayerSecondaryLabelTypography,
  },
  microPlayerMultiVariant: {
    width: "100%",

    borderTopLeftRadius: tokens.MicroPlayerBackgroundBorderRadius.borderRadius,
    borderTopRightRadius: tokens.MicroPlayerBackgroundBorderRadius.borderRadius,
  },
  centerJersey: {
    zIndex: 4,
    transformOrigin: "center bottom",
  },
  centerLeft: {
    zIndex: 4,
    transform: [{ translateX: -14.5 }],
  },
  centerRight: {
    zIndex: 5,
    transform: [{ translateX: 14.5 }],
  },
  playersDisabledLabel: {
    width: "100%",

    ...tokens.MicroPlayerSecondaryLabelTypography,
    color: tokens.MicroPlayerSecondaryLabelColour,
    textAlign: "center",
  },
  microPlayerWrapper: {
    width: "100%",
    position: "relative",
  },
  removePlayerContainer: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  removePlayerTouchContainer: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  removePlayerButton: {
    width: tokens.MicroPlayerCloseIconSizing,
    height: tokens.MicroPlayerCloseIconSizing,
  },
});
