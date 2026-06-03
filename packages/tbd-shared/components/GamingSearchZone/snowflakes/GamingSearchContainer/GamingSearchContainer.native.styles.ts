import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    ...tokens.SearchResultItemVerticalGap,
  },
  searchBarContainer: {
    ...tokens.SearchBarPadding,
    backgroundColor: tokens.PageBackgroundColour,
  },
  itemListContainer: {
    ...tokens.SearchResultItemVerticalGap,
  },
  labels: {
    ...tokens.SearchResultListDefaultLabelTypography,
    color: tokens.SearchResultsListContentTextColour,
    ...tokens.CardGroupPadding,
  },
  searchHistoryContainer: {
    ...tokens.SearchBarPadding,
  },
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.PageBackgroundColour,
  },
  fixedSearchContainer: {
    paddingTop: spacings["spacing-card-top-default"],
  },
});
