import { FunctionComponent, memo, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Alert, BottomSheet, MarketBlurbs, SegmentedControl } from "@ppb/the-wall-native";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import styles from "./ObbSquadVsSquadPlayerPicker.native.styles";
import { i18n } from "../../helpers/i18n";
import { errorMap, SquadId } from "../../helpers/obb";
import { Player, useSortedObbPlayersList } from "../../hooks/useSortedObbPlayersList";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.native";
import { PlayerPickerSquadVsSquadCard } from "./snowflakes/PlayerPickerSquadVsSquadCard/PlayerPickerSquadVsSquadCard.native";

const PlayerPickerNotifications: FunctionComponent<{
  urn: string;
  errorCode: string | null;
  hasReachedSquadLimit: boolean;
  dispatchClearSquadBetModalError: (urn: string) => void;
}> = memo(({ urn, errorCode, hasReachedSquadLimit, dispatchClearSquadBetModalError }) => {
  let alertProps: AlertProps | null = null;

  if (errorCode) {
    const { level, hasDescription, dismissible } = errorMap[errorCode];

    alertProps = {
      type: level || AlertType.Warning,
      message: i18n({
        key: "I18N.OBB.ERROR.TITLE",
        interpolationValues: { errorCode },
      }),
      detail: hasDescription
        ? i18n({
            key: "I18N.OBB.ERROR.DETAIL",
            interpolationValues: { errorCode },
          })
        : "",
      showCloseIcon: dismissible,
    };
  } else if (hasReachedSquadLimit) {
    alertProps = {
      type: AlertType.Info,
      message: i18n({ key: "I18N.OBB.SQUADBET.MODAL_MAX_PLAYERS" }),
      showCloseIcon: false,
    };
  }

  if (!alertProps) return null;

  return <Alert {...alertProps} onClose={() => dispatchClearSquadBetModalError(urn)} />;
});

PlayerPickerNotifications.displayName = "PlayerPickerNotifications";

const ObbSquadBetPlayerPicker: FunctionComponent<ComponentProps> = ({
  urn,
  i18nLabels,
  eventParticipants,
  firstSquadModalParticipantsNames,
  secondSquadModalParticipantsNames,
  firstSquadJerseys,
  secondSquadJerseys,
  firstSquadStatValue,
  secondSquadStatValue,
  statsLabel,
  title,
  participantInfo,
  selectedSquadId,
  firstSquadOdds,
  secondSquadOdds,
  hasReachedFirstSquadLimit,
  hasReachedSecondSquadLimit,
  isSaveChangesDisabled,
  errorCode,
  eventName,
  incidentTypeLabel,
  modalLegs,
  outcomeLabel,
  isObbSquadVsSquadPlayerPickerConsistencyVariantActive,
  isPlayerSelectedInSelectedSquad,
  isPlayerSelected,
  isPlayerDisabled,
  handleSquadChange,
  onDismiss,
  dispatchToggleObbSquadVsSquadModalParticipant,
  dispatchSquadVsSquadSaveModalChanges,
  dispatchClearSquadBetModalError,
  dispatchTaggingInteractionClick,
  dispatchToggleObbSquadBetModalParticipantAnalytics,
  dispatchPlayerPickerClose,
  dispatchAddLegToBetslip,
}) => {
  const { players } = useSortedObbPlayersList(eventParticipants);

  const SQUAD_KEYS = {
    FIRST_SQUAD: "1",
    SECOND_SQUAD: "2",
  };

  const hasReachedSquadLimit =
    selectedSquadId === SQUAD_KEYS.FIRST_SQUAD ? hasReachedFirstSquadLimit : hasReachedSecondSquadLimit;

  const handleClosePlayerPicker = useCallback(() => {
    onDismiss();
    dispatchPlayerPickerClose(urn, eventName, incidentTypeLabel);
  }, [onDismiss, dispatchPlayerPickerClose, urn, eventName, incidentTypeLabel]);

  const handleSelectParticipant = useCallback(
    (player: Player) => {
      // if the limit was reached we still want to allow the user to remove players from the squad but not add
      if (hasReachedSquadLimit && !isPlayerSelectedInSelectedSquad(player)) return;

      dispatchToggleObbSquadVsSquadModalParticipant(urn, player.urn, selectedSquadId);
      dispatchToggleObbSquadBetModalParticipantAnalytics(
        urn,
        eventName,
        incidentTypeLabel,
        player.urn,
        player.player.name,
        selectedSquadId,
      );
    },
    [
      dispatchToggleObbSquadVsSquadModalParticipant,
      hasReachedSquadLimit,
      isPlayerSelectedInSelectedSquad,
      selectedSquadId,
      urn,
      eventName,
      incidentTypeLabel,
      dispatchToggleObbSquadBetModalParticipantAnalytics,
    ],
  );

  const headerContent = useMemo(
    () => (
      <View style={styles.header}>
        <SegmentedControl
          onPress={(squadId) => {
            handleSquadChange(squadId as SquadId);
            dispatchTaggingInteractionClick(squadId as SquadId, urn, eventName, incidentTypeLabel);
          }}
          options={[
            { key: SQUAD_KEYS.FIRST_SQUAD, value: i18nLabels.firstSquad },
            { key: SQUAD_KEYS.SECOND_SQUAD, value: i18nLabels.secondSquad },
          ]}
          selectedOption={selectedSquadId}
        />
        <MarketBlurbs marketInfoCallback={() => {}} text={participantInfo} />
        <PlayerPickerNotifications
          urn={urn}
          errorCode={errorCode}
          hasReachedSquadLimit={hasReachedSquadLimit}
          dispatchClearSquadBetModalError={dispatchClearSquadBetModalError}
        />
      </View>
    ),
    [
      SQUAD_KEYS.FIRST_SQUAD,
      SQUAD_KEYS.SECOND_SQUAD,
      dispatchClearSquadBetModalError,
      errorCode,
      handleSquadChange,
      hasReachedSquadLimit,
      i18nLabels.firstSquad,
      i18nLabels.secondSquad,
      participantInfo,
      selectedSquadId,
      urn,
      dispatchTaggingInteractionClick,
      eventName,
      incidentTypeLabel,
    ],
  );

  const memoizedIsPlayerSelectedInTheSquad = useCallback(
    (player: Player) => isPlayerSelectedInSelectedSquad(player),
    [isPlayerSelectedInSelectedSquad],
  );

  const memoizedIsPlayerDisabled = useCallback(
    (player: Player) =>
      (hasReachedSquadLimit && !isPlayerSelected(player)) ||
      isPlayerDisabled(player.incidentTypes || {}) ||
      (isPlayerSelected(player) && !isPlayerSelectedInSelectedSquad(player)),
    [hasReachedSquadLimit, isPlayerSelected, isPlayerDisabled, isPlayerSelectedInSelectedSquad],
  );

  const squadVsSquadCard = (
    <PlayerPickerSquadVsSquadCard
      firstSquadParticipantsNames={firstSquadModalParticipantsNames}
      secondSquadParticipantsNames={secondSquadModalParticipantsNames}
      firstSquadJerseys={firstSquadJerseys}
      secondSquadJerseys={secondSquadJerseys}
      firstSquadStatValue={firstSquadStatValue}
      secondSquadStatValue={secondSquadStatValue}
      contextualStatsText={statsLabel}
      saveChangesLabel={i18nLabels.saveChangesLabel}
      firstSquadOdds={firstSquadOdds}
      secondSquadOdds={secondSquadOdds}
      firstSquadLabel={i18nLabels.firstSquad}
      secondSquadLabel={i18nLabels.secondSquad}
      alertLabel={i18nLabels.alertLabel}
      oddsLabel={i18nLabels.oddsLabel}
      isSaveChangesDisabled={isSaveChangesDisabled}
      modalLegs={modalLegs}
      outcomeLabel={outcomeLabel}
      isExperimentActive={isObbSquadVsSquadPlayerPickerConsistencyVariantActive}
      cardUrn={urn}
      eventName={eventName}
      onBetButtonClick={(legId: string, cardUrn: string, eventName?: string) => {
        dispatchAddLegToBetslip(legId, cardUrn, eventName);
        dispatchSquadVsSquadSaveModalChanges(cardUrn);
        onDismiss();
      }}
      onSaveChanges={() => {
        dispatchSquadVsSquadSaveModalChanges(urn);
        dispatchTaggingInteractionClick(i18nLabels.saveChangesLabel, urn, eventName, incidentTypeLabel);
        handleClosePlayerPicker();
      }}
    />
  );

  return (
    <BottomSheet
      title={title}
      onHeaderIconTap={handleClosePlayerPicker}
      showOverlay={true}
      showContentFullHeight={true}
      withModal={true}
      headerContent={headerContent}
      footerContent={squadVsSquadCard}
    >
      <View style={styles.container}>
        <View style={styles.playerList}>
          {players.map((player) => (
            <ObbPlayersRowCard
              key={player.urn}
              participant={player}
              isSelected={memoizedIsPlayerSelectedInTheSquad(player)}
              handleSelectParticipant={() => handleSelectParticipant(player)}
              isPlayerDisabled={memoizedIsPlayerDisabled(player)}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export default ObbSquadBetPlayerPicker;
