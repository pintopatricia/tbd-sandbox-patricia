import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: "100%",
  },

  controls: {
    paddingTop: spacings["spacing-2"],
  },

  notificationsListContainer: {
    marginBottom: spacings["spacing-3"],
  },
  notificationsListContainerExperiment: {
    marginTop: spacings["spacing-3"],
  },
});
