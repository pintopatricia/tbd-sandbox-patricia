import { StyleSheet } from "react-native";
import { heights, spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: spacings["spacing-half"],
    alignItems: "center",
  },

  small: {
    width: heights["icon-size-small"],
    height: heights["icon-size-small"],
  },

  large: {
    width: 40,
    height: 40,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  text: {
    ...typography["typography-h120"],
    color: tokens.NeutralsTextDefault,
    textAlign: "center",
  },
});
