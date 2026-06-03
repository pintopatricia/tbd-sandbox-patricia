import { Pressable, View } from "react-native";
import { Fragment, useMemo, memo } from "react";
import type { FunctionComponent } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { ImageStyle } from "react-native-fast-image";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AssetsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import { ActionLink, Text } from "@ppb/the-wall-native";
import {
  MICROPLAYER,
  MICROPLAYER_JERSEY,
  MICROPLAYER_NAMECONTAINER,
  MICROPLAYER_FIRSTNAME,
  MICROPLAYER_LASTNAME,
  MICRO_PLAYER_MULTI_FIRSTNAME,
  MICRO_PLAYER_MULTI_LASTNAME,
  MICROPLAYER_MORE_PLAYERS_DISABLED,
  MICROPLAYER_EMPTY_STATE,
  MICROPLAYER_FALLBACK_JERSEY,
  MICROPLAYER_REMOVE_BUTTON,
} from "./ObbMicroPlayer.native.selectors";

import styles from "./ObbMicroPlayer.native.styles";
import {
  areObbMicroPlayerPropsEqual,
  getJerseyLevel,
  getLimitedMultiPlayerJerseys,
  getOverflowPlayersCount,
  getPlayerNameVariant,
  MAX_PLAYERS_NAME,
} from "./ObbMicroPlayer.helpers";
import { ObbMicroPlayerProps, Jersey } from "./ObbMicroPlayer.types";
import { PlayerNames } from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";

type JerseyLevel = 1 | 2 | 3;

const JERSEY_BIG_SCALE = Number(tokens.MicroPlayerJerseyBigScale);
const JERSEY_BIG_POSITION = 17;
const JERSEY_BIG_POSITION_PAIR = 27;
const JERSEY_MEDIUM_SCALE = Number(tokens.MicroPlayerJerseyMediumScale);
const JERSEY_MEDIUM_POSITION = 30;
const JERSEY_MEDIUM_POSITION_PAIR = 40;
const JERSEY_SMALL_SCALE = Number(tokens.MicroPlayerJerseySmallScale);
const JERSEY_SMALL_POSITION = 40;

const JERSEY_LEVELS: Record<
  JerseyLevel,
  {
    zIndex: number;
    scale: number;
    position: number;
    positionPair: number | null;
  }
> = {
  1: {
    zIndex: 3,
    scale: JERSEY_BIG_SCALE,
    position: JERSEY_BIG_POSITION,
    positionPair: JERSEY_BIG_POSITION_PAIR,
  },
  2: {
    zIndex: 2,
    scale: JERSEY_MEDIUM_SCALE,
    position: JERSEY_MEDIUM_POSITION,
    positionPair: JERSEY_MEDIUM_POSITION_PAIR,
  },
  3: {
    zIndex: 1,
    scale: JERSEY_SMALL_SCALE,
    position: JERSEY_SMALL_POSITION,
    positionPair: null,
  },
};

const getJerseyStyle = (level: number, side: "left" | "right", pair: boolean) => {
  const config = JERSEY_LEVELS[level as JerseyLevel];
  if (!config) {
    return { zIndex: 1, transform: [{ translateX: 0 }, { scale: 1 }] };
  }

  let translateX = 0;
  if (level === 3) {
    translateX = side === "left" ? -config.position : config.position;
  } else if (pair && config.positionPair !== null) {
    translateX = side === "left" ? -config.positionPair : config.positionPair;
  } else {
    translateX = side === "left" ? -config.position : config.position;
  }

  return {
    zIndex: config.zIndex,
    transform: [{ translateX }, { scale: config.scale }],
  };
};
const buildJersey = (jersey: Jersey, style: StyleProp<ImageStyle>, index: number) => {
  if (!jersey) {
    return (
      <View
        key={index}
        style={[style as StyleProp<ViewStyle>, styles.defaultImage]}
        {...getTestProps(MICROPLAYER_FALLBACK_JERSEY)}
      >
        <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />
      </View>
    );
  }

  return <TBDImage source={jersey} key={index} style={style as ImageStyle} />;
};

const buildLevelAndSide = (isEven: boolean, index: number): { level: number; side: "left" | "right" } => {
  const level = getJerseyLevel(isEven, index);
  const side = index % 2 === 1 ? "left" : "right";
  return { level, side };
};

const buildEvenNumberOfJerseys = (jerseys: Jersey[], multiJerseyStyle: StyleProp<ImageStyle>) =>
  jerseys.map((jersey, index) => {
    if (index === 0 || index === 1) {
      return buildJersey(
        jersey,
        [
          multiJerseyStyle,
          styles.centerJersey,
          ...(index === 0 ? [styles.centerRight] : []),
          ...(index === 1 ? [styles.centerLeft] : []),
        ],
        index,
      );
    }

    const { level, side } = buildLevelAndSide(true, index);

    const jerseyStyle = getJerseyStyle(level, side, true);

    return buildJersey(jersey, [multiJerseyStyle, jerseyStyle], index);
  });

const buildOddNumberOfJerseys = (jerseys: Jersey[], multiJerseyStyle: StyleProp<ImageStyle>) =>
  jerseys.map((jersey, index) => {
    if (index === 0) {
      return buildJersey(jersey, [multiJerseyStyle, styles.centerJersey], index);
    }

    const { level, side } = buildLevelAndSide(false, index);

    const jerseyStyle = getJerseyStyle(level, side, false);

    return buildJersey(jersey, [multiJerseyStyle, jerseyStyle], index);
  });

const multiPlayerJerseys = (jerseys: Jersey[], multiJerseyStyle: StyleProp<ImageStyle>) => {
  const limitedJerseys = getLimitedMultiPlayerJerseys(jerseys);

  if (limitedJerseys.length % 2 === 0) {
    return buildEvenNumberOfJerseys(limitedJerseys, multiJerseyStyle);
  }

  return buildOddNumberOfJerseys(limitedJerseys, multiJerseyStyle);
};

const buildSinglePlayerName = (player: PlayerNames) => (
  <>
    {!!player.firstName && (
      <Text
        style={[styles.firstName, !player.lastName && styles.lastName]}
        numberOfLines={1}
        ellipsizeMode="tail"
        {...getTestProps(MICROPLAYER_FIRSTNAME)}
      >
        {player.firstName}
      </Text>
    )}
    {!!player.lastName && (
      <Text style={styles.lastName} numberOfLines={1} ellipsizeMode="tail" {...getTestProps(MICROPLAYER_LASTNAME)}>
        {player.lastName}
      </Text>
    )}
  </>
);

const buildPlayersNameEmptyState = () => (
  <Text style={styles.nameEmptyState} {...getTestProps(MICROPLAYER_EMPTY_STATE)}>
    {i18n({ key: "I18N.OBB.MICRO_PLAYER.NO_PLAYERS.LABEL" })}
  </Text>
);

const buildMultiplePlayersName = (
  players: PlayerNames[],
  isActionLinkEnabled?: boolean,
  onActionLinkClick?: () => void,
) => {
  const overflowCount = getOverflowPlayersCount(players);

  return (
    <>
      <View style={styles.multiplePlayers}>
        {players.slice(0, MAX_PLAYERS_NAME).map((player, index) => {
          const firstName = player.firstName?.trim();
          const lastName = player.lastName?.trim();
          return (
            <Fragment key={index}>
              {!!firstName && !!lastName ? (
                <>
                  <Text style={styles.multipleFirstName} {...getTestProps(MICRO_PLAYER_MULTI_FIRSTNAME)}>
                    {firstName}{" "}
                  </Text>
                  <Text style={styles.multipleLastName} {...getTestProps(MICRO_PLAYER_MULTI_LASTNAME)}>
                    {lastName}
                  </Text>
                </>
              ) : (
                <Text style={styles.multipleLastName} {...getTestProps(MICRO_PLAYER_MULTI_LASTNAME)}>
                  {firstName || lastName}
                </Text>
              )}
              {index < MAX_PLAYERS_NAME - 1 && index < players.length - 1 && (
                <Text style={styles.multipleFirstName}>, </Text>
              )}
            </Fragment>
          );
        })}
      </View>
      {overflowCount > 0 &&
        (isActionLinkEnabled ? (
          <ActionLink
            onClick={() => onActionLinkClick?.()}
            text={i18n({
              key: "I18N.OBB.MICRO_PLAYER.MORE_PLAYERS.LABEL",
              interpolationValues: { count: overflowCount },
            })}
          ></ActionLink>
        ) : (
          <Text style={styles.playersDisabledLabel} {...getTestProps(MICROPLAYER_MORE_PLAYERS_DISABLED)}>
            {i18n({
              key: "I18N.OBB.MICRO_PLAYER.MORE_PLAYERS.LABEL",
              interpolationValues: { count: overflowCount },
            })}
          </Text>
        ))}
    </>
  );
};

const ObbMicroPlayerComponent: FunctionComponent<ObbMicroPlayerProps> = ({
  players,
  jerseys,
  jerseySize = "small",
  variant = "single",
  hasBackground = true,
  onRemovePlayerClick,
  isActionLinkEnabled,
  onActionLinkClick,
}) => {
  const isMulti = variant === "multi";
  const isLarge = jerseySize === "large";

  const multiJerseyStyle = isLarge ? styles.imageMultiVariantLarge : styles.imageMultiVariant;

  const jerseyContent = useMemo(
    () =>
      isMulti ? (
        multiPlayerJerseys(jerseys, multiJerseyStyle)
      ) : jerseys[0] ? (
        <TBDImage source={jerseys[0]} style={isLarge ? styles.imageLarge : styles.imageSmall} />
      ) : (
        <View style={isLarge ? styles.imageLarge : styles.imageSmall} {...getTestProps(MICROPLAYER_FALLBACK_JERSEY)}>
          <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />
        </View>
      ),
    [jerseys, isMulti, isLarge, multiJerseyStyle],
  );

  const nameVariant = getPlayerNameVariant(players);
  let nameContainer;

  if (nameVariant === "empty") {
    nameContainer = buildPlayersNameEmptyState();
  } else if (nameVariant === "single") {
    nameContainer = buildSinglePlayerName(players[0]);
  } else {
    nameContainer = buildMultiplePlayersName(players, isActionLinkEnabled, onActionLinkClick);
  }

  const removePlayerButton = useMemo(() => {
    if (isMulti) {
      return null;
    }

    if (!onRemovePlayerClick) {
      return null;
    }

    return (
      <View style={styles.removePlayerContainer}>
        <Pressable
          style={styles.removePlayerTouchContainer}
          onPress={() => onRemovePlayerClick()}
          {...getTestProps(MICROPLAYER_REMOVE_BUTTON)}
        >
          <View style={styles.removePlayerButton}>
            <GenericIcon name={SystemIconName.CLOSE} color={tokens.MicroPlayerCloseIconColour} />
          </View>
        </Pressable>
      </View>
    );
  }, [isMulti, onRemovePlayerClick]);

  return (
    <View style={styles.microPlayerWrapper}>
      <View style={[styles.microPlayer, isMulti && styles.microPlayerMultiVariant]} {...getTestProps(MICROPLAYER)}>
        <View
          style={[
            styles.jerseyContainer,
            isLarge && styles.jerseyContainerLarge,
            !hasBackground && { backgroundColor: undefined },
          ]}
          {...getTestProps(MICROPLAYER_JERSEY)}
        >
          {jerseyContent}
        </View>
        {nameContainer && (
          <View style={styles.nameContainer} {...getTestProps(MICROPLAYER_NAMECONTAINER)}>
            {nameContainer}
          </View>
        )}
      </View>
      {removePlayerButton}
    </View>
  );
};

export const ObbMicroPlayer = memo(ObbMicroPlayerComponent, areObbMicroPlayerPropsEqual);
