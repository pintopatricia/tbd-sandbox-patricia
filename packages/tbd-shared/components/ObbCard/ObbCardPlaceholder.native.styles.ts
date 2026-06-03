import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  placeholder: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
  },

  placeholderContainer: {
    width: "100%",
    height: 300,
    flex: 1,

    backgroundColor: colors.NeutralsBackgroundElevation4,
    borderRadius: 4,
    marginTop: spacings["spacing-2"],
  },
});
