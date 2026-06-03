import { StyleSheet } from "react-native";
import { tokens, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  carouselContainer: {
    position: "relative",
  },
  innerScroll: {
    flexGrow: 0,
    marginHorizontal: -spacings["spacing-2"],
  },
  innerScrollContent: {
    paddingHorizontal: spacings["spacing-2"],
  },
  microPlayer: {
    flexShrink: 0,
  },
  microPlayerSpacing: {
    marginRight: tokens.MicroPlayerSwimlaneHorizontalGap.gap,
  },
  editSquadButtonIcon: {
    position: "absolute",
    top: spacings["spacing-1-and-half"],
    right: 0,
    width: tokens.IconButtonSmallIconSizing,
    height: tokens.IconButtonSmallIconSizing,
    borderRadius: tokens.IconButtonSmallIconSizing / 2,
    backgroundColor: tokens.PrimaryButtonPrimaryDefaultBackgroundColour,
    borderWidth: spacings["spacing-half"],
    borderColor: tokens.CardBackgroundColour,
    alignItems: "center",
    justifyContent: "center",
  },
});
