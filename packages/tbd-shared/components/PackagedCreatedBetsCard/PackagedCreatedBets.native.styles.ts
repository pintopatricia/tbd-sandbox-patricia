import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  card: {
    marginHorizontal: spacings["spacing-3"],
  },
  packagedCreatedBetsContainer: {
    margin: spacings["spacing-3"],
  },
  opportunitiesList: {
    ...tokens.RunnerVerticalGap,
    paddingVertical: spacings["spacing-2"],
  },
});
