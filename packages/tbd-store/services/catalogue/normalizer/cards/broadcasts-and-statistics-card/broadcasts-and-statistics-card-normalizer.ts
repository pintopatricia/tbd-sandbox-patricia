import { BroadcastsAndStatisticsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BroadcastsAndStatisticsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBroadcastsAndStatisticsCardFragmentIntoBroadcastsAndStatisticsCard = (
  broadcastsAndStatisticsCard: BroadcastsAndStatisticsCardFragment,
): TransformedFragment<BroadcastsAndStatisticsCard> => {
  const {
    urn,
    eventBroadCasts,
    eventBroadCastsIsCollapsed,
    statisticsViewLink,
    __typename: typename,
    sportevent,
  } = broadcastsAndStatisticsCard;

  return {
    data: {
      typename,
      // Current FE limitation - clear the card if none of the attributes is defined
      urn: !eventBroadCasts && !statisticsViewLink ? "" : urn,
      sportevent: sportevent.urn,
      broadcasts: eventBroadCasts ?? undefined,
      isCollapsed: eventBroadCastsIsCollapsed ?? undefined,
      statisticsViewLink: statisticsViewLink ?? undefined,
    },
  };
};

export default normalizeBroadcastsAndStatisticsCardFragmentIntoBroadcastsAndStatisticsCard;
