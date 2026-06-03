import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingLeft: tokens.ScrollableSwimlaneSwimlanePadding.paddingLeft,
    paddingRight: tokens.ScrollableSwimlaneSwimlanePadding.paddingRight,
  },
  card: {
    borderRadius: tokens.CardBorderRadius.borderRadius,
    overflow: "hidden",
    ...tokens.CardsDropshadow,
    backgroundColor: tokens.CardBackgroundColour,
  },
  header: {
    backgroundColor: tokens.SquadBetCardSecondaryHeaderBackgroundColour,
    width: "100%",
    padding: tokens.SquadBetCardSecondaryHeaderPadding.padding,
    flexDirection: "column",
    gap: tokens.FootballScoreboardVerticalGap.gap,
    alignItems: "center",
    justifyContent: "center",
  },
  durationContainer: {
    width: tokens.SquadBetCardSecondaryPlaceholderLargeWidth,
    height: tokens.SquadBetCardSecondaryPlaceholderMediumHeight,
  },
  teamsRow: {
    flexDirection: "row",
    gap: tokens.FootballScoreboardHorizontalGap.gap,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: tokens.TeamMediumContainerMinHeightSizing,
  },
  teamContainer: {
    flex: 1,
    height: tokens.SquadBetCardSecondaryPlaceholderMediumHeight,
    minWidth: 0,
  },
  scoreContainer: {
    width: tokens.SquadBetCardSecondaryPlaceholderSmallWidth,
    height: tokens.SquadBetCardSecondaryPlaceholderXsmallHeight,
    flexShrink: 0,
  },
  bettingOpportunitiesContainer: {
    flexDirection: "column",
  },
  marketSection: {
    padding: tokens.SquadBetCardSecondaryPadding.padding,
    flexDirection: "column",
    gap: tokens.SquadBetCardSecondaryVerticalGap.gap,
  },
  marketContent: {
    flexDirection: "row",
    gap: tokens.SquadBetCardSecondaryVerticalGap.gap,
    alignItems: "center",
  },
  marketContentContainer: {
    flex: 1,
    height: tokens.SquadBetCardSecondaryPlaceholderLargeHeight,
  },
  buttonContainer: {
    width: tokens.SquadBetCardSecondaryPlaceholderXsmallWidth,
    height: tokens.SquadBetCardSecondaryPlaceholderLargeHeight,
  },
  popularEvidenceContainer: {
    width: "100%",
  },
  popularEvidencePlaceholderContainer: {
    width: "100%",
    height: tokens.SquadBetCardSecondaryPlaceholderMediumHeight,
  },
  statsContainer: {
    width: "100%",
  },
  statsPlaceholderContainer: {
    width: "100%",
    height: tokens.SquadBetCardSecondaryPlaceholderMediumHeight,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  showMoreContainer: {
    padding: tokens.SquadBetCardSecondaryPadding.padding,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    width: tokens.SquadBetCardSecondaryPlaceholderLargeWidth,
    height: tokens.SquadBetCardSecondaryPlaceholderMediumHeight,
  },
  placeholderFill: {
    height: "100%",
    width: "100%",
  },
});
