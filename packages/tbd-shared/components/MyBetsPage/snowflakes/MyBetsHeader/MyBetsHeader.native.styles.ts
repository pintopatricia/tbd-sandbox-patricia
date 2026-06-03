import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  myBetsHeader: {
    flexDirection: "column",
    backgroundColor: tokens.MyBetsHeaderBackgroundColour,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flexDirection: "column",
    ...tokens.MyBetsHeaderVerticalGapSecondary,
    flex: 1,
  },

  title: {
    color: tokens.MyBetsHeaderTitleColour,
    ...tokens.MyBetsHeaderTitleTypography,
    ...tokens.MyBetsHeaderTitleMobilePadding,
  },

  myBetsHeaderAddOn: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  myBetsHeaderTabs: {
    flex: 1,
    minWidth: 0,
  },
  sectionContainer: {
    paddingLeft: tokens.MyBetsHeaderTitleMobilePadding.paddingLeft,
    paddingRight: tokens.MyBetsHeaderTitleMobilePadding.paddingRight,
  },
});
