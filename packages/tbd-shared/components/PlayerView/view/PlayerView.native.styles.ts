import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

const PLAYER_SHIRT_NUMBER_SIZE = 48;
const PLAYER_SHIRT_NUMBER_LINE_HEIGHT = 72;

export const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...tokens.PageHeaderPadding,
  },
  playerName: {
    color: tokens.CardGroupTitleColour,
    ...tokens.PageHeaderTitleTypography,
  },
  playerPosition: {
    color: tokens.CardGroupTitleColour,
    ...tokens.AvbFixtureMediumLabelTypography,
  },
  playerShirtNumber: {
    color: tokens.CardGroupTitleColour,
    ...tokens.PromotedPriceCurrentContentTextTypography,
    fontSize: PLAYER_SHIRT_NUMBER_SIZE,
    lineHeight: PLAYER_SHIRT_NUMBER_LINE_HEIGHT,
  },
});

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingLabel: {
    ...tokens.PageHeaderPadding,
    ...tokens.PageHeaderTitleTypography,
    color: tokens.CardGroupTitleColour,
  },
  title: {
    ...tokens.PageHeaderPadding,
    ...tokens.PageHeaderTitleTypography,
    fontSize: 20,
    color: tokens.CardGroupTitleColour,
  },
});
