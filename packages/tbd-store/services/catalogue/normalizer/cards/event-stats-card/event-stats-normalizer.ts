// TODO: to add typename after engine is implemented
// type EventMarketCardWithTypename = EventMarketCard & { typename: "EventMarketCard" };

import { EventStatsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { EventStatsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeEventMarketCardFragmentIntoEventMarketCard = (
  card: EventStatsCardFragment,
): TransformedFragment<EventStatsCard> => {
  const { urn, matchStatsUrl, __typename } = card;

  return {
    data: {
      urn,
      typename: __typename,
      matchStatsUrl,
    },
  };
};

export default normalizeEventMarketCardFragmentIntoEventMarketCard;
