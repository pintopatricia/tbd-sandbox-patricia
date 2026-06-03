import type { FunctionComponent } from "react";
import classnames from "classnames";
import { AlertType, OddsSize } from "@ppb/the-wall-common/types";
import { Alert, Card, Divider, PrimaryButton } from "@ppb/the-wall-web";
import { Odds } from "@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds";
import styles from "./PlayerPickerSquadVsSquadCard.web.css";
import { PlayerPickerSquadVsSquadCardProps } from "./props";
import ConnectedObbBetButton from "../../../ObbBetButton";
import { ContextualStatsComparison } from "../../../ObbSquadVsSquadCard/snowflakes/ContextualStatsComparison/ContextualStatsComparison.web";
import ObbBetButton from "../../../ObbBetButton/ObbBetButton.web";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.web";

export const PlayerPickerSquadVsSquadCard: FunctionComponent<PlayerPickerSquadVsSquadCardProps> = ({
  firstSquadParticipantsNames,
  secondSquadParticipantsNames,
  firstSquadJerseys,
  secondSquadJerseys,
  firstSquadStatValue,
  secondSquadStatValue,
  contextualStatsText,
  firstSquadOdds,
  secondSquadOdds,
  saveChangesLabel,
  firstSquadLabel,
  secondSquadLabel,
  alertLabel,
  oddsLabel,
  isSaveChangesDisabled,
  modalLegs,
  outcomeLabel,
  isExperimentActive,
  cardUrn,
  eventName,
  onSaveChanges,
  onBetButtonClick,
}) => (
  <Card showShadow={true}>
    <div className={styles.squadsContainer}>
      <div className={styles.microPlayerContainer}>
        <div className={styles.squadLabel}>{firstSquadLabel}</div>
        <ObbMicroPlayer
          variant="multi"
          players={firstSquadParticipantsNames}
          jerseys={firstSquadJerseys}
          isActionLinkEnabled={false}
        />
      </div>
      <h2
        className={classnames(styles.vsText, {
          [styles.entryPointGap]: true,
          [styles.defaultGap]: false,
        })}
      >
        VS
      </h2>
      <div className={styles.microPlayerContainer}>
        <div className={styles.squadLabel}>{secondSquadLabel}</div>
        <ObbMicroPlayer
          variant="multi"
          players={secondSquadParticipantsNames}
          jerseys={secondSquadJerseys}
          isActionLinkEnabled={false}
        />
      </div>
    </div>

    {firstSquadParticipantsNames.length === 0 || secondSquadParticipantsNames.length === 0 ? (
      <Alert type={AlertType.Info} message={alertLabel} />
    ) : (
      <>
        <ContextualStatsComparison
          leftValue={firstSquadStatValue}
          text={contextualStatsText}
          rightValue={secondSquadStatValue}
        />
        {isExperimentActive ? (
          <>
            <Divider />
            <span className={styles.outcomeLabel}>{outcomeLabel}</span>
            <div className={styles.betButtonsContainer}>
              {modalLegs.map((leg) => (
                <ConnectedObbBetButton
                  key={leg}
                  cardUrn={cardUrn}
                  eventName={eventName}
                  component={ObbBetButton}
                  legId={leg}
                  onClick={() => onBetButtonClick(leg, cardUrn, eventName)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.oddsContainer}>
              <div className={styles.squadOdds}>
                <div className={styles.label}>{oddsLabel}</div>
                <Odds value={firstSquadOdds} size={OddsSize.SMALL} />
              </div>
              <div className={styles.squadOdds}>
                <Odds value={secondSquadOdds} size={OddsSize.SMALL} />
                <div className={styles.label}>{oddsLabel}</div>
              </div>
            </div>
            <PrimaryButton label={saveChangesLabel} onTap={onSaveChanges} disabled={isSaveChangesDisabled} />
          </>
        )}
      </>
    )}
  </Card>
);

export default PlayerPickerSquadVsSquadCard;
