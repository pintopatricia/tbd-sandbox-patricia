import type { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Collapse, Placeholder, Text } from "@ppb/the-wall-native";
import {
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_HEADER_TITLE,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_STATS_CONTAINER,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_TITLE,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE,
} from "./FootballPlayerCompetitionStatsCard.native.selectors";
import styles from "./FootballPlayerCompetitionStatsCard.native.styles";
import useFootballPlayerCompetitionStatsCardVM from "../viewmodel/FootballPlayerCompetitionStatsCard.viewmodel";

export const CompetitionStat = ({ label, value }: { label: string; value: number | undefined }) => (
  <View style={styles.statItem} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM, false)}>
    <Text style={styles.statLabel} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL, false)}>
      {label}
    </Text>
    <Text style={styles.statValue} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE, false)}>
      {value ?? "-"}
    </Text>
  </View>
);

const FootballPlayerCompetitionStatsCard: FunctionComponent<{ urn: string; visible: boolean }> = ({ urn, visible }) => {
  const {
    vm: { data },
    loading,
    called,
  } = useFootballPlayerCompetitionStatsCardVM(urn, visible);

  if (!called || loading) {
    return <Placeholder style={styles.placeholder} />;
  }
  if (called && !data?.stats) {
    return (
      <Text {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL)}>No season stats available.</Text>
    );
  }

  const { stats } = data ?? {};

  return (
    <View style={styles.container} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER, false)}>
      <Text style={styles.statTitle} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_TITLE, false)}>
        Performance
      </Text>
      <View style={styles.collapseWrapper}>
        <Collapse
          header={
            <View style={styles.collapseHeader}>
              <Text
                style={styles.collapseHeaderText}
                {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_HEADER_TITLE, false)}
              >
                Competition Stats
              </Text>
            </View>
          }
          isOpen={true}
          setIsOpen={() => {}}
        >
          <View style={styles.stats} {...getTestProps(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_STATS_CONTAINER, false)}>
            <CompetitionStat label="Goals" value={stats?.totalGoals} />
            <CompetitionStat label="Assists" value={stats?.totalAssists} />
            <CompetitionStat label="Cards" value={stats?.totalCards} />
          </View>
        </Collapse>
      </View>
    </View>
  );
};

export default FootballPlayerCompetitionStatsCard;
