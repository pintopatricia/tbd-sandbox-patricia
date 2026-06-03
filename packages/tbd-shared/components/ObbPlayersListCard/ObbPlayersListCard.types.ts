import { Player } from "../../hooks/useSortedObbPlayersList";

export type ObbPlayersListCardProps = {
  participant: Player;
  isSelected?: boolean;
  isLoading?: boolean;
  maxStatValue?: number;
  handleSelectParticipant: (playerId: string) => void;
};
