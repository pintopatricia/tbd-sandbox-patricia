import { colors, spacings, tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.NeutralsBorderElevation2,
  },
  drawerContentWithPadding: {
    paddingRight: spacings["spacing-3"],
  },
  drawerContentWithPaddingCheckbox: {
    paddingLeft: spacings["spacing-6"],
  },
  countryIcon: {
    width: 20,
    height: 20,
  },
  collapseHeaderIcon: {
    width: tokens.CardFlagSizing,
    height: tokens.CardFlagSizing,
    ...tokens.CardFlagBorder,
    borderRadius: tokens.CardFlagSizing / 2 /* makes the border circular around the round flag icon */,
  },
});
