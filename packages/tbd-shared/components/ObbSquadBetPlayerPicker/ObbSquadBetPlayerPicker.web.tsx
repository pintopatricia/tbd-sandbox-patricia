import { FunctionComponent, useCallback, useContext, useMemo, useState, memo, useRef, useLayoutEffect } from "react";

import * as React from "react";
import { Alert, BottomSheet, MarketBlurbs, Modal } from "@ppb/the-wall-web";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { ComponentProps, SquadBetCardLeg } from "./props";
import { ConfigContext } from "../Config/ConfigContext";
import styles from "./ObbSquadBetPlayerPicker.web.css";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.web";
import { PlayerPickerSquadBetCard } from "./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.web";
import { ObbSquadBetAnimationWrapper } from "./snowflakes/ObbSquadBetAnimationWrapper/ObbSquadBetAnimationWrapper.web";
import { useSortedObbPlayersList, Player } from "../../hooks/useSortedObbPlayersList";
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

  return (
    <div className={styles.alertContainer}>
      <Alert {...alertProps} onClose={() => dispatchClearSquadBetModalError(urn)} />
    </div>
  );
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
  modalIsLoadingQuotes,
  incidentType,
  errorCode,
  legsInBetslip,
  position,
  hasReachedSquadLimit,
  isPlayerSelected,
  isPlayerDisabled,
  isAnimatedBetButton,
  dispatchClearSquadBetModalError,
  onDismiss,
  dispatchToggleObbSquadBetModalParticipant,
  dispatchToggleObbSquadBetModalParticipantAnalytics,
  dispatchTaggingInteractionClick,
  dispatchAddToBetslip,
  dispatchPlayerPickerClose,
  dispatchSquadBetBetButtonClickAnalytics,
  dispatchToggleObbSquadBetModalRemoveParticipantAnalytics,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const [selectedLegs, setSelectedLegs] = useState<Array<string>>([]);
  const lastSelectedRef = useRef<HTMLDivElement | null>(null);
  const [lastSelectedPlayerUrn, setLastSelectedPlayerUrn] = useState<string | null>(null);

  const { players } = useSortedObbPlayersList(eventParticipants);

  const marketBlurbs = <MarketBlurbs marketInfoCallback={() => {}} text={participantInfo} />;

  useLayoutEffect(() => {
    if (lastSelectedRef.current) {
      lastSelectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [lastSelectedPlayerUrn, modalParticipants]);

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

  const handleClosePlayerPicker = useCallback(() => {
    onDismiss();
    dispatchPlayerPickerClose(urn, eventName, incidentType);
  }, [dispatchPlayerPickerClose, eventName, incidentType, onDismiss, urn]);

  const handleAddToBetslipButtonClick = useCallback(() => {
    dispatchAddToBetslip(
      selectedLegs.filter((leg) => !legsInBetslip[leg]),
      urn,
      eventName,
      position,
    );
    onDismiss();
  }, [dispatchAddToBetslip, onDismiss, eventName, selectedLegs, urn, legsInBetslip, position]);

  const handleBetButtonsSwimlaneArrowClick = useCallback(
    (arrow: "previous" | "next") => {
      dispatchTaggingInteractionClick("bet button", arrow, urn, eventName);
    },
    [dispatchTaggingInteractionClick, eventName, urn],
  );

  const handlePlayersArrowClick = useCallback(
    (direction: "previous" | "next") => {
      dispatchTaggingInteractionClick("player", direction, urn, eventName);
    },
    [dispatchTaggingInteractionClick, eventName, urn],
  );

  const handleToggleSelectUnselectPlayer = useCallback(
    (player: Player, analyticsCallback: () => void) => {
      // if the limit was reached we still want to allow the user to remove players from the squad but not add
      if (hasReachedSquadLimit && !modalParticipants.some((p) => p.status === "loaded" && p.urn === player.urn)) {
        return;
      }

      analyticsCallback();
      dispatchToggleObbSquadBetModalParticipant(urn, player.urn);

      setLastSelectedPlayerUrn(player.urn);

      // Every time the squad list changes, the previous selection should be cleared
      setSelectedLegs([]);
    },
    [hasReachedSquadLimit, modalParticipants, dispatchToggleObbSquadBetModalParticipant, urn],
  );

  const handleSelectParticipant = useCallback(
    (player: Player) => {
      handleToggleSelectUnselectPlayer(player, () => {
        dispatchToggleObbSquadBetModalParticipantAnalytics(
          urn,
          eventName,
          incidentType,
          player.urn,
          player.player.name,
        );
      });
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
        handleToggleSelectUnselectPlayer(player, () => {
          dispatchToggleObbSquadBetModalRemoveParticipantAnalytics(eventName, urn, incidentType);
        });
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

  const playerList = (
    <div className={styles.playerList}>
      {players.map((player, index) => (
        <ObbPlayersRowCard
          key={index}
          ref={player.urn === lastSelectedPlayerUrn ? lastSelectedRef : null}
          participant={player}
          isSelected={isPlayerSelected(player)}
          handleSelectParticipant={() => handleSelectParticipant(player)}
          isPlayerDisabled={
            (hasReachedSquadLimit && !isPlayerSelected(player)) || isPlayerDisabled(player.incidentTypes || {})
          }
        />
      ))}
    </div>
  );

  const squadBetCard = (
    <div className={styles.squadbetCardContainer}>
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
          onPlayersArrowClick={handlePlayersArrowClick}
          onAddToBetslip={handleAddToBetslipButtonClick}
          onClickBetButton={({ id, status, outcome }) => {
            handleBetButtonSelection(id);
            dispatchSquadBetBetButtonClickAnalytics(eventName, incidentType, status, outcome);
          }}
          onRemovePlayerClick={handleRemovePlayer}
        />
      </ObbSquadBetAnimationWrapper>
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
      {marketBlurbs}
    </>
  );

  const playerPickerContent = <div className={styles.container}>{playerList}</div>;

  return isDesktopLayout ? (
    <Modal
      onDismiss={handleClosePlayerPicker}
      dismissOnOutsideTap={true}
      title={title}
      headerContent={headerContent}
      footerContent={squadBetCard}
    >
      {playerPickerContent}
    </Modal>
  ) : (
    <BottomSheet
      onHeaderIconTap={handleClosePlayerPicker}
      showContentFullHeight={true}
      title={title}
      headerContent={headerContent}
      footerContent={squadBetCard}
    >
      {playerPickerContent}
    </BottomSheet>
  );
};

export default ObbSquadBetPlayerPicker;
