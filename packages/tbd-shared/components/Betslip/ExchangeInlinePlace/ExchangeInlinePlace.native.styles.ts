import { StyleSheet } from "react-native";
import { typography, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: tokens.SmSpacingXxxSmall,
  },
  depositTo: {
    ...typography["typography-h220"],
  },
});
