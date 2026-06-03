import { ObbParticipant, ObbSportEvent } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { FilterTag } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { DisplayNameTitle, ObbFootballTeams } from "../../../../../state/layout/cards/obb-card/ObbCard.types";
import URN from "../../../../../state/layout/URN";
import { NormalizedObbLeg } from "../../entities/obb-leg/ObbLeg.types";

export type NormalizedObbPvpCard = {
  urn: URN;
  typename: "ObbPvpCard";
  title: string;
  sportevent: ObbSportEvent;
  participants: ObbParticipant[];
  incidentType: string;
  participantInfo?: DisplayNameTitle;
  filterTags: FilterTag[];
  defaultLegs: NormalizedObbLeg[];
  teams: ObbFootballTeams;
};
