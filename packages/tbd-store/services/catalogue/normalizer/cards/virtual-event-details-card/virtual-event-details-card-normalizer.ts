import { VirtualEventDetailsCard } from "../../../../../state/layout/cards/Card.types";
import { VirtualEventDetailsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeVirtualEventDetailsCardFragmentIntoVirtualEventDetailsCard = (
  virtualEventDetailsCard: VirtualEventDetailsCardFragment,
): TransformedFragment<VirtualEventDetailsCard> => {
  const { __typename, urn, virtualEvent } = virtualEventDetailsCard;

  return {
    data: {
      typename: __typename,
      urn,
      virtualEvent: virtualEvent.urn,
    },
  };
};

export default normalizeVirtualEventDetailsCardFragmentIntoVirtualEventDetailsCard;
