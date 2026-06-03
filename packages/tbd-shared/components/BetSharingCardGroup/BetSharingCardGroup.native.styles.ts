import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: spacings["spacing-2"],
    paddingBottom: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-1"],
  },
  legCard: {
    marginHorizontal: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
    borderRadius: spacings["spacing-1"],
  },
});
