import { ObbParticipant, ObbSportEvent } from "../../../entities/obb-legs/ObbLegs.types";
import { FilterTag } from "../../cardgroups/CardGroup.types";
import URN from "../../URN";

export type ObbCard = ObbPvpCard | ObbSquadBetCard | ObbSquadVsSquadCard;

export type ObbCards = {
  [urn: string]: ObbCard;
};

export type ObbPvpCard = {
  urn: URN;
  typename: "ObbPvpCard";
  title: string;
  teams: {
    home: { id: string; name: string; color: string | null };
    away: { id: string; name: string; color: string | null };
  };
  sportevent: ObbSportEvent;
  participants: string[];
  incidentType: string;
  participantInfo?: DisplayNameTitle;
  filterTags: FilterTag[];
  legs: string[];
  selectedLegs: string[];
};

export type ObbSquadBetCard = {
  urn: URN;
  typename: "ObbSquadBetCard";
  icon?: { id: URN; category: string };
  title: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  entryPointLabel?: string;
  participantInfo?: string;
  filterTags: FilterTag[];
  sportevent: ObbSportEvent;
  eventParticipants: string[];
  squadParticipants: string[];
  legs?: string[];
  defaultLegs?: string[];
  incidentType: string;
  defaultOutcomeIndex: number;
  modalParticipants: string[];
  modalDefaultOutcomeIndex: number;
  modalLegs: string[];
  modalError: string | null;
  modalIsLoadingQuotes: boolean;
};

export type ObbSquadVsSquadCard = {
  urn: URN;
  typename: "ObbSquadVsSquadCard";
  icon?: { id: URN; category: string };
  title: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  participantInfo?: string;
  filterTags: FilterTag[];
  sportevent: ObbSportEvent;
  eventParticipants: string[];
  firstSquadParticipants: string[];
  secondSquadParticipants: string[];
  legs?: string[];
  defaultLegs?: string[];
  incidentType: string;
  firstSquadModalParticipants: string[];
  secondSquadModalParticipants: string[];
  modalLegs: string[];
  modalError: string | null;
  modalIsLoadingQuotes: boolean;
};

export type ObbEvent = {
  urn: URN;
};

export type ObbOutcomeDescription = {
  header: string;
  subtitle: string;
  summary: string;
};

export type DisplayNameTitle = {
  name: string;
};

export type SelectorObbPvpCard = {
  urn: URN;
  typename: "ObbPvpCard";
  title: string;
  sportevent: ObbSportEvent;
  participantInfo?: DisplayNameTitle;
  filterTags: FilterTag[];
  incidentType: string;
  participants: ObbParticipant[];
  selectedLegs: string[];
  legs: string[];
  teams: ObbFootballTeams;
};

export type SelectorObbSquadBetCard = {
  urn: URN;
  typename: "ObbSquadBetCard";
  title?: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  entryPointLabel?: string;
  participantInfo?: string;
  filterTags: FilterTag[];
  sportevent: ObbSportEvent;
  eventParticipants: ObbParticipant[];
  squadParticipants: ObbParticipant[];
  legs?: string[];
  defaultLegs?: string[];
  incidentType: string;
  defaultOutcomeIndex: number;
};

export type SelectorObbSquadVsSquadCard = {
  urn: URN;
  typename: "ObbSquadVsSquadCard";
  title: string;
  outcomesLabel?: string;
  statsLabel?: string;
  showModalEntryPoint: boolean;
  entryPointLabel?: string;
  participantInfo?: string;
  filterTags: FilterTag[];
  sportevent: ObbSportEvent;
  eventParticipants: ObbParticipant[];
  firstSquadParticipants: ObbParticipant[];
  secondSquadParticipants: ObbParticipant[];
  legs?: string[];
  defaultLegs?: string[];
  incidentType: string;
};

export type SelectorObbCard = SelectorObbPvpCard | SelectorObbSquadBetCard | SelectorObbSquadVsSquadCard;

export type SelectorSquadBetCardWithModalFields = SelectorObbSquadBetCard & {
  modalParticipants: ObbParticipant[];
  modalDefaultOutcomeIndex: number;
  modalLegs: string[];
  modalError: string | null;
  modalIsLoadingQuotes: boolean;
};

export type SelectorSquadVsSquadCardWithModalFields = SelectorObbSquadVsSquadCard & {
  firstSquadModalParticipants: ObbParticipant[];
  secondSquadModalParticipants: ObbParticipant[];
  modalLegs: string[];
  modalError: string | null;
  modalIsLoadingQuotes: boolean;
};

export type ObbFootballTeam = {
  id: string;
  name: string;
  color: string | null;
};

export type ObbFootballTeams = {
  home: ObbFootballTeam;
  away: ObbFootballTeam;
};

export type ObbSelectedParticipantStats = {
  id: string;
  label: string;
  value: number | null;
}[];

export type ObbPositionType = {
  horizontalPosition: number;
  verticalPosition: number;
};
