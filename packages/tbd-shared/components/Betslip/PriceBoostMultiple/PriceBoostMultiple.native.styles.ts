import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: "100%",
  },

  header: {
    flexDirection: "row",
    height: 24,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: spacings["spacing-2"],
  },

  headerExperiment: {
    marginTop: spacings["spacing-2"],
  },

  headerTitle: {
    color: tokens.NeutralsTextDefault,
  },

  headerIcon: {
    width: tokens.SportsbookPlacePanelIconSizingWidth,
    height: tokens.SportsbookPlacePanelIconSizingHeigth,
  },

  controls: {
    marginTop: spacings["spacing-4"],
  },
});
