import { colors, tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  bottomSheetContent: {
    marginBottom: tokens.BottomBarHeightSizing,
  },
  cardHeader: {
    width: "100%",
  },
  cardFixture: {
    width: "100%",
    paddingRight: spacings["spacing-2"],
    paddingBottom: spacings["spacing-2"],
  },
  extendedCard: {
    marginTop: spacings["spacing-2"],
  },
  regulatory: {
    marginTop: spacings["spacing-3"],
    paddingBottom: tokens.BottomBarHeightSizing,
    backgroundColor: colors.NeutralsBackgroundElevation1,
  },
});
