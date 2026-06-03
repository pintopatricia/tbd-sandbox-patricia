import { ObbParticipantsWithStats } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { ParticipantQuotesMap } from "../../helpers/obb";

export type ObbPlayersGridProps = {
  participants: ObbParticipantsWithStats;
  selectedParticipantId?: string | null;
  participantQuotesMap: ParticipantQuotesMap;
  handleSelectParticipant: (playerId: string) => void;
  dispatchObbEventSelection: (event: { module: string; elementText: string }, urn: string, eventName?: string) => void;
  maxStatValue?: number;
};
