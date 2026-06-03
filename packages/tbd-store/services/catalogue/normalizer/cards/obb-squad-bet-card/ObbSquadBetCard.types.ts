import { ObbParticipant, ObbSportEvent } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { FilterTag } from "../../../../../state/layout/cardgroups/CardGroup.types";
import URN from "../../../../../state/layout/URN";
import { NormalizedObbLeg } from "../../entities/obb-leg/ObbLeg.types";

type NormalizedSquadParticipant = {
  typename: string;
  urn: string;
};
export type NormalizedObbSquadBetCard = {
  urn: URN;
  typename: "ObbSquadBetCard";
  title: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  entryPointLabel?: string;
  participantInfo?: string;
  filterTags: FilterTag[];
  incidentType: string;
  sportevent: ObbSportEvent;
  squadParticipants: NormalizedSquadParticipant[];
  eventParticipants: ObbParticipant[];
  legs?: string[];
  defaultLegs?: NormalizedObbLeg[];
  defaultOutcomeIndex: number;
};
