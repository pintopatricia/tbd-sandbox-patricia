import { tokens, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  text: { ...typography["typography-h152"], color: tokens.NeutralsTextDefault, margin: spacings["spacing-1"] },
  title: {
    ...typography["typography-h580"],
    margin: spacings["spacing-1"],
    color: tokens.AgnosticActionPrimaryTextDefault,
  },
  subTitle: { ...typography["typography-h380"], margin: spacings["spacing-1"], color: tokens.NeutralsTextDefault },
});
