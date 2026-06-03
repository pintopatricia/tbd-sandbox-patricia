import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketBetSelectionCard: {
    paddingBottom: spacings["spacing-2"],
  },
  infoSignpost: {
    paddingBottom: spacings["spacing-2"],
  },
  betSelectionDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  betSegmentsContainer: {
    paddingTop: spacings["spacing-2"],
  },
});
