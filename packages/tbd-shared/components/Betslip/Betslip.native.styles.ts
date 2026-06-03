import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betslip: {
    backgroundColor: colors.ComponentsNeutralsBottomsheetBackgroundElevation1,
  },
  container: {
    backgroundColor: colors.ComponentsNeutralsBottomsheetBackgroundElevation1,
    marginHorizontal: spacings["spacing-2"],
    overflow: "hidden",
    borderRadius: 4,
  },
  notificationsListContainer: {
    paddingTop: spacings["spacing-2"],
    paddingHorizontal: spacings["spacing-2"],
  },
});
