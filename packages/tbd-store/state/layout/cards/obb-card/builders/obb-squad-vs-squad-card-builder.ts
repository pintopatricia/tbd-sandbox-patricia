import { NormalizedObbSquadVsSquadCard } from "../../../../../services/catalogue/normalizer/cards/obb-squad-vs-squad-card/ObbSquadVsSquadCard.types";
import { ObbSquadVsSquadCard } from "../ObbCard.types";

export function buildObbSquadVsSquadCard(obbCard: NormalizedObbSquadVsSquadCard): ObbSquadVsSquadCard {
  const {
    eventParticipants,
    firstSquadParticipants,
    secondSquadParticipants,
    title,
    outcomesLabel,
    statsLabel,
    showModalEntryPoint,
    participantInfo,
    filterTags,
    sportevent,
    typename,
    urn,
    incidentType,
  } = obbCard;

  return {
    urn,
    typename,
    title: title ?? undefined,
    outcomesLabel,
    statsLabel,
    showModalEntryPoint,
    participantInfo,
    filterTags,
    sportevent,
    firstSquadParticipants: firstSquadParticipants.map((participant) => participant.urn),
    secondSquadParticipants: secondSquadParticipants.map((participant) => participant.urn),
    eventParticipants: eventParticipants.map((participant) => participant.urn),
    defaultLegs: obbCard.defaultLegs?.map((leg) => leg.id),
    incidentType,
    firstSquadModalParticipants: [],
    secondSquadModalParticipants: [],
    modalLegs: [],
    modalError: null,
    modalIsLoadingQuotes: false,
  };
}
