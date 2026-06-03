import { VirtualMarketCard } from "../../../../../state/layout/cards/Card.types";
import { VirtualMarketCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeVirtualMarketCardFragmentIntoVirtualMarketCard = (
  virtualMarketCard: VirtualMarketCardFragment,
): TransformedFragment<VirtualMarketCard> => {
  const { urn, title, marketHierarchy, displayRunners, gameRulesViewLink, __typename } = virtualMarketCard;

  return {
    data: {
      typename: __typename,
      urn,
      title,
      event: marketHierarchy.virtualEvent.urn,
      market: displayRunners.market.urn,
      gameRulesViewLink,
    },
  };
};

export default normalizeVirtualMarketCardFragmentIntoVirtualMarketCard;
