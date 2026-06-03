import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View, TouchableOpacity } from "react-native";

import { OddsSize } from "@ppb/the-wall-common/types";
import { Odds } from "@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds";

import { Placeholder, ProgressBar, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import * as selector from "./ObbPlayersListCard.native.selectors";

import styles from "./ObbPlayersListCard.native.styles";
import { splitName } from "../../helpers/obb";
import { getProgressBarProps } from "../ObbPvPCard/snowflakes/StatsGroup/StatsGroup.helper";
import { i18n } from "../../helpers/i18n";
import { ObbPlayersListCardProps } from "./ObbPlayersListCard.types";

const getConditionalTestProps = (condition: boolean, testSelector: string) =>
  condition ? getTestProps(testSelector, false) : {};

export const ObbPlayersListCard: FunctionComponent<ObbPlayersListCardProps> = ({
  participant,
  isSelected,
  handleSelectParticipant,
  maxStatValue,
  isLoading,
}) => {
  const isPlayerDisabled = !participant.odds;

  const renderPlayerName = (name: string): JSX.Element => {
    const { firstName, lastName } = splitName(name);

    return (
      <View {...getTestProps(selector.PLAYER_NAME_CONTAINER, false)}>
        <Text
          style={[styles.name, isPlayerDisabled && styles.labelDisabled]}
          {...getTestProps(selector.FIRST_NAME, false)}
        >
          {firstName}
        </Text>
        <Text
          style={[styles.name, isPlayerDisabled && styles.labelDisabled]}
          {...getTestProps(selector.LAST_NAME, false)}
        >
          {lastName}
        </Text>
      </View>
    );
  };

  const onSelectPlayer = () => {
    if (isSelected) {
      return;
    }

    handleSelectParticipant(participant.player?.id);
  };

  return (
    <TouchableOpacity
      onPress={onSelectPlayer}
      disabled={isPlayerDisabled || isLoading}
      style={[styles.playerCardContainer, isSelected && styles.highlighted]}
      {...getTestProps(selector.TEST_ID, false)}
      {...getConditionalTestProps(!!isSelected, selector.HIGHLIGHTED)}
      {...getConditionalTestProps(!!isPlayerDisabled, selector.DISABLED)}
    >
      <View style={styles.playerInfoContainer} {...getTestProps(selector.PLAYER_INFO_CONTAINER, false)}>
        {renderPlayerName(participant.player?.name)}
        <Text
          style={[styles.position, isPlayerDisabled && styles.supportingTextDisabled]}
          {...getTestProps(selector.POSITION, false)}
        >
          {participant.player?.position}
        </Text>
      </View>
      <View style={styles.playerValuesContainer} {...getTestProps(selector.PLAYER_VALUES_CONTAINER, false)}>
        <View style={styles.playerStats} {...getTestProps(selector.PLAYER_STATS, false)}>
          <Text style={[styles.statsLabel, isPlayerDisabled && styles.supportingTextDisabled]}>
            {i18n({ key: "I18N.OBB.STATS.PER_GAME" })}
          </Text>
          <View style={styles.statsContainer} {...getTestProps(selector.STATS_CONTAINER, false)}>
            <Text
              style={[styles.statsValue, isPlayerDisabled && styles.statsDisabled]}
              {...getTestProps(selector.STATS_VALUE, false)}
            >
              {participant?.stat != null ? participant?.stat.toFixed(2) : "-"}
            </Text>
            <ProgressBar
              barStat
              {...getProgressBarProps(
                { color: participant.color, value: participant.stat ?? null },
                maxStatValue,
                "right",
                isPlayerDisabled,
              )}
            />
          </View>
        </View>
        <View style={styles.odds} {...getTestProps(selector.ODDS, false)}>
          {isLoading && (
            <View style={styles.placeholder}>
              <Placeholder />
            </View>
          )}
          <View>
            <Odds value={participant.odds ?? "-"} size={OddsSize.SMALL} disabled={isPlayerDisabled} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
