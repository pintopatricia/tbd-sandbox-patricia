import { SquadBetCardLeg } from "../../props";
import { PlayerWithJersey } from "../../../../helpers/obb";

export type PlayerPickerSquadBetCardProps = {
  squadParticipants: PlayerWithJersey[];
  statsLabel: string;
  outcomesLabel?: string;
  defaultOutcomeIndex?: number;
  alertLabel: string;
  addToBetslipLabel: string;
  isLoadingQuotes: boolean;
  defaultLegs: SquadBetCardLeg[];
  isAnimatedBetButton: boolean;
  onBetButtonsSwimlaneArrowClick: (arrow: "previous" | "next") => void;
  onPlayersArrowClick?: (arrow: "previous" | "next") => void;
  onAddToBetslip: () => void;
  onClickBetButton: (leg: SquadBetCardLeg) => void;
  onRemovePlayerClick: (playerUrn: string) => void;
};
