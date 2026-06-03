import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  title: {
    ...typography["typography-h380"],
    width: "90%",
    textAlign: "center",
    color: colors.NeutralsTextDefault,
    paddingBottom: spacings["spacing-2"],
  },
  message: {
    ...typography["typography-h220"],
    width: "90%",
    textAlign: "center",
    color: colors.NeutralsTextDefault,
  },
  infoContainer: {
    alignItems: "center",
    paddingTop: spacings["spacing-6"],
  },
});
