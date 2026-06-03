import { StyleSheet } from "react-native";
import { colors, spacings, stackings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  matchTimelineDetailsContainer: {
    marginVertical: spacings["spacing-6"],
    marginHorizontal: spacings["spacing-3"],
  },
  newEventButtonContainer: {
    position: "absolute",
    top: 60,
    zIndex: stackings["header-stack"],
    backgroundColor: colors.NeutralsBackgroundElevation4,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: spacings["spacing-1"],
    paddingHorizontal: spacings["spacing-1"],
  },
});
