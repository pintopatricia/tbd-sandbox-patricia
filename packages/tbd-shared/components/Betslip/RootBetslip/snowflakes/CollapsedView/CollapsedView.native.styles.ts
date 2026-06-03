import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

// TODO: replace expandable tokens after design team rename them
export default StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    color: "red",
    flexDirection: "row",
    alignItems: "center",
    minHeight: tokens.ExpandableContainerSizing,
    backgroundColor: tokens.ExpandableHeaderBackgroundColour,
    ...tokens.ExpandableBorderRadius,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  action: {
    ...tokens.ExpandableIconPadding,
  },
  actionIcon: {
    color: tokens.ExpandableIconColour,
    width: tokens.ExpandableIconSizing,
    height: tokens.ExpandableIconSizing,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  minimizedTitle: {
    ...tokens.MinimisedTitleTypography,
    color: tokens.MinimisedTitleColour,
  },
  minimizedSupportingText: {
    ...tokens.MinimisedSupportingTextTypography,
    color: tokens.MinimisedSupportingTextColour,
  },
});
