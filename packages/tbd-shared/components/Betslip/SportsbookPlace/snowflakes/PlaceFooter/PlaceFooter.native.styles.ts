import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  footerContainer: {
    ...tokens.PlaceFooterVerticalGap,
    ...tokens.PlaceFooterPadding,
  },
  actions: {
    flexDirection: "row",
    ...tokens.PlaceFooterHorizontalGap,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: tokens.PlaceFooterIconContainerSizing,
    height: tokens.PlaceFooterIconContainerSizing,
  },
  primaryButton: {
    flexGrow: 1,
    flex: 1,
  },
  trashIcon: {
    width: tokens.PlaceFooterIconSizing,
    height: tokens.PlaceFooterIconSizing,
  },
});
