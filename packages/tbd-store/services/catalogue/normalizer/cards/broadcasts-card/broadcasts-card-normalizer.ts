// TODO: to add typename after engine is implemented
// type BroadcastsCardWithTypename = BroadcastsCard & { typename: "BroadcastsCard" };

import { BroadcastsCardDeprecatedFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BroadcastsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBroadcastsCardFragmentIntoBroadcastsCard = (
  broadcastsCard: BroadcastsCardDeprecatedFragment,
): TransformedFragment<BroadcastsCard> => {
  const { urn, broadcasts, isCollapsed, __typename } = broadcastsCard;

  return {
    data: {
      typename: __typename,
      urn,
      broadcasts,
      isCollapsed,
    },
  };
};

export default normalizeBroadcastsCardFragmentIntoBroadcastsCard;
