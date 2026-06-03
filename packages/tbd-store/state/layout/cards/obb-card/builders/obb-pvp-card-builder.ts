import { NormalizedObbPvpCard } from "../../../../../services/catalogue/normalizer/cards/obb-pvp-card/ObbPvpCard.types";
import { ObbPvpCard } from "../ObbCard.types";

export function buildObbPvpCard(obbCard: NormalizedObbPvpCard): ObbPvpCard {
  const { incidentType, participants, title, sportevent, typename, urn, participantInfo, teams, filterTags } = obbCard;

  return {
    urn,
    typename,
    title,
    sportevent,
    participantInfo,
    filterTags,
    teams,
    incidentType,
    participants: participants.map((participant) => participant.urn),
    selectedLegs: obbCard.defaultLegs.map((leg) => leg.id),
    legs: [],
  };
}
