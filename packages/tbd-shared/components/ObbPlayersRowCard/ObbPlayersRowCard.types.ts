import { Player } from "../../hooks/useSortedObbPlayersList";

export type ObbPlayersRowCardProps = {
  participant: Player;
  isSelected?: boolean;
  maxStatValue?: number;
  isPlayerDisabled?: boolean;
  handleSelectParticipant: (playerId: string) => void;
};
