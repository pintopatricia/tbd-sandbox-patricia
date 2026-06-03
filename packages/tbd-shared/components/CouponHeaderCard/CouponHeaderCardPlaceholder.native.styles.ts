import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholderContainer: {
    justifyContent: "center",
    height: tokens.CompetitionHeaderContainerSizing,
    ...tokens.CompetitionHeaderPadding,
  },
  placeholder: {
    width: 96,
    height: 16,
  },
  tempPlaceholderOverride: {
    height: "100%",
  },
});
