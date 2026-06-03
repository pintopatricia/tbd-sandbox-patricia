import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  aggregatorBody: {
    paddingHorizontal: spacings["spacing-2"],
    paddingTop: spacings["spacing-2"],
  },
  legCardGroup: {
    ...tokens.SportsbookBetLegCardGroupContainerBorderRadius,
    backgroundColor: tokens.NeutralsBackgroundElevation3,
  },
  legGroupContainerGap: {
    marginBottom: spacings["spacing-2"],
  },
  dividerContainer: {
    paddingBottom: spacings["spacing-2"],
  },
});
