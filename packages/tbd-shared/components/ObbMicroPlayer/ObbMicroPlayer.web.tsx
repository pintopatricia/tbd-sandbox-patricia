import type { FunctionComponent } from "react";
import { Fragment, memo, useMemo } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, SystemIconName } from "@ppb/the-wall-icons";
import classNames from "classnames";
import styles from "./ObbMicroPlayer.web.css";
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
import { ActionLink } from "@ppb/the-wall-web";
import { i18n } from "../../helpers/i18n";

const jerseysStyles: Record<string, string | undefined> = {
  posRight: styles.posRight,
  posLeft: styles.posLeft,
  level1: styles.level1,
  level2: styles.level2,
  level3: styles.level3,
};

const buildJersey = (jersey: Jersey, classnames: Array<string | undefined>, index: number) => {
  if (!jersey) {
    return (
      <div key={index} className={classNames(classnames)} data-testid="fallback-jersey">
        <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />
      </div>
    );
  }
  return <img key={index} className={classNames(classnames)} src={jersey} alt="" />;
};

const buildLevelAndSide = (isEven: boolean, index: number) => {
  const level = `level${getJerseyLevel(isEven, index)}`;
  const side = index % 2 === 1 ? "posRight" : "posLeft";
  return { level, side };
};

const buildEvenNumberOfJerseys = (jerseys: Jersey[], jerseyClassName: string) => {
  const jerseyElements = jerseys.map((jersey, index) => {
    if (index === 0 || index === 1) {
      const pos = index === 0 ? "posRight" : "posLeft";

      return {
        element: buildJersey(jersey, [styles.jersey, styles.center, jerseysStyles[pos], jerseyClassName], index),
        zOrder: 100 - index,
      };
    }

    const { level, side } = buildLevelAndSide(true, index);
    const levelNum = Math.floor(index / 2);

    return {
      element: buildJersey(
        jersey,
        [styles.jersey, jerseysStyles[side], jerseysStyles[level], styles.pair, jerseyClassName],
        index,
      ),
      zOrder: levelNum,
    };
  });

  return jerseyElements.sort((a, b) => a.zOrder - b.zOrder).map((item) => item.element);
};

const buildOddNumberOfJerseys = (jerseys: Jersey[], jerseyClassName: string) => {
  const jerseyElements = jerseys.map((jersey, index) => {
    if (index === 0) {
      return { element: buildJersey(jersey, [styles.jersey, styles.center, jerseyClassName], index), zOrder: 100 };
    }

    const { level, side } = buildLevelAndSide(false, index);
    const levelNum = Math.ceil(index / 2);

    return {
      element: buildJersey(jersey, [styles.jersey, jerseysStyles[side], jerseysStyles[level], jerseyClassName], index),
      zOrder: levelNum,
    };
  });

  return jerseyElements.sort((a, b) => a.zOrder - b.zOrder).map((item) => item.element);
};

const multiPlayerJerseys = (jerseys: Jersey[], jerseyClassName: string) => {
  const limitedJerseys = getLimitedMultiPlayerJerseys(jerseys);

  if (limitedJerseys.length % 2 === 0) {
    return buildEvenNumberOfJerseys(limitedJerseys, jerseyClassName);
  }

  return buildOddNumberOfJerseys(limitedJerseys, jerseyClassName);
};

const buildSinglePlayerName = (player: PlayerNames) => (
  <>
    {!!player.firstName && (
      <span className={classNames(styles.firstName, { [styles.lastName]: !player.lastName })}>{player.firstName}</span>
    )}
    {!!player.lastName && <span className={styles.lastName}>{player.lastName}</span>}
  </>
);

const buildPlayersNameEmptyState = () => (
  <span className={styles.nameEmptyState}>{i18n({ key: "I18N.OBB.MICRO_PLAYER.NO_PLAYERS.LABEL" })}</span>
);

const buildMultiplePlayersName = (
  players: PlayerNames[],
  isActionLinkEnabled?: boolean,
  onActionLinkClick?: () => void,
) => {
  const overflowCount = getOverflowPlayersCount(players);

  return (
    <>
      <div className={styles.multiplePlayers}>
        {players.slice(0, MAX_PLAYERS_NAME).map((player, index) => {
          const firstName = player.firstName?.trim();
          const lastName = player.lastName?.trim();
          return (
            <Fragment key={index}>
              {!!firstName && !!lastName ? (
                <>
                  <span className={styles.multipleFirstName}>{firstName} </span>
                  <span className={styles.multipleLastName}>{lastName}</span>
                </>
              ) : (
                <span className={styles.multipleLastName}>{firstName || lastName}</span>
              )}
              {index < MAX_PLAYERS_NAME - 1 && index < players.length - 1 && (
                <span className={styles.multipleFirstName}>, </span>
              )}
            </Fragment>
          );
        })}
      </div>
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
          <span className={styles.playersDisabledLabel}>
            {i18n({
              key: "I18N.OBB.MICRO_PLAYER.MORE_PLAYERS.LABEL",
              interpolationValues: { count: overflowCount },
            })}
          </span>
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

  const jerseyClassName = jerseySize === "large" ? styles.jerseyLarge : styles.jersey;

  const jerseyContent = useMemo(
    () => (isMulti ? multiPlayerJerseys(jerseys, jerseyClassName) : buildJersey(jerseys[0], [jerseyClassName], 0)),
    [isMulti, jerseys, jerseyClassName],
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
      <div className={styles.removePlayerContainer}>
        <div
          role="button"
          aria-label="Remove player"
          className={styles.removePlayerTouchContainer}
          tabIndex={0}
          onClick={() => onRemovePlayerClick()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRemovePlayerClick();
            }
          }}
        >
          <div className={styles.removePlayerButton}>
            <GenericIcon name={SystemIconName.CLOSE} color="var(--micro-player-close-icon-colour)" />
          </div>
        </div>
      </div>
    );
  }, [isMulti, onRemovePlayerClick]);

  return (
    <div className={styles.microPlayerWrapper}>
      <div className={classNames(styles.microPlayer, { [styles.multiVariant]: isMulti })}>
        <div
          className={classNames(styles.jerseyContainer, {
            [styles.jerseyContainerBackground]: hasBackground,
          })}
        >
          {jerseyContent}
          {removePlayerButton}
        </div>
        {nameContainer && <div className={styles.nameContainer}>{nameContainer}</div>}
      </div>
    </div>
  );
};

export const ObbMicroPlayer = memo(ObbMicroPlayerComponent, areObbMicroPlayerPropsEqual);
