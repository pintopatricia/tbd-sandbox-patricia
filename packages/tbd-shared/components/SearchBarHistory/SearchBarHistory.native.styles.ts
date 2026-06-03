import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  searchHistoryContainer: {
    paddingTop: spacings["spacing-3"],
  },
  searchHistoryLabel: {
    marginBottom: spacings["spacing-4"],
    ...typography["typography-h098"],
    color: colors.NeutralsTextSecondary,
  },
  searchHistoryItemsContainer: {
    overflow: "hidden",
    borderRadius: spacings["spacing-1"],
  },
});
