import { FunctionComponent, useCallback, useMemo, useState, memo } from "react";
import * as React from "react";
import { View } from "react-native";
import { Alert, BottomSheet, MarketBlurbs } from "@ppb/the-wall-native";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { ComponentProps, SquadBetCardLeg } from "./props";
import styles from "./ObbSquadBetPlayerPicker.native.styles";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.native";
import { Player, useSortedObbPlayersList } from "../../hooks/useSortedObbPlayersList";
import { PlayerPickerSquadBetCard } from "./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.native";
import { ObbSquadBetAnimationWrapper } from "./snowflakes/ObbSquadBetAnimationWrapper/ObbSquadBetAnimationWrapper.native";
import { errorMap } from "../../helpers/obb";
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

  return <Alert {...alertProps} onClose={() => dispatchClearSquadBetModalError(urn)} />;
});

PlayerPickerNotifications.displayName = "PlayerPickerNotifications";

const ObbSquadBetPlayerPicker: FunctionComponent<ComponentProps> = ({
  urn,
  i18nLabels,
  eventName,
  eventParticipants,
  modalParticipants,
  title,
  participantInfo,
  statsLabel,
  outcomesLabel,
  modalDefaultOutcomeIndex,
  modalLegs: stateModalLegs,
  legsInBetslip,
  modalIsLoadingQuotes,
  incidentType,
  errorCode,
  hasReachedSquadLimit,
  isAnimatedBetButton,
  isPlayerSelected,
  isPlayerDisabled,
  position,
  dispatchToggleObbSquadBetModalParticipant,
  dispatchClearSquadBetModalError,
  onDismiss,
  dispatchPlayerPickerClose,
  dispatchToggleObbSquadBetModalParticipantAnalytics,
  dispatchAddToBetslip,
  dispatchTaggingInteractionClick,
  dispatchSquadBetBetButtonClickAnalytics,
  dispatchToggleObbSquadBetModalRemoveParticipantAnalytics,
}) => {
  const { players } = useSortedObbPlayersList(eventParticipants);
  const [selectedLegs, setSelectedLegs] = useState<Array<string>>([]);

  const handleBetButtonSelection = useCallback(
    (legId: string) => {
      if (selectedLegs.includes(legId)) {
        setSelectedLegs(selectedLegs.filter((f) => f !== legId));
        return;
      }

      setSelectedLegs([...selectedLegs, legId]);
    },
    [selectedLegs, setSelectedLegs],
  );

  const modalLegs: SquadBetCardLeg[] = useMemo(
    () =>
      stateModalLegs.map((leg) => {
        if (selectedLegs.includes(leg.id) && leg.status === "selected") {
          return { ...leg, status: "default" }; // Reset to default if already selected
        }

        if (selectedLegs.includes(leg.id)) {
          return { ...leg, status: "selected" };
        }

        return leg;
      }),
    [stateModalLegs, selectedLegs],
  );

  const handleAddToBetslipButtonClick = useCallback(() => {
    dispatchAddToBetslip(
      selectedLegs.filter((leg) => !legsInBetslip[leg]),
      urn,
      eventName,
      position,
    );
    onDismiss();
  }, [dispatchAddToBetslip, eventName, legsInBetslip, onDismiss, selectedLegs, urn, position]);

  const handleBetButtonsSwimlaneArrowClick = useCallback(
    (arrow: "previous" | "next") => {
      dispatchTaggingInteractionClick("bet button", arrow, urn, eventName);
    },
    [dispatchTaggingInteractionClick, eventName, urn],
  );

  const handleClosePlayerPicker = useCallback(() => {
    onDismiss();
    dispatchPlayerPickerClose(urn, eventName, incidentType);
  }, [dispatchPlayerPickerClose, eventName, incidentType, onDismiss, urn]);

  const handleToggleSelectUnselectPlayer = useCallback(
    (player: Player, analyticsCallback: () => void) => {
      // if the limit was reached we still want to allow the user to remove players from the squad but not add
      if (hasReachedSquadLimit && !modalParticipants.some((p) => p.status === "loaded" && p.urn === player.urn)) {
        return;
      }

      analyticsCallback();
      dispatchToggleObbSquadBetModalParticipant(urn, player.urn);

      // Every time the squad list changes, the previous selection should be cleared
      setSelectedLegs([]);
    },
    [urn, hasReachedSquadLimit, modalParticipants, dispatchToggleObbSquadBetModalParticipant],
  );

  const handleSelectParticipant = useCallback(
    (player: Player) => {
      handleToggleSelectUnselectPlayer(player, () =>
        dispatchToggleObbSquadBetModalParticipantAnalytics(
          urn,
          eventName,
          incidentType,
          player.urn,
          player.player.name,
        ),
      );
    },
    [
      handleToggleSelectUnselectPlayer,
      dispatchToggleObbSquadBetModalParticipantAnalytics,
      urn,
      eventName,
      incidentType,
    ],
  );

  const handleRemovePlayer = useCallback(
    (playerUrn: string) => {
      const player = players.find((player) => player.urn === playerUrn);

      if (player && isPlayerSelected(player)) {
        handleToggleSelectUnselectPlayer(player, () =>
          dispatchToggleObbSquadBetModalRemoveParticipantAnalytics(eventName, urn, incidentType),
        );
      }
    },
    [
      players,
      isPlayerSelected,
      handleToggleSelectUnselectPlayer,
      dispatchToggleObbSquadBetModalRemoveParticipantAnalytics,
      eventName,
      urn,
      incidentType,
    ],
  );

  const headerContent = useMemo(
    () => (
      <View style={styles.header}>
        <MarketBlurbs marketInfoCallback={() => {}} text={participantInfo} />
        <PlayerPickerNotifications
          urn={urn}
          errorCode={errorCode}
          hasReachedSquadLimit={hasReachedSquadLimit}
          dispatchClearSquadBetModalError={dispatchClearSquadBetModalError}
        />
      </View>
    ),
    [dispatchClearSquadBetModalError, errorCode, hasReachedSquadLimit, participantInfo, urn],
  );

  const memoizedIsPlayerSelected = useCallback((player: Player) => isPlayerSelected(player), [isPlayerSelected]);

  const memoizedIsPlayerDisabled = useCallback(
    (player: Player) =>
      (hasReachedSquadLimit && !isPlayerSelected(player)) || isPlayerDisabled(player.incidentTypes || {}),
    [isPlayerDisabled, isPlayerSelected, hasReachedSquadLimit],
  );

  const memoizedHandlePlayerSelection = useCallback(
    (player: Player) => () => handleSelectParticipant(player),
    [handleSelectParticipant],
  );

  const handleClickBetButton = useCallback(
    ({ id, status, outcome }: SquadBetCardLeg) => {
      handleBetButtonSelection(id);
      dispatchSquadBetBetButtonClickAnalytics(eventName, incidentType, status, outcome);
    },
    [eventName, incidentType, handleBetButtonSelection, dispatchSquadBetBetButtonClickAnalytics],
  );

  const squadBetCard = (
    <ObbSquadBetAnimationWrapper trigger={modalParticipants.length}>
      <PlayerPickerSquadBetCard
        squadParticipants={modalParticipants}
        statsLabel={statsLabel}
        outcomesLabel={outcomesLabel}
        defaultLegs={modalLegs}
        defaultOutcomeIndex={modalDefaultOutcomeIndex}
        alertLabel={i18nLabels.alertLabel}
        addToBetslipLabel={i18nLabels.addToBetslipLabel}
        isLoadingQuotes={modalIsLoadingQuotes}
        isAnimatedBetButton={isAnimatedBetButton}
        onBetButtonsSwimlaneArrowClick={handleBetButtonsSwimlaneArrowClick}
        onAddToBetslip={handleAddToBetslipButtonClick}
        onClickBetButton={handleClickBetButton}
        onRemovePlayerClick={handleRemovePlayer}
      />
    </ObbSquadBetAnimationWrapper>
  );

  return (
    <BottomSheet
      title={title}
      onHeaderIconTap={handleClosePlayerPicker}
      showOverlay={true}
      showContentFullHeight={true}
      withModal={true}
      headerContent={headerContent}
      footerContent={squadBetCard}
    >
      <View style={styles.container}>
        <View style={styles.playerList}>
          {players.map((player, index) => (
            <ObbPlayersRowCard
              key={index}
              participant={player}
              isSelected={memoizedIsPlayerSelected(player)}
              handleSelectParticipant={memoizedHandlePlayerSelection(player)}
              isPlayerDisabled={memoizedIsPlayerDisabled(player)}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export default ObbSquadBetPlayerPicker;
