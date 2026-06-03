import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  emptyStateIcon: {
    width: tokens.EmptyStateIconSizing,
    height: tokens.EmptyStateIconSizing,
  },
  experienceContainer: {
    width: "100%",
    flex: 1,
  },
  experienceView: {
    flex: 1,
    width: "100%",
  },
  viewContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
