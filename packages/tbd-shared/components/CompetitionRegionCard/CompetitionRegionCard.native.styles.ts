import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",

    ...tokens.CardHorizontalGap,
  },
  flag: {
    width: tokens.CardFlagSizing,
    height: tokens.CardFlagSizing,
    ...tokens.CardFlagBorder,
    borderRadius: tokens.CardFlagSizing / 2,
  },
});
