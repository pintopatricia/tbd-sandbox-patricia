import { useMemo, useCallback, forwardRef } from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, SupportingContentIconName } from "@ppb/the-wall-icons";

import styles from "./ObbPlayersRowCard.web.css";

import { formatPlayerStat, splitName } from "../../helpers/obb";
import { ObbPlayersRowCardProps } from "./ObbPlayersRowCard.types";

export const ObbPlayersRowCard = forwardRef<HTMLDivElement, ObbPlayersRowCardProps>(
  ({ participant, isSelected, handleSelectParticipant, isPlayerDisabled }, ref) => {
    const { id, name, position, shirtNumber } = participant.player || {};

    const playerName = useMemo(() => {
      const { firstName, lastName } = splitName(name);

      const hasFirst = Boolean(firstName);
      const hasLast = Boolean(lastName);

      return (
        <div className={styles.playerNameContainer}>
          {(hasFirst && !hasLast) || (!hasFirst && hasLast) ? (
            <span className={classnames(styles.lastName, { [styles.labelDisabled]: isPlayerDisabled })}>
              {firstName ?? lastName}
            </span>
          ) : (
            <>
              <span className={classnames(styles.firstName, { [styles.labelDisabled]: isPlayerDisabled })}>
                {firstName}
              </span>
              <span className={classnames(styles.lastName, { [styles.labelDisabled]: isPlayerDisabled })}>
                {lastName}
              </span>
            </>
          )}
        </div>
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
          <img className={styles.jersey} src={participant.jersey} alt="" />
        ) : (
          <div className={styles.fallbackJersey}>
            <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />
          </div>
        ),
      [participant.jersey],
    );

    return (
      <div
        ref={ref}
        className={classnames(styles.playerCardContainer, { [styles.highlighted]: isSelected })}
        role="button"
        tabIndex={0}
        onClick={() => onSelectPlayer()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelectPlayer();
          }
        }}
      >
        <div className={styles.playerInfoJersey}>{jerseyContent}</div>
        <div className={styles.playerRowInfoContainer}>
          <div className={styles.playerNameAndPosition}>
            {playerName}
            <span
              className={classnames(styles.playerPositionAndNumber, {
                [styles.labelDisabled]: isPlayerDisabled,
              })}
            >
              {[position?.trim(), shirtNumber ? `#${shirtNumber}` : null].filter(Boolean).join(" ")}
            </span>
          </div>
          <div className={styles.playerRowStats}>
            <div className={classnames(styles.playerStatsIcon, { [styles.playerStatsIconDisabled]: isPlayerDisabled })}>
              <GenericIcon name={SupportingContentIconName.MATCH_STATS} />
            </div>
            <span className={classnames(styles.playerStatValue, { [styles.labelDisabled]: isPlayerDisabled })}>
              {formattedPlayerStat}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

ObbPlayersRowCard.displayName = "ObbPlayersRowCard";
