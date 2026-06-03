import type { JSX } from "react";
import { FunctionComponent, useMemo, useState, useCallback } from "react";
import { View } from "react-native";
import {
  BottomSheet,
  MarketBlurbs,
  Alert,
  SegmentedControl,
  PlayerSelector,
  Card,
  EmptyState,
} from "@ppb/the-wall-native";
import { AlertType } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { RichContentIconName, SystemIconName } from "@ppb/the-wall-icons";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { ComponentProps } from "./props";
import { buildPlayer, buildUnquotedLegsForPvP, errorMap } from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";
import {
  TEST_ID,
  PLAYER_PARTICIPANTS_CONTAINER,
  FIRST_PLAYER_PARTICIPANT_CONTAINER,
  SECOND_PLAYER_PARTICIPANT_CONTAINER,
  OBB_SPORTSBOOK_BET_BUTTON,
} from "./ObbPvpCard.native.selectors";
import styles from "./ObbPvPCard.native.styles";
import { StatsGroup } from "./snowflakes/StatsGroup/StatsGroup.native";
import { ObbPlayersGrid } from "../ObbPlayersGrid/ObbPlayersGrid.native";

import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";

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
  dispatchUpdateLegs,
  dispatchSetSelectedLegs,
  dispatchCleanCardLegs,
  getParticipantQuotes,
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

  const handlePlayerParticipantInteraction = useCallback(
    (playerParticipantIndex: number) => {
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
    },
    [
      dispatchObbEventSelection,
      dispatchUpdateLegs,
      eventName,
      firstLeg,
      firstParticipant,
      participants,
      secondLeg,
      secondParticipant,
      urn,
    ],
  );

  const handlePlayerParticipantClose = useCallback(() => {
    setPlayerSelectorModalState({ showModal: false, modalPlayerIndex: null });
    dispatchCleanCardLegs(urn);
  }, [urn, dispatchCleanCardLegs]);

  const handleSelectParticipant = useCallback(
    (newPlayerSelectedId: string) => {
      const otherSelectedPlayerId =
        modalPlayerIndex === 0 ? secondParticipant?.player?.id : firstParticipant?.player?.id;

      const newSelectedLegsIds =
        otherSelectedPlayerId && updateSelectedLegs(newPlayerSelectedId, otherSelectedPlayerId);

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
    },
    [
      dispatchObbEventSelection,
      dispatchSetSelectedLegs,
      eventName,
      firstParticipant?.player?.id,
      handlePlayerParticipantClose,
      modalPlayerIndex,
      participants,
      secondParticipant?.player?.id,
      updateSelectedLegs,
      urn,
    ],
  );

  const handleTeamChange = useCallback((teamId: string) => {
    setSelectedTeamId(teamId);
  }, []);

  const renderModalContent = (): JSX.Element => {
    if (selectedTeamParticipants.length === 0) {
      return (
        <EmptyState
          hasImage={true}
          title={i18n({ key: "I18N.OBB.UNAVAILABLE.PARTICIPANTS.TITLE" })}
          message={i18n({ key: "I18N.OBB.UNAVAILABLE.PARTICIPANTS.SUBTITLE" })}
          image={
            <View style={styles.unavailableIcon}>
              <GenericIcon name={SystemIconName.NOTIFICATION_INFO} />
            </View>
          }
        />
      );
    }

    return (
      <>
        <View style={styles.neutral}>
          <Card title={title} size={CardHeaderSize.LARGE} theme={CardTheme.TRANSPARENT} fullWidthContent>
            <></>
          </Card>
        </View>

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
    <View>
      {showModal && (
        <BottomSheet
          title={`${i18n({ key: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE" })} ${(modalPlayerIndex as number) + 1}`}
          onHeaderIconTap={handlePlayerParticipantClose}
          showOverlay={true}
          withModal={true}
          showContentFullHeight={true}
          headerContent={
            <View style={styles.bottomSheetHeader}>
              <SegmentedControl
                onPress={handleTeamChange}
                options={[
                  { key: teams.home.id, value: teams.home.name },
                  { key: teams.away.id, value: teams.away.name },
                ]}
                selectedOption={selectedTeamId}
              />
              <MarketBlurbs text={participantInfo} marketInfoCallback={() => {}} />
            </View>
          }
        >
          {renderModalContent()}
        </BottomSheet>
      )}

      <Card withBorder title={title} theme={CardTheme.PRIMARY} size={CardHeaderSize.LARGE}>
        <View style={styles.cardContainer} {...getTestProps(TEST_ID, false)}>
          <View style={styles.playerParticipantsContainer} {...getTestProps(PLAYER_PARTICIPANTS_CONTAINER, false)}>
            <View
              style={styles.playerParticipantContainer}
              {...getTestProps(FIRST_PLAYER_PARTICIPANT_CONTAINER, false)}
            >
              <PlayerSelector
                player={{
                  ...buildPlayer(firstParticipant),
                }}
                onPlayerClick={() => !disabledState && handlePlayerParticipantInteraction(0)}
                icon={playerSelectionIconVariant}
                inverse
              />
            </View>
            <View style={styles.versusContainer}>
              <GenericIcon name={RichContentIconName.VS} />
            </View>
            <View
              style={styles.playerParticipantContainer}
              {...getTestProps(SECOND_PLAYER_PARTICIPANT_CONTAINER, false)}
            >
              <PlayerSelector
                player={{
                  ...buildPlayer(secondParticipant),
                }}
                icon={playerSelectionIconVariant}
                onPlayerClick={() => !disabledState && handlePlayerParticipantInteraction(1)}
              />
            </View>
          </View>

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

          <View style={styles.betButtonContainer}>
            {betButtons.map((leg) => (
              <View key={leg} style={styles.betButton} {...getTestProps(OBB_SPORTSBOOK_BET_BUTTON, false)}>
                <ConnectedObbBetButton
                  cardUrn={urn}
                  eventName={eventName}
                  position={position}
                  legId={leg}
                  component={ObbBetButton}
                />
              </View>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default ObbPvPCard;
