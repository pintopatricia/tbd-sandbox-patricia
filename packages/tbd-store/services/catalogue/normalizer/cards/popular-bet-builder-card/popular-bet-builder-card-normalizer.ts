/* eslint-disable no-underscore-dangle */
import { PopularBetBuilderCard } from "../../../../../state/layout/cards/Card.types";
import { PopularBetBuilderCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePopularBetBuilderCardFragmentIntoPopularBetBuilderCard = (
  fragment: PopularBetBuilderCardFragment,
): TransformedFragment<PopularBetBuilderCard> => {
  const { __typename, urn, fixture, sportevent, popularbettingopportunity, viewLink, tabViewLink } = fragment;

  return {
    data: {
      typename: __typename,
      urn,
      fixture: "urn" in fixture ? fixture.urn : "",
      sportevent: sportevent.urn,
      popularbettingopportunity: popularbettingopportunity.urn,
      viewLink,
      tabViewLink: tabViewLink ?? undefined,
    },
  };
};

export default normalizePopularBetBuilderCardFragmentIntoPopularBetBuilderCard;
