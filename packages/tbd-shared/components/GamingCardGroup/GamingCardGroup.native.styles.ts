import { StyleSheet, Dimensions } from "react-native";
import { colors, heights, spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  cardGroupItem: {
    width: Dimensions.get("window").width * heights["card-width-percentage"],
  },

  scrollableContainer: {
    ...tokens.ScrollableSwimlaneSwimlanePadding,
    ...tokens.ScrollableSwimlaneSwimlaneHorizontalGap,
  },

  navigation: { width: 200 },

  highlightedSelection: { width: 327 },

  sportViewLink: { width: "auto", paddingRight: spacings["spacing-3"] },

  genericViewLink: { width: "auto", paddingRight: spacings["spacing-3"] },

  circle: { width: 108 },

  raceTimeQuicklink: { width: 83 },

  promotion: { width: Dimensions.get("window").width * heights["promo-card-width-percentage"] },

  placeholder: {
    display: "flex",
    flexWrap: "wrap",
  },

  placeholdercontainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },

  placeholdertitle: {
    width: "50%",
    height: 24,
    marginVertical: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },

  gameCardMedium: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
  },
  gameCardSmall: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4,
  },
  xmallGameTile: {
    width: tokens.GameTileRectangleWidthSizing,
    height: tokens.GameTileRectangleHeightSizing + spacings["spacing-7"],
  },
  segmentedTitle: {
    marginBottom: spacings["spacing-3"],
    color: colors.NeutralsTextDefault,
  },
  segmentedAllCardsContainer: {
    flexDirection: "row",
  },
  segmentedWrapper: {
    height: heights["gaming-card-size"],
    width: heights["gaming-card-size"],
  },
  gamingLink: {
    height: tokens.HighlightedLinkCardContainerSizing,
  },
  supportingContent: {
    width: "auto",
    minWidth: 100,
    height: 56,
  },
  ribbonCard: {
    ...tokens.ScrollableSwimlaneSwimlaneHorizontalGap,
  },
  ribbonCardContainer: {
    ...tokens.ScrollableSwimlaneSwimlanePadding,
  },
  recentlyPlayedItemContainer: {
    gap: spacings["spacing-4"],
    paddingHorizontal: spacings["spacing-3"],
  },
  recentlyPlayedContainer: {
    width: tokens.GameTileRoundContainerSizing,
    maxHeight: 100,
  },
  gameTileWidgetPositioning: {
    position: "absolute",
    right: spacings["spacing-6"],
    bottom: spacings["spacing-6"],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  gameTileWidgetPositioningAfterBetslipOpen: {
    bottom: spacings["spacing-6"] + heights["betslip-collapsed-height"],
  },
});
