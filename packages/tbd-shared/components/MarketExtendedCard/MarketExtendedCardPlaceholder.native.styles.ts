import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholder: {
    marginHorizontal: spacings["spacing-2"],
    minHeight: 800,
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-2"],
  },
});
