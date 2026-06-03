import { NormalizedObbSquadBetCard } from "../../../../../services/catalogue/normalizer/cards/obb-squad-bet-card/ObbSquadBetCard.types";
import { ObbSquadBetCard } from "../ObbCard.types";

export function buildObbSquadBetCard(obbCard: NormalizedObbSquadBetCard): ObbSquadBetCard {
  const {
    eventParticipants,
    squadParticipants,
    title,
    outcomesLabel,
    statsLabel,
    showModalEntryPoint,
    entryPointLabel,
    participantInfo,
    filterTags,
    sportevent,
    typename,
    urn,
    incidentType,
    defaultOutcomeIndex,
  } = obbCard;
  return {
    urn,
    typename,
    title: title ?? undefined,
    outcomesLabel,
    statsLabel,
    showModalEntryPoint,
    entryPointLabel,
    participantInfo,
    filterTags,
    sportevent,
    squadParticipants: squadParticipants.map((participant) => participant.urn),
    eventParticipants: eventParticipants.map((participant) => participant.urn),
    legs: obbCard.legs,
    defaultLegs: obbCard.defaultLegs?.map((leg) => leg.id),
    incidentType,
    defaultOutcomeIndex,
    modalParticipants: [],
    modalDefaultOutcomeIndex: 0,
    modalLegs: [],
    modalError: null,
    modalIsLoadingQuotes: false,
  };
}
