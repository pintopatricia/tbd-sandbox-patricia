import type { JSX } from "react";
import { FunctionComponent, useMemo, useState } from "react";
import { PlayerSelector, Alert, Card, EmptyState } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import { RichContentIconName, SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { buildPlayer, buildUnquotedLegsForPvP, errorMap } from "../../helpers/obb";
import styles from "./ObbPvPCard.web.css";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";
import ObbPlayersModal from "../ObbPlayersModal/ObbPlayersModal.web";
import { StatsGroup } from "./snowflakes/StatsGroup/StatsGroup.web";
import { ObbPlayersGrid } from "../ObbPlayersGrid/ObbPlayersGrid.web";

import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";

type PlayerSelectorModalState = {
  showModal: boolean;
  modalPlayerIndex: number | null;
};

const ObbPvPCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  firstLeg,
  secondLeg,
  participants = [],
  firstParticipant,
  secondParticipant,
  quoteError,
  participantInfo,
  eventName,
  betButtons = [],
  disabledState,
  teams,
  statsGroupProps,
  position,
  playerSelectionIconVariant,
  removeObbStatsLabel,
  getParticipantQuotes,
  dispatchUpdateLegs,
  dispatchSetSelectedLegs,
  dispatchCleanCardLegs,
  updateSelectedLegs,
  dispatchObbEventSelection,
}) => {
  const [{ showModal, modalPlayerIndex }, setPlayerSelectorModalState] = useState<PlayerSelectorModalState>({
    showModal: false,
    modalPlayerIndex: null,
  });

  const [selectedTeamId, setSelectedTeamId] = useState(teams.home.id);
  const selectedTeamParticipants = useMemo(
    () => participants.filter((p) => p.team?.id === selectedTeamId),
    [participants, selectedTeamId],
  );

  const handlePlayerParticipantInteraction = (playerParticipantIndex: number) => {
    const changingFirstPlayer = playerParticipantIndex === 0;

    if (firstLeg && secondLeg) {
      const selectedLeg = changingFirstPlayer ? firstLeg : secondLeg;
      const selectedParticipants = firstParticipant && secondParticipant ? [firstParticipant, secondParticipant] : [];

      const unquotedLegsForPlayers = buildUnquotedLegsForPvP(
        selectedParticipants,
        selectedLeg,
        participants,
        playerParticipantIndex,
      );

      dispatchUpdateLegs(urn, unquotedLegsForPlayers);
      dispatchObbEventSelection(
        {
          module: "change player",
          elementText: "player selection",
        },
        urn,
        eventName,
      );
    }

    if (firstParticipant?.team?.id && secondParticipant?.team?.id) {
      setSelectedTeamId(changingFirstPlayer ? firstParticipant?.team.id : secondParticipant?.team.id);
    }

    setPlayerSelectorModalState({ showModal: true, modalPlayerIndex: playerParticipantIndex });
  };

  const handlePlayerParticipantClose = () => {
    setPlayerSelectorModalState({ showModal: false, modalPlayerIndex: null });
    dispatchCleanCardLegs(urn);
  };

  const handleSelectParticipant = (newPlayerSelectedId: string) => {
    const otherSelectedPlayerId = modalPlayerIndex === 0 ? secondParticipant?.player?.id : firstParticipant?.player?.id;

    const newSelectedLegsIds = otherSelectedPlayerId && updateSelectedLegs(newPlayerSelectedId, otherSelectedPlayerId);

    if (newSelectedLegsIds) {
      dispatchSetSelectedLegs(urn, newSelectedLegsIds);
    }

    const player = participants.find((p) => p.player?.id === newPlayerSelectedId);

    if (player?.team?.id) {
      setSelectedTeamId(player?.team?.id);
    }

    dispatchObbEventSelection(
      {
        module: "change player",
        elementText: `player - ${player?.player?.name}`,
      },
      urn,
      eventName,
    );

    handlePlayerParticipantClose();
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const renderModalContent = (): JSX.Element => {
    if (selectedTeamParticipants.length === 0) {
      return (
        <EmptyState
          hasImage={true}
          title={i18n({ key: "I18N.OBB.UNAVAILABLE.PARTICIPANTS.TITLE" })}
          message={i18n({ key: "I18N.OBB.UNAVAILABLE.PARTICIPANTS.SUBTITLE" })}
          image={
            <div className={styles.unavailableIcon}>
              <GenericIcon name={SystemIconName.NOTIFICATION_INFO} />
            </div>
          }
        />
      );
    }

    return (
      <>
        <div className={styles.neutral}>
          <Card fullWidthContent title={title} size={CardHeaderSize.LARGE} theme={CardTheme.TRANSPARENT}>
            <></>
          </Card>
        </div>
        <ObbPlayersGrid
          participants={selectedTeamParticipants}
          selectedParticipantId={modalPlayerIndex === 0 ? firstParticipant?.player?.id : secondParticipant?.player?.id}
          participantQuotesMap={getParticipantQuotes(
            modalPlayerIndex as number,
            firstParticipant?.player?.id as string,
            secondParticipant?.player?.id as string,
          )}
          handleSelectParticipant={handleSelectParticipant}
          dispatchObbEventSelection={dispatchObbEventSelection}
          maxStatValue={statsGroupProps.maxValue}
        />
      </>
    );
  };

  return (
    <>
      {showModal && (
        <ObbPlayersModal
          onDismiss={handlePlayerParticipantClose}
          participantInfo={participantInfo}
          title={`${i18n({ key: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE" })} ${(modalPlayerIndex as number) + 1}`}
          teams={teams}
          selectedTeamId={selectedTeamId}
          handleTeamChange={handleTeamChange}
        >
          {renderModalContent()}
        </ObbPlayersModal>
      )}

      <Card withBorder title={title} theme={CardTheme.PRIMARY} size={CardHeaderSize.LARGE}>
        <div className={styles.cardContainer}>
          <div className={styles.playerParticipantsContainer}>
            <div className={styles.playerParticipantContainer}>
              <PlayerSelector
                player={buildPlayer(firstParticipant)}
                onPlayerClick={() => !disabledState && handlePlayerParticipantInteraction(0)}
                icon={playerSelectionIconVariant}
                inverse
              />
            </div>
            <div className={styles.versusContainer}>
              <GenericIcon name={RichContentIconName.VS} />
            </div>
            <div className={styles.playerParticipantContainer}>
              <PlayerSelector
                player={buildPlayer(secondParticipant)}
                icon={playerSelectionIconVariant}
                onPlayerClick={() => !disabledState && handlePlayerParticipantInteraction(1)}
              />
            </div>
          </div>

          {!removeObbStatsLabel && <StatsGroup {...statsGroupProps} />}

          {quoteError && (
            <Alert
              type={errorMap[quoteError].level || AlertType.Warning}
              message={i18n({
                key: "I18N.OBB.ERROR.TITLE",
                interpolationValues: { errorCode: quoteError },
              })}
              detail={
                errorMap[quoteError].hasDescription
                  ? i18n({
                      key: "I18N.OBB.ERROR.DETAIL",
                      interpolationValues: { errorCode: quoteError },
                    })
                  : ""
              }
            />
          )}

          <div className={styles.betButtonsContainer}>
            {betButtons.map((leg) => (
              <ConnectedObbBetButton
                key={leg}
                cardUrn={urn}
                eventName={eventName}
                position={position}
                legId={leg}
                component={ObbBetButton}
              />
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default ObbPvPCard;
