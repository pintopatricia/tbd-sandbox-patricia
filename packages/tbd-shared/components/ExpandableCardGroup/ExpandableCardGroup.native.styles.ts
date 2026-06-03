import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingHorizontal: spacings["spacing-3"],
  },
  headerTextList: {
    ...typography["typography-h380"],
    color: colors.NeutralsTextDefault,
  },
  headerTitle: {
    marginBottom: spacings["spacing-2"],
  },
  highlightedSelection: {
    marginTop: spacings["spacing-half"],
  },
});
