import { ObbParticipant, ObbSportEvent } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { FilterTag } from "../../../../../state/layout/cardgroups/CardGroup.types";
import URN from "../../../../../state/layout/URN";
import { NormalizedObbLeg } from "../../entities/obb-leg/ObbLeg.types";

type NormalizedSquadParticipant = {
  typename: string;
  urn: string;
};
export type NormalizedObbSquadVsSquadCard = {
  urn: URN;
  typename: "ObbSquadVsSquadCard";
  title: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  participantInfo?: string;
  filterTags: FilterTag[];
  incidentType: string;
  sportevent: ObbSportEvent;
  firstSquadParticipants: NormalizedSquadParticipant[];
  secondSquadParticipants: NormalizedSquadParticipant[];
  eventParticipants: ObbParticipant[];
  defaultLegs?: NormalizedObbLeg[];
};
