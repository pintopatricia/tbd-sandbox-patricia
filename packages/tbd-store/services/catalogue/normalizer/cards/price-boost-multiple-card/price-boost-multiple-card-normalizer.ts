/* eslint-disable no-underscore-dangle */
import { PriceBoostMultisCard } from "../../../../../state/layout/cards/Card.types";
import { PriceBoostMultisCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePriceBoostMultipleCardFragmentIntoPriceBoostMultipleCard = (
  fragment: PriceBoostMultisCardFragment,
): TransformedFragment<PriceBoostMultisCard> => {
  const { __typename, urn, pbmTitle, showWasPrice, popularbettingopportunity } = fragment;

  const title =
    pbmTitle != null && pbmTitle.__typename === "DisplayNameTitle" ? pbmTitle.name : pbmTitle?.translationKey;

  return {
    data: {
      typename: __typename,
      title: title ?? "",
      urn,
      showWasPrice,
      popularbettingopportunity: popularbettingopportunity.urn,
    },
  };
};

export default normalizePriceBoostMultipleCardFragmentIntoPriceBoostMultipleCard;
