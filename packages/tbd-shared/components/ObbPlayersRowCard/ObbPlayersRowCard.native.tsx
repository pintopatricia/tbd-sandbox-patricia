import type { JSX } from "react";
import { FunctionComponent, useCallback, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";

import { TBDImage, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AssetsIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import * as selector from "./ObbPlayersRowCard.native.selectors";

import styles from "./ObbPlayersRowCard.native.styles";
import { formatPlayerStat, splitName } from "../../helpers/obb";
import { ObbPlayersRowCardProps } from "./ObbPlayersRowCard.types";

const getConditionalTestProps = (condition: boolean, testSelector: string) =>
  condition ? getTestProps(testSelector, false) : {};

export const ObbPlayersRowCard: FunctionComponent<ObbPlayersRowCardProps> = ({
  participant,
  isSelected,
  handleSelectParticipant,
  isPlayerDisabled,
}) => {
  const { id, name, position, shirtNumber } = participant.player || {};

  const playerName = useMemo((): JSX.Element => {
    const { firstName, lastName } = splitName(name);

    const hasFirst = Boolean(firstName);
    const hasLast = Boolean(lastName);

    return (
      <View style={styles.playerRowNameContainer} {...getTestProps(selector.PLAYER_NAME_CONTAINER, false)}>
        {(hasFirst && !hasLast) || (!hasFirst && hasLast) ? (
          <Text
            style={[styles.name, styles.lastName, isPlayerDisabled && styles.labelDisabled]}
            {...getTestProps(selector.FIRST_NAME, false)}
          >
            {firstName ?? lastName}
          </Text>
        ) : (
          <>
            <Text
              style={[styles.name, isPlayerDisabled && styles.labelDisabled]}
              {...getTestProps(selector.FIRST_NAME, false)}
            >
              {firstName}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.name, styles.lastName, isPlayerDisabled && styles.labelDisabled]}
              {...getTestProps(selector.LAST_NAME, false)}
            >
              {lastName}
            </Text>
          </>
        )}
      </View>
    );
  }, [isPlayerDisabled, name]);

  const formattedPlayerStat = useMemo(() => formatPlayerStat(participant.stat ?? null), [participant.stat]);

  const onSelectPlayer = useCallback(() => {
    if (isPlayerDisabled) {
      return;
    }

    handleSelectParticipant(id);
  }, [isPlayerDisabled, handleSelectParticipant, id]);

  const jerseyContent = useMemo(
    () =>
      participant.jersey ? (
        <TBDImage source={participant.jersey} style={styles.jersey} {...getTestProps(selector.JERSEY, false)} />
      ) : (
        <View style={styles.jersey}>
          <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />
        </View>
      ),
    [participant.jersey],
  );

  return (
    <TouchableOpacity
      onPress={onSelectPlayer}
      disabled={isPlayerDisabled}
      style={[styles.playerRowCardContainer, isSelected && styles.highlighted]}
      {...getTestProps(selector.TEST_ID, false)}
      {...getConditionalTestProps(!!isSelected, selector.HIGHLIGHTED)}
      {...getConditionalTestProps(!!isPlayerDisabled, selector.DISABLED)}
    >
      <View style={styles.playerInfoJersey}>{jerseyContent}</View>
      <View style={styles.playerRowInfoContainer}>
        <View style={styles.playerNameAndPosition}>
          {playerName}
          {(position || shirtNumber) && (
            <Text style={[styles.playerPositionAndNumber, isPlayerDisabled && styles.playerPositionAndNumberDisabled]}>
              {[position?.trim(), shirtNumber ? `#${shirtNumber}` : null].filter(Boolean).join(" ")}
            </Text>
          )}
        </View>
        <View style={styles.playerRowStats}>
          <View style={styles.playerStatsIcon}>{<GenericIcon name={SupportingContentIconName.MATCH_STATS} />}</View>
          <Text style={[styles.playerStatValue, isPlayerDisabled && styles.labelDisabled]}>{formattedPlayerStat}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
