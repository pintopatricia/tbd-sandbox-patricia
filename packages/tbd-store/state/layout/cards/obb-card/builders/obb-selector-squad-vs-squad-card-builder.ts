import { ObbParticipants } from "../../../../entities/obb-participants/ObbParticipants.types";
import {
  ObbSquadVsSquadCard,
  SelectorObbSquadVsSquadCard,
  SelectorSquadVsSquadCardWithModalFields,
} from "../ObbCard.types";

export function buildObbSquadVsSquadCardSelector(
  obbCard: ObbSquadVsSquadCard,
  participants: ObbParticipants,
): SelectorObbSquadVsSquadCard {
  return {
    urn: obbCard.urn,
    typename: obbCard.typename,
    title: obbCard.title,
    outcomesLabel: obbCard.outcomesLabel,
    statsLabel: obbCard.statsLabel,
    showModalEntryPoint: obbCard.showModalEntryPoint,
    participantInfo: obbCard.participantInfo,
    filterTags: obbCard.filterTags,
    sportevent: obbCard.sportevent,
    eventParticipants: obbCard.eventParticipants.map((participant) => participants[participant]),
    firstSquadParticipants: obbCard.firstSquadParticipants.map((participant) => participants[participant]),
    secondSquadParticipants: obbCard.secondSquadParticipants.map((participant) => participants[participant]),
    incidentType: obbCard.incidentType,
    defaultLegs: obbCard.defaultLegs,
  };
}

export function buildObbSquadVsSquadCardWithModalFieldsSelector(
  obbCard: ObbSquadVsSquadCard,
  participants: ObbParticipants,
): SelectorSquadVsSquadCardWithModalFields {
  return {
    ...buildObbSquadVsSquadCardSelector(obbCard, participants),
    firstSquadModalParticipants: obbCard.firstSquadModalParticipants.map((participant) => participants[participant]),
    secondSquadModalParticipants: obbCard.secondSquadModalParticipants.map((participant) => participants[participant]),
    modalLegs: obbCard.modalLegs,
    modalError: obbCard.modalError,
    modalIsLoadingQuotes: obbCard.modalIsLoadingQuotes,
  };
}
