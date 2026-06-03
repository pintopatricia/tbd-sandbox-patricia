import { StyleSheet } from "react-native";

import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingTop: tokens.TabsGroupRegularPadding.paddingTop,
  },
  tabContent: {
    gap: spacings["spacing-card-top-small"],
  },
  tooltip: {
    paddingVertical: spacings["spacing-1"],
    paddingHorizontal: spacings["spacing-3"],
  },
  cardItem: {
    paddingHorizontal: spacings["spacing-3"],
  },
});
