import { StyleSheet } from "react-native";
import { spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  itemsList: {
    flex: 1,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: spacings["spacing-3"],
  },
  searchTitle: {
    color: tokens.NeutralsTextDefault,
    ...typography["typography-h380"],
  },
  card: {
    marginHorizontal: spacings["spacing-3"],
    marginBottom: spacings["spacing-6"],
  },
  groupContainer: {
    marginBottom: spacings["spacing-6"],
  },
});

