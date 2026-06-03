import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { viewDefault } from "@ppb/the-wall-native/components/Scoreboard/Team/Team.styles";

export const virtualTeamStyles = StyleSheet.create({
  ...viewDefault,
  teamName: {
    ...viewDefault.teamName,
    color: tokens.TeamTextLabelColour,
  },
});
