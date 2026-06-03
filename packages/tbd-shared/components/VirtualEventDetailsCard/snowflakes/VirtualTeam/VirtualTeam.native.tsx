import { FunctionComponent } from "react";
import { View } from "react-native";
import { TEAM, NAME } from "@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { virtualTeamStyles } from "./VirtualTeam.native.styles";
import { VirtualTeamProps } from "./VirtualTeam.types";

export const VirtualTeam: FunctionComponent<VirtualTeamProps> = ({ team, reverseOrder }) => {
  const teamStyles = [virtualTeamStyles.team, reverseOrder && virtualTeamStyles.reverseOrder];
  const teamNameStyles = [virtualTeamStyles.teamName, reverseOrder && virtualTeamStyles.reverseOrderTeamName];
  const isTeamNameSingleWord = team?.name?.split(/\s+/).length === 1;

  return (
    <View {...getTestProps(TEAM, false)} style={teamStyles}>
      <Text
        {...getTestProps(NAME, false)}
        style={teamNameStyles}
        textBreakStrategy={"simple"}
        numberOfLines={!isTeamNameSingleWord ? 2 : 1}
      >
        {team.name}
      </Text>
    </View>
  );
};
