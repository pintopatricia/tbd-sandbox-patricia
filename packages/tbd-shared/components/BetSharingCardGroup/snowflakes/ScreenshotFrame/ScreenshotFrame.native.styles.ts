import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: spacings["spacing-3"],
    padding: spacings["spacing-3"],
    backgroundColor: colors.BrandBetfairBackgroundDefault,
    borderRadius: 8,
  },
});
