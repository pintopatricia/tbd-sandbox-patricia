import { StyleSheet, Dimensions } from "react-native";
import { colors, heights, spacings, widths, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  swimlaneCardGroupItem: {
    borderRadius: 4,
    overflow: "hidden",
    maxWidth: widths["swimlane-item-container-max-width"],
  },
  swimlaneCardGroupItemSingleCard: {
    width: Dimensions.get("window").width - spacings["spacing-3"] * 2,
  },
  swimlaneCardGroupItemMultipleCard: {
    width: Math.min(
      Dimensions.get("window").width * widths["swimlane-item-container-width-percentage"],
      widths["swimlane-item-container-max-width"],
    ),
    marginRight: spacings["spacing-3"],
  },

  swimlaneCardGroupLastItem: {
    marginRight: 0,
  },

  navigation: { width: 200 },

  sportViewLink: { width: "auto" },

  genericViewLink: { width: "auto", paddingRight: spacings["spacing-3"] },

  competitionViewLink: {
    width: "auto",
    height: 68,
    marginRight: spacings["spacing-half"],
  },

  raceTimeQuicklink: { width: "auto" },

  placeholder: {
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
  },

  placeholderContainer: {
    width: "100%",
    flex: 1,

    backgroundColor: colors.NeutralsBackgroundElevation4,
    borderRadius: 4,
    marginTop: spacings["spacing-2"],
  },

  placeholderHeader: {
    height: 24,
    marginBottom: spacings["spacing-half"],
    justifyContent: "space-between",
    flexDirection: "row",
  },

  placeholderAction: {
    width: 64,
    backgroundColor: colors.NeutralsBackgroundElevation6,
    height: "100%",
  },

  placeholderTitle: {
    width: "50%",
    height: "100%",

    backgroundColor: colors.NeutralsBackgroundElevation6,
    borderRadius: 4,
  },

  gameCard: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
  },
  segmentedTitle: {
    marginBottom: spacings["spacing-3"],
    color: colors.NeutralsTextDefault,
  },
  segmentedWrapper: {
    height: heights["gaming-card-size"],
    width: heights["gaming-card-size"],
  },
  gamingLink: {
    height: heights["gaming-link-card-min-height-with-icon"],
  },

  promoCard: {
    alignSelf: "flex-end",
  },

  container: {
    flexDirection: "column",
    ...tokens.HalfTimePulseCardPadding,
    ...tokens.HalfTimePulseCardGap,
    ...tokens.HalfTimePulseCardBorderRadius,
    marginHorizontal: 12,
  },

  highlightedContainer: {
    ...tokens.HalfTimePulseCardHighlightedBorder,
  },

  header: {
    ...tokens.HalfTimePulseHeaderPadding,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.HalfTimePulseTitleLabelGap,
  },

  title: {
    ...tokens.HalfTimePulseTitleTypography,
    color: tokens.HalfTimePulseTitleColour,
    flexShrink: 2,
  },

  subtitle: {
    color: tokens.HalfTimePulseSubtitleColour,
    ...tokens.HalfTimePulseSubtitleTypography,
  },

  firstCard: {
    paddingLeft: spacings["spacing-3"],
  },

  lastCard: {
    marginRight: 0,
    paddingRight: spacings["spacing-3"],
  },
});
