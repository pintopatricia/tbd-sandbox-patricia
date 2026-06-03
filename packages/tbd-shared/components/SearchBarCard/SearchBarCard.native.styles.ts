import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  searchContainer: {
    paddingBottom: spacings["spacing-2"],
    marginHorizontal: spacings["spacing-3"],
  },
  title: {
    ...typography["typography-h380"],
    marginBottom: spacings["spacing-3"],

    color: colors.NeutralsTextDefault,
  },
  filtersContainer: {
    marginVertical: spacings["spacing-2"],
  },
});
