import { FunctionComponent } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import {
  FOOTBALL_SCOREBOARD,
  RED_CARDS_DURATION_CONTAINER,
} from "@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScoreboard.selectors";
import { viewDefault } from "@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScoreboard.styles";
import { versus } from "@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScore/FootballScore.styles";
import {
  FOOTBALL_SCORE,
  VERSUS,
  VERSUS_CONTAINER,
} from "@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScore/FootballScore.selectors";

import { separator } from "./VirtualFootballScoreboard.styles";
import { VirtualFootballScoreboardProps } from "./VirtualFootballScoreboard.types";
import { VirtualTeam } from "../VirtualTeam/VirtualTeam.native";

export const VirtualFootballScoreboard: FunctionComponent<VirtualFootballScoreboardProps> = ({ home, away }) => (
  <View {...getTestProps(FOOTBALL_SCOREBOARD, false)} style={viewDefault.footballScoreboard}>
    <View {...getTestProps(RED_CARDS_DURATION_CONTAINER, false)} style={viewDefault.durationContainer} />
    <View style={viewDefault.container}>
      <VirtualTeam team={home} reverseOrder />

      <View {...getTestProps(FOOTBALL_SCORE, false)}>
        <View style={[versus.container, versus.containerDefault]} {...getTestProps(VERSUS_CONTAINER, false)}>
          <View style={[versus.shape, separator.virtualShape]} {...getTestProps(VERSUS, false)} />
        </View>
      </View>

      <VirtualTeam team={away} reverseOrder={false} />
    </View>
  </View>
);
