/* eslint-disable no-underscore-dangle */
import {
  ExpandableMarketCardFragment,
  ExpandableMarketCardEnrichedPartialFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { ExpandableMarketCard, PartialExpandableMarketCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

/**
 * Typeguard to check if an ExpandableMarketCard is ready to be hydrated.
 * @param expandableMarketCard The ExpandableMarketCard fragment to check.
 */
const isExpandableMarketCardHydrated = (
  expandableMarketCard: ExpandableMarketCardFragment | ExpandableMarketCardEnrichedPartialFragment,
): expandableMarketCard is ExpandableMarketCardFragment =>
  expandableMarketCard.__typename === "ExpandableMarketCard" && "marketCardURN" in expandableMarketCard;

const normalizeExpandableMarketCardFragmentIntoExpandableMarketCard = (
  expandableMarketCard: ExpandableMarketCardFragment | ExpandableMarketCardEnrichedPartialFragment,
): TransformedFragment<ExpandableMarketCard | PartialExpandableMarketCard> => {
  if (isExpandableMarketCardHydrated(expandableMarketCard)) {
    const { urn, title, marketCardURN, viewOpenBets, __typename } = expandableMarketCard;

    return {
      data: {
        typename: __typename,
        urn,
        title,
        marketCardURN,
        viewOpenBets: viewOpenBets || undefined,
      },
    };
  }

  // If the fragment is a partial, we return a minimal object containing only the necessary properties to render the shell.
  const { urn, title, __typename } = expandableMarketCard;

  return {
    data: {
      typename: __typename,
      urn,
      title,
    },
  };
};

export default normalizeExpandableMarketCardFragmentIntoExpandableMarketCard;
