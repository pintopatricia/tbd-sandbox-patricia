import { PriceBoostMultisListCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PriceBoostMultisListCard, PackagedCreatedBetsItem } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { normalizeBlurbFragment } from "../blurb-card/blurb-card-normalizer";

function mapBlurb(blurbs: PriceBoostMultisListCardFragment["blurbs"]) {
  if (!blurbs) {
    return null;
  }

  const [firstBlurb] = blurbs;

  if (!firstBlurb) {
    return null;
  }

  return normalizeBlurbFragment(firstBlurb);
}

const normalizePriceBoostMultisListCardFragmentIntoPriceBoostMultisListCard = (
  pbmlCard: PriceBoostMultisListCardFragment,
): TransformedFragment<PriceBoostMultisListCard> => {
  const { __typename, urn, pbmTitle, showWasPrice, items, blurbs } = pbmlCard;

  return {
    data: {
      urn,
      typename: __typename,
      blurb: mapBlurb(blurbs),
      displayName: pbmTitle,
      showWasPrice,
      hasNextPage: !!items.pageInfo?.hasNextPage,
      endCursor: items.pageInfo?.endCursor || undefined,
      items: items.edges.reduce((acc: PackagedCreatedBetsItem[], item) => {
        if (item && "urn" in item.node) {
          const { __typename: typename } = item;

          return [...acc, { urn: item.node.urn, typename, cursor: item.cursor || undefined }];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizePriceBoostMultisListCardFragmentIntoPriceBoostMultisListCard;
