import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  footer: {
    paddingHorizontal: spacings["spacing-3"],
    paddingTop: spacings["spacing-8"],
    color: colors.NeutralsTextDefault,
  },
  section: {
    marginBottom: spacings["spacing-8"],
  },
});
