import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  header: {
    marginBottom: tokens.SmSpacingXSmall,
  },
  results: {
    marginHorizontal: spacings["spacing-2"],
  },
  freeBets: {
    marginHorizontal: spacings["spacing-2"],
  },
  notLastElement: {
    marginBottom: spacings["spacing-2"],
  },
});
