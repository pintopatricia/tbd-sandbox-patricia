import type { JSX } from "react";
import { FunctionComponent } from "react";

import { OddsSize } from "@ppb/the-wall-common/types";
import { Odds } from "@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { Placeholder } from "@ppb/the-wall-web";

import classnames from "classnames";

import styles from "./ObbPlayersListCard.web.css";

import { splitName } from "../../helpers/obb";
import { getProgressBarProps } from "../ObbPvPCard/snowflakes/StatsGroup/StatsGroup.helper";
import { i18n } from "../../helpers/i18n";
import { ObbPlayersListCardProps } from "./ObbPlayersListCard.types";

export const ObbPlayersListCard: FunctionComponent<ObbPlayersListCardProps> = ({
  participant,
  isSelected,
  handleSelectParticipant,
  maxStatValue,
  isLoading,
}) => {
  const isPlayerDisabled = !participant?.odds;

  const renderPlayerName = (name: string): JSX.Element => {
    const { firstName, lastName } = splitName(name);

    return (
      <div className={styles.playerNameContainer}>
        <span className={classnames(styles.firstName, { [styles.labelDisabled]: isPlayerDisabled })}>{firstName}</span>
        <span className={classnames(styles.lastName, { [styles.labelDisabled]: isPlayerDisabled })}>{lastName}</span>
      </div>
    );
  };

  const onSelectPlayer = () => {
    if (isPlayerDisabled || isLoading || isSelected) {
      return;
    }
    handleSelectParticipant(participant.player?.id);
  };

  return (
    <div
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
      <div className={styles.playerInfoContainer}>
        {renderPlayerName(participant.player?.name)}
        <span className={classnames(styles.position, { [styles.supportingTextDisabled]: isPlayerDisabled })}>
          {participant.player?.position}
        </span>
      </div>
      <div className={styles.playerValuesContainer}>
        <div className={styles.playerStats}>
          <span className={classnames(styles.statsLabel, { [styles.supportingTextDisabled]: isPlayerDisabled })}>
            {i18n({ key: "I18N.OBB.STATS.PER_GAME" })}
          </span>
          <div className={styles.statsContainer}>
            <span className={classnames(styles.statsValue, { [styles.statsDisabled]: isPlayerDisabled })}>
              {participant?.stat != null ? participant?.stat.toFixed(2) : "-"}
            </span>
            <ProgressBar
              barStat
              {...getProgressBarProps(
                { color: participant.color, value: participant.stat ?? null },
                maxStatValue,
                "right",
                isPlayerDisabled,
              )}
            />
          </div>
        </div>
        {isLoading ? (
          <div className={styles.placeholder}>
            <Placeholder />
          </div>
        ) : (
          <div className={styles.odds}>
            <Odds value={participant.odds ?? "-"} size={OddsSize.SMALL} disabled={isPlayerDisabled} />
          </div>
        )}
      </div>
    </div>
  );
};
