import { EditorialPromoCardFragment } from "@ppb/tbd-components-promotions/components/EditorialPromoCard/model/EditorialPromoCard.graphql";
import { BetOpportunityPromoCardFragment } from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/model/BetOpportunityPromoCard.graphql";
import { SelectionPromoCardFragment } from "@ppb/tbd-components-promotions/components/SelectionPromoCard/model/SelectionPromoCard.graphql";
import { LoyaltyPromoCardFragment } from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/model/LoyaltyPromoCard.graphql";
import { getApolloClient } from "../../../../apollo-client/client";

export function readPromotionCardFragments(urn: string) {
  const { cache } = getApolloClient();

  const editorialPromoCard = cache.readFragment({
    fragment: EditorialPromoCardFragment,
    id: cache.identify({
      __typename: "EditorialPromoCard",
      urn,
    }),
    fragmentName: "EditorialPromoCard",
  });

  if (editorialPromoCard && "urn" in editorialPromoCard) {
    return editorialPromoCard;
  }

  const betOpportunityPromoCard = cache.readFragment({
    fragment: BetOpportunityPromoCardFragment,
    id: cache.identify({
      __typename: "BetOpportunityPromoCard",
      urn,
    }),
    fragmentName: "BetOpportunityPromoCard",
  });

  if (betOpportunityPromoCard && "urn" in betOpportunityPromoCard) {
    return betOpportunityPromoCard;
  }

  const selectionPromoCard = cache.readFragment({
    fragment: SelectionPromoCardFragment,
    id: cache.identify({
      __typename: "SelectionPromoCard",
      urn,
    }),
    fragmentName: "SelectionPromoCard",
  });

  if (selectionPromoCard && "urn" in selectionPromoCard) {
    return selectionPromoCard;
  }

  const loyaltyPromoCard = cache.readFragment({
    fragment: LoyaltyPromoCardFragment,
    id: cache.identify({
      __typename: "LoyaltyPromoCard",
      urn,
    }),
    fragmentName: "LoyaltyPromoCard",
  });

  if (loyaltyPromoCard && loyaltyPromoCard.loyaltyPromotion && "urn" in loyaltyPromoCard) {
    // loyalty promo card has a different structure than the other promos
    return {
      ...loyaltyPromoCard.loyaltyPromotion,
      title: loyaltyPromoCard.loyaltyPromotion.name,
    };
  }

  return null;
}

export function getPromotionCardTrackingParams(urn: string) {
  const card = readPromotionCardFragments(urn);

  if (!card) {
    return null;
  }

  const title = "title" in card ? card.title : null;

  return {
    title,
  };
}
