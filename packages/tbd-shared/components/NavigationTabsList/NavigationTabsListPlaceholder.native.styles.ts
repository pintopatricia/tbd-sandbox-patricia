import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholder: {
    width: "100%",

    flexDirection: "column",
  },
  placeholderTabList: {
    width: "100%",
    height: 52,
    padding: spacings["spacing-2"],
    paddingRight: spacings["spacing-3"],
    paddingTop: 0,
    flexDirection: "row",
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
  },
  placeholderTabListItem: {
    width: 80,
    height: spacings["spacing-5"],
    margin: spacings["spacing-2"],
    marginTop: spacings["spacing-4"],
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
  noBorderRadius: {
    borderRadius: 0,
  },
  placeholderTabContainer: {
    width: "100%",
    height: 1000,
  },
});
