import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  footer: {
    ...tokens.FooterPadding,
    display: "flex",
    gap: tokens.FooterVerticalGapPrimary.gap,
  },
});
