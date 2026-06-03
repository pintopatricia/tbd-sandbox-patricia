import { spacings, tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sbkPlacePanel: {
    backgroundColor: tokens.SportsbookPlacePanelContainerColour,
    flexShrink: 1,
  },
  scrollable: {
    ...tokens.SportsbookPlacePanelVerticalGapPrimary,
  },
  blurbContainer: {
    marginLeft: spacings["spacing-2"],
    marginRight: spacings["spacing-2"],
    marginTop: spacings["spacing-1"],
  },
  tabSectionContainer: {
    elevation: 2,
    ...tokens.SportsbookPlacePanelCollapseDropShadow,
    ...tokens.CardBorderRadius,
  },
  tabSectionContent: {
    ...tokens.SportsbookPlacePanelCollapseContentPadding,
  },
  scrollableContentContainer: {
    flex: 1,
  },
});
