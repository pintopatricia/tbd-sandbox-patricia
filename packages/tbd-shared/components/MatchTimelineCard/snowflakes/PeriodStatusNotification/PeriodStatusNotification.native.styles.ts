import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  periodStatusNotification: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
  title: {
    ...typography["typography-h180"],
    color: colors.NeutralsTextDefault,
    marginBottom: spacings["spacing-2"],
  },
});
