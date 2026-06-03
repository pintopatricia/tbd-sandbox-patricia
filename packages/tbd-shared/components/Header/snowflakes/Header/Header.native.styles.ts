import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  header: {
    ...tokens.HeaderVerticalGapPrimary,
    justifyContent: "center",
  },
  actionIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonIcon: {
    width: tokens.HeaderIconBackIconSizing,
    height: tokens.HeaderIconBackIconSizing,
  },
  menuButtonIcon: {
    width: tokens.HeaderIconActionIconLeftSizing,
    height: tokens.HeaderIconActionIconLeftSizing,
  },
  logoImageContainer: {
    height: tokens.HeaderLogoSizing,
    justifyContent: "center",
  },
  accountHeaderContainer: {
    height: tokens.HeaderContainerSizing,
    ...tokens.HeaderPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerWithActions: {
    flexDirection: "row",
    ...tokens.HeaderHorizontalGapPrimary,
  },
  myAccountActions: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.HeaderHorizontalGapSecondary,
  },
  balanceBtn: {
    alignItems: "center",
    flexDirection: "row",
    ...tokens.HeaderHorizontalGapSecondary,
  },
  balanceLabel: {
    color: tokens.HeaderTextLabelColour,
    ...tokens.HeaderLabelTypography,
  },
  userIconContainer: {
    width: tokens.HeaderIconProfileIconSizing,
    height: tokens.HeaderIconProfileIconSizing,
  },
  loginContainer: {
    flexDirection: "row",
    backgroundColor: tokens.HeaderBackgroundSecondaryColour,
    ...tokens.HeaderPadding,
    ...tokens.HeaderBorder,
    ...tokens.HeaderHorizontalGapPrimary,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  loginContainerButton: {
    flex: 1,
    flexGrow: 1,
  },
  balanceContainer: {
    ...tokens.HeaderVerticalGapSecondary,
    flexDirection: "column",
    alignItems: "flex-end",
  },
});
