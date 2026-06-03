import { FunctionComponent, memo, useCallback, useContext } from "react";
import * as React from "react";
import { Alert, BottomSheet, MarketBlurbs, Modal, SegmentedControl } from "@ppb/the-wall-web";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { ConfigContext } from "../Config/ConfigContext";
import styles from "./ObbSquadVsSquadPlayerPicker.web.css";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.web";
import { PlayerPickerSquadVsSquadCard } from "./snowflakes/PlayerPickerSquadVsSquadCard/PlayerPickerSquadVsSquadCard.web";
import { Player, useSortedObbPlayersList } from "../../hooks/useSortedObbPlayersList";
import { errorMap, SquadId } from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";

const PlayerPickerNotifications: React.FC<{
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

  return (
    <div className={styles.alertContainer}>
      <Alert {...alertProps} onClose={() => dispatchClearSquadBetModalError(urn)} />
    </div>
  );
});

PlayerPickerNotifications.displayName = "PlayerPickerNotifications";

const ObbSquadVsSquadPlayerPicker: FunctionComponent<ComponentProps> = ({
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
  incidentTypeLabel,
  eventName,
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
  dispatchToggleObbSquadBetModalParticipantAnalytics,
  dispatchTaggingInteractionClick,
  dispatchPlayerPickerClose,
  dispatchAddLegToBetslip,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

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
  }, [dispatchPlayerPickerClose, eventName, incidentTypeLabel, onDismiss, urn]);

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
      dispatchToggleObbSquadBetModalParticipantAnalytics,
      hasReachedSquadLimit,
      isPlayerSelectedInSelectedSquad,
      selectedSquadId,
      urn,
      eventName,
      incidentTypeLabel,
    ],
  );

  const marketBlurbs = <MarketBlurbs marketInfoCallback={() => {}} text={participantInfo} />;

  const segmentControl = (
    <SegmentedControl
      onClick={(squadId) => {
        handleSquadChange(squadId as SquadId);
        dispatchTaggingInteractionClick(squadId as SquadId, urn, eventName, incidentTypeLabel);
      }}
      options={[
        { key: SQUAD_KEYS.FIRST_SQUAD, value: i18nLabels.firstSquad },
        { key: SQUAD_KEYS.SECOND_SQUAD, value: i18nLabels.secondSquad },
      ]}
      selectedOption={selectedSquadId}
    />
  );

  const playerList = (
    <div className={styles.playerList}>
      {players.map((player) => (
        <ObbPlayersRowCard
          key={player.urn}
          ref={null}
          participant={player}
          isSelected={isPlayerSelectedInSelectedSquad(player)}
          handleSelectParticipant={() => handleSelectParticipant(player)}
          isPlayerDisabled={
            (hasReachedSquadLimit && !isPlayerSelected(player)) ||
            isPlayerDisabled(player.incidentTypes || {}) ||
            (isPlayerSelected(player) && !isPlayerSelectedInSelectedSquad(player))
          }
        />
      ))}
    </div>
  );

  const squadVsSquadCard = (
    <div className={styles.squadVsSquadCardContainer}>
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
          onDismiss();
        }}
      />
    </div>
  );

  const headerContent = (
    <>
      <PlayerPickerNotifications
        urn={urn}
        errorCode={errorCode}
        hasReachedSquadLimit={hasReachedSquadLimit}
        dispatchClearSquadBetModalError={dispatchClearSquadBetModalError}
      />
      <div className={styles.segmentedControlContainer}>{segmentControl}</div>
      {marketBlurbs}
    </>
  );

  const playerPickerContent = <div className={styles.container}>{playerList}</div>;

  return isDesktopLayout ? (
    <Modal
      onDismiss={handleClosePlayerPicker}
      dismissOnOutsideTap={true}
      title={title}
      footerContent={squadVsSquadCard}
      headerContent={headerContent}
    >
      {playerPickerContent}
    </Modal>
  ) : (
    <BottomSheet
      onHeaderIconTap={handleClosePlayerPicker}
      showContentFullHeight={true}
      title={title}
      headerContent={headerContent}
      footerContent={squadVsSquadCard}
    >
      {playerPickerContent}
    </BottomSheet>
  );
};

export default ObbSquadVsSquadPlayerPicker;
