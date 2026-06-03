import { ObbParticipant } from "../obb-legs/ObbLegs.types";

export type ObbParticipants = {
  [participantUrn: string]: ObbParticipant;
};
