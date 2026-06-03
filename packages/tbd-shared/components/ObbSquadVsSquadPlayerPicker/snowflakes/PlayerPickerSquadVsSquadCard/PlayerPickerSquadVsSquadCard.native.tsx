import { FunctionComponent } from "react";
import { View } from "react-native";
import { Alert, Divider, PrimaryButton, Text } from "@ppb/the-wall-native";
import { AlertType, OddsSize } from "@ppb/the-wall-common/types";
import { Odds } from "@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds";
import { PlayerPickerSquadVsSquadCardProps } from "./props";
import styles from "./PlayerPickerSquadVsSquadCard.native.styles";
import ConnectedObbBetButton from "../../../ObbBetButton";
import { ContextualStatsComparison } from "../../../ObbSquadVsSquadCard/snowflakes/ContextualStatsComparison/ContextualStatsComparison.native";
import ObbBetButton from "../../../ObbBetButton/ObbBetButton.native";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.native";

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
  <View style={styles.cardContainer}>
    <View style={styles.squadsContainer}>
      <View style={styles.microPlayerContainer}>
        <Text style={styles.squadLabel}>{firstSquadLabel}</Text>
        <ObbMicroPlayer variant="multi" players={firstSquadParticipantsNames} jerseys={firstSquadJerseys} />
      </View>

      <Text style={[styles.vsText, styles.entryPointGap]}>VS</Text>

      <View style={styles.microPlayerContainer}>
        <Text style={styles.squadLabel}>{secondSquadLabel}</Text>
        <ObbMicroPlayer variant="multi" players={secondSquadParticipantsNames} jerseys={secondSquadJerseys} />
      </View>
    </View>

    <ContextualStatsComparison
      leftValue={firstSquadStatValue}
      text={contextualStatsText}
      rightValue={secondSquadStatValue}
    />

    {!!firstSquadParticipantsNames.length && !!secondSquadParticipantsNames.length ? (
      <>
        {isExperimentActive ? (
          <>
            <Divider />
            <Text style={styles.outcomeLabel}>{outcomeLabel}</Text>
            <View style={styles.betButtonsContainer}>
              {modalLegs.map((leg) => (
                <View style={styles.betButton} key={leg}>
                  <ConnectedObbBetButton
                    key={leg}
                    cardUrn={cardUrn}
                    eventName={eventName}
                    component={ObbBetButton}
                    legId={leg}
                    onClick={() => onBetButtonClick(leg, cardUrn, eventName)}
                  />
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.oddsContainer}>
              <View style={styles.squadOdds}>
                <Text style={styles.label}>{oddsLabel}</Text>
                <Odds value={firstSquadOdds} size={OddsSize.SMALL} />
              </View>
              <View style={styles.squadOdds}>
                <Odds value={secondSquadOdds} size={OddsSize.SMALL} />
                <Text style={styles.label}>{oddsLabel}</Text>
              </View>
            </View>
            <PrimaryButton label={saveChangesLabel} onTap={onSaveChanges} disabled={isSaveChangesDisabled} />
          </>
        )}
      </>
    ) : (
      <Alert type={AlertType.Info} message={alertLabel} />
    )}
  </View>
);

export default PlayerPickerSquadVsSquadCard;
