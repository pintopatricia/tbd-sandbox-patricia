import { StyleSheet } from "react-native";
import { colors, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  notification: {
    color: colors.NeutralsTextDefault,
  },
  time: {
    ...typography["typography-h180"],
  },
  names: {
    ...typography["typography-h120"],
  },
});
