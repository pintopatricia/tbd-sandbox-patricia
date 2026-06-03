import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  gameTile: {
    width: "100%",
    alignItems: "center",
    ...tokens.GameTileSquareBorderRadius,
  },
  gameTileRounded: {
    width: tokens.GameTileRoundContainerSizing,
  },
  gameTileRedBorder: {
    ...tokens.GameTileSquareBorderRadius,
    ...tokens.GameTileJackpotBorder,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  squareImageContent: {
    width: "100%",
    height: "100%",
    ...tokens.GameTileSquarePadding,
  },
  roundedImageContent: {
    height: "100%",
    width: "100%",
  },
  gameInfoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    ...tokens.GameTileSquareVerticalGap,
  },
  badgeContainer: {
    top: tokens.GameTileBadgePositionTopSizing,
    position: "absolute",
  },
  gameTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...tokens.GameTileSquareHorizontalGap,
  },
  title: {
    ...tokens.GameTileTitleTypography,
    color: tokens.GameTileSquareTextTitleColour,
    flexShrink: 1,
  },
  copyRightText: {
    color: tokens.GameTileSquareTextSupportingTextColour,
    flexShrink: 1,
    ...tokens.GameTileSupportingTextTypography,
  },
  infoButton: {
    width: tokens.GameTileIconSizing,
    height: tokens.GameTileIconSizing,
  },
  jackpotLogoContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    ...tokens.GameTileSquarePadding,
  },
  jackpotLogoImg: {
    width: tokens.GameTileLogoSizing,
    height: tokens.GameTileLogoSizing,
  },
  jackpotLogoCircleImg: {
    width: tokens.GameTileLogoSizing,
    height: tokens.GameTileLogoSizing,
  },
  roundedGameTileJackpot: {
    height: tokens.GameTileLogoSizing,
    width: tokens.GameTileLogoSizing,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  roundedGameTileWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  roundedGameTileBadgeContainer: {
    height: tokens.BadgeGameTileRoundJackpotHeightSizing,
    width: tokens.BadgeGameTileRoundJackpotWidthSizing,
    alignItems: "center",
    justifyContent: "center",
  },
  roundedGameTileBadgeText: {
    position: "absolute",
    color: tokens.BadgeJackpotLabelColour,
    ...tokens.BadgeGameTileLabelTypography,
  },
  roundedGameTileGameTitleContainer: {
    width: "100%",
  },
  roundedTitle: {
    color: tokens.GameTileRoundTitleColour,
    textAlign: "center", // Added this instead of alignItems because its showing more chars from the game title
  },
  roundedGameTileBorder: {
    // borderStyle is not a valid prop for ImageStyle
    borderWidth: tokens.GameTileJackpotBorder.borderWidth,
    borderColor: tokens.GameTileJackpotBorder.borderColor,
  },
  roundedImageContainerStyle: {
    ...tokens.GameTileRoundBorderRadius,
    height: tokens.GameTileRoundContainerSizing,
    width: tokens.GameTileRoundContainerSizing,
  },
  squaredGameTileRadius: {
    ...tokens.GameTileSquareBorderRadius,
    overflow: "hidden",
  },
  gameWidgetTile: {
    width: tokens.PrimaryButtonContainerSizing,
    height: tokens.PrimaryButtonContainerSizing,
    backgroundColor: tokens.ActionBoostBackgroundDefault,
    borderRadius: tokens.GameTileRoundBorderRadius.borderRadius,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.PrimaryButtonPrimaryHoverBackgroundColour,
    alignItems: "center",
  },
  iconBackground: {
    width: tokens.RoundButtonSmallSizing,
    height: tokens.RoundButtonSmallSizing,
    borderRadius: tokens.GameTileRoundBorderRadius.borderRadius,
    justifyContent: "center",
    alignItems: "center",
  },

  gameTileWidgetShadow: {
    width: tokens.PrimaryButtonContainerSizing,
    height: tokens.PrimaryButtonContainerSizing,
    shadowColor: tokens.PrimaryButtonPrimaryHoverBackgroundColour,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
    overflow: "visible",
    borderRadius: 9999, // for round shadow
  },
  // this will be extracted in the-wall in the next interation
  gameWidgetTileDropShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  xmallGameTile: {
    width: tokens.GameTileRectangleWidthSizing,
    alignItems: "center",
  },
  xmallBackgroundImage: {
    width: tokens.GameTileRectangleWidthSizing,
    height: tokens.GameTileRectangleHeightSizing,
    ...tokens.GameTileRectangleVerticalGap,
  },
  xmallImageStyle: {
    borderRadius: 4,
    overflow: "hidden",
  },
  xmallJackpotBorder: {
    borderRadius: 4,
    overflow: "hidden",
    ...tokens.GameTileJackpotBorder,
  },
  xmallImageContent: {
    width: "100%",
    height: "100%",
  },
  xmallBadgeContainer: {
    top: tokens.GameTileBadgePositionTopSizing,
    position: "absolute",
  },
  xmallGameInfoContainer: {
    width: tokens.GameTileRectangleWidthSizing,
  },
  xmallGameTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...tokens.GameTileSquareHorizontalGap,
  },
  xmallTitle: {
    ...tokens.GameTileTitleTypography,
    color: tokens.GameTileRectangleTitleColour,
    flexShrink: 1,
  },
  xmallInfoButton: {
    width: tokens.GameTileIconSizing,
    height: tokens.GameTileIconSizing,
  },
  xmallJackpotLogoContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingTop: tokens.GameTileSquarePadding.paddingTop,
    paddingRight: tokens.GameTileSquarePadding.paddingRight,
  },
  xmallJackpotLogoImg: {
    width: tokens.GameTileLogoSizing,
    height: tokens.GameTileLogoSizing,
  },
});
