import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  sbkPlacePanel: {
    backgroundColor: tokens.SportsbookPlacePanelContainerColour,
    flexShrink: 1,
  },
  cardContainer: {
    elevation: 2,
    ...tokens.SportsbookPlacePanelCollapseDropShadow,
    ...tokens.CardBorderRadius,
  },
  collapseCardContent: {
    ...tokens.SportsbookPlacePanelCollapseContentPadding,
  },
  scrollable: {
    ...tokens.SportsbookPlacePanelVerticalGapPrimary,
    ...tokens.SportsbookPlacePanelTopContentPadding,
  },
  tabCard: {
    /* This is a "temporary" solution until this TabPanel and TabGroupPanel component are tokenized for SMALL variant */
    marginTop: tokens.SportsbookPlacePanelVerticalGapPrimary.gap,
  },
  blurbContainer: {
    marginLeft: spacings["spacing-2"],
    marginRight: spacings["spacing-2"],
    marginTop: spacings["spacing-1"],
  },
});
