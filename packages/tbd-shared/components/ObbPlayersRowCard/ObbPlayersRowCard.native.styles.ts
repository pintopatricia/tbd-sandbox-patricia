import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  playerRowCardContainer: {
    ...tokens.PlayerListCardBorderRadius,
    ...tokens.PlayerListCardPadding,
    ...tokens.PlayerListCardHorizontalGap,
    minWidth: tokens.PlayerListCardMinWidthSizing,
    color: tokens.PlayerListCardLabelColour,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.PlayerListCardHeaderBackgroundColour,
  },
  highlighted: {
    ...tokens.PlayerListCardSelectedBorder,
    backgroundColor: tokens.PlayerListCardHeaderSelectedBackgroundColour,
  },
  playerRowInfoContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 0,
    ...tokens.PlayerListCardHorizontalGap,
  },
  name: {
    color: tokens.PlayerListCardLabelColour,
    ...tokens.PlayerListCardLabelTypography,
  },
  lastName: {
    overflow: "hidden",
    ...tokens.PlayerListCardLabelSecondaryTypography,
  },
  statsValue: {
    color: tokens.PlayerListCardStatsTextColour,
    ...tokens.PlayerListCardStatsTextTypography,
  },
  labelDisabled: {
    color: tokens.PlayerListCardDisabledLabelColour,
  },
  playerStatValue: {
    overflow: "hidden",
    ...tokens.PlayerListCardSupportingTextTypography,
  },
  playerInfoJersey: {
    alignItems: "center",
    height: tokens.PlayerListCardJerseySizing,
    width: tokens.PlayerListCardJerseySizing,
  },
  jersey: {
    width: tokens.PlayerListCardJerseySizing,
    height: tokens.PlayerListCardJerseySizing,
  },
  playerNameAndPosition: {
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  playerRowNameContainer: {
    flexDirection: "row",
    gap: 4,
  },
  playerPositionAndNumber: {
    color: tokens.PlayerListCardSupportingTextColour,
    ...tokens.PlayerListCardSupportingTextTypography,
  },
  playerPositionAndNumberDisabled: {
    color: tokens.PlayerListCardDisabledLabelColour,
  },
  playerRowStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    ...tokens.PlayerListCardStatsHorizontalGap,
    minWidth: tokens.PlayerListCardStatsMinWidthSizing,
  },
  playerStatsIcon: {
    width: tokens.PlayerListCardStatsIconSizing,
    height: tokens.PlayerListCardStatsIconSizing,
  },
});
