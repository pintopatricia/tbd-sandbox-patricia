/* eslint-disable no-underscore-dangle */
import { CorrectScoreCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { CorrectScoreCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCorrectScoreCardFragmentIntoCorrectScoreCard = (
  fragment: CorrectScoreCardFragment,
): TransformedFragment<CorrectScoreCard> => {
  const { __typename, urn, numberOfItemsToDisplay, market } = fragment;

  return {
    data: {
      typename: __typename,
      urn,
      numberOfItemsToDisplay: numberOfItemsToDisplay || undefined,
      market: market.urn,
    },
  };
};

export default normalizeCorrectScoreCardFragmentIntoCorrectScoreCard;
