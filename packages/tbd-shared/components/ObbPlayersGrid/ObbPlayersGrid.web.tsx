import { FunctionComponent } from "react";
import styles from "./ObbPlayersGrid.web.css";
import { ObbPlayersListCard } from "../ObbPlayersListCard/ObbPlayersListCard.web";
import { useSortedObbPlayersList } from "../../hooks/useSortedObbPlayersList";
import { ObbPlayersGridProps } from "./ObbPlayersGrid.types";

export const ObbPlayersGrid: FunctionComponent<ObbPlayersGridProps> = ({
  participants,
  selectedParticipantId,
  handleSelectParticipant,
  participantQuotesMap,
  maxStatValue,
}) => {
  const { players, isLoading } = useSortedObbPlayersList(participants, participantQuotesMap);

  const isSelected = (playerId: string) => selectedParticipantId === playerId;

  return (
    <div className={styles.container}>
      {players.map((player) => (
        <div className={styles.player} key={player.player.id}>
          <ObbPlayersListCard
            participant={player}
            isSelected={isSelected(player.player.id)}
            handleSelectParticipant={handleSelectParticipant}
            isLoading={isLoading}
            maxStatValue={maxStatValue}
          />
        </div>
      ))}
    </div>
  );
};
