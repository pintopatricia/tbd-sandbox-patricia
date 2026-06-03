import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",

    ...tokens.CardHeaderSmallFullWidthPadding,

    color: tokens.CardTitleColour,
  },
  betInfoHeaderTitle: {
    color: tokens.CardTitleColour,
    ...tokens.CardHeaderSmallTitleTypography,
  },
  betInfoHeaderIcon: {
    width: tokens.CardHeaderIconSizing,
    height: tokens.CardHeaderIconSizing,
  },
});
