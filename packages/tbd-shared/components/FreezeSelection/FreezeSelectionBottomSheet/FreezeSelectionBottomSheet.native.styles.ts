import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "80%",
    paddingTop: 0,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  drawer: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "80%",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: tokens.BottomSheetTitleColour,
    ...tokens.BottomSheetTitleTypography,
  },
  closeButtonIconContainer: {
    paddingVertical: 12,
    marginLeft: "auto",
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
  },
  footerContent: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderStyle: "solid",
  },
});
