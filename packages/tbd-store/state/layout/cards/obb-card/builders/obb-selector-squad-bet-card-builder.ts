import { ObbParticipants } from "../../../../entities/obb-participants/ObbParticipants.types";
import { ObbSquadBetCard, SelectorObbSquadBetCard, SelectorSquadBetCardWithModalFields } from "../ObbCard.types";

export function buildObbSquadBetCardSelector(
  obbCard: ObbSquadBetCard,
  participants: ObbParticipants,
): SelectorObbSquadBetCard {
  return {
    urn: obbCard.urn,
    typename: obbCard.typename,
    title: obbCard.title,
    outcomesLabel: obbCard.outcomesLabel,
    statsLabel: obbCard.statsLabel,
    showModalEntryPoint: obbCard.showModalEntryPoint,
    entryPointLabel: obbCard.entryPointLabel,
    participantInfo: obbCard.participantInfo,
    filterTags: obbCard.filterTags,
    sportevent: obbCard.sportevent,
    eventParticipants: obbCard.eventParticipants.map((participant) => participants[participant]),
    squadParticipants: obbCard.squadParticipants.map((participant) => participants[participant]),
    incidentType: obbCard.incidentType,
    defaultLegs: obbCard.defaultLegs,
    legs: obbCard.legs,
    defaultOutcomeIndex: obbCard.defaultOutcomeIndex,
  };
}

export function buildObbSquadBetCardWithModalFieldsSelector(
  obbCard: ObbSquadBetCard,
  participants: ObbParticipants,
): SelectorSquadBetCardWithModalFields {
  return {
    ...buildObbSquadBetCardSelector(obbCard, participants),
    modalParticipants: obbCard.modalParticipants?.map((participant) => participants[participant]) || [],
    modalDefaultOutcomeIndex: obbCard.modalDefaultOutcomeIndex || 0,
    modalLegs: obbCard.modalLegs || [],
    modalError: obbCard.modalError || null,
    modalIsLoadingQuotes: obbCard.modalIsLoadingQuotes || false,
  };
}
