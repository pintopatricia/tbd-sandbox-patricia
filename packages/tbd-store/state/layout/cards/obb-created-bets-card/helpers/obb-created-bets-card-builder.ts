import { NormalizedObbCreatedBetsCard } from "../../../../../services/catalogue/normalizer/cards/obb-created-bets-card/ObbCreatedBetsCard.types";
import { ObbCreatedBetsCard } from "../ObbCreatedBetsCard.types";

export function buildObbCreatedBetsCard(obbCard: NormalizedObbCreatedBetsCard): ObbCreatedBetsCard {
  const { typename, urn, fixture, sportEvent, eventViewLink, footerViewLink, bettingOpportunities } = obbCard;

  return {
    urn,
    typename,
    fixture,
    sportEvent,
    eventViewLink,
    footerViewLink,
    bettingOpportunities: bettingOpportunities.map((opportunity) => ({
      participants: opportunity.participants.map((participant) => participant.urn),
      legId: opportunity.leg.id,
    })),
  };
}
