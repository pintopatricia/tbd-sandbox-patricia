import { VirtualMarket } from "../../../../../state/entities";
import { VirtualMarketFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { SportsbookMarketStatus as SportsbookMarketStatusValues } from "../../../../../state/constants";
import { SportsbookMarketStatus } from "../../../../../state";

const marketStatusToSportsbookMarketStatusMap: { [k: string]: SportsbookMarketStatus } = {
  OPEN: SportsbookMarketStatusValues.OPEN,
  SUSPENDED: SportsbookMarketStatusValues.SUSPENDED,
  CLOSED: SportsbookMarketStatusValues.CLOSED,
};

const normalizeVirtualMarketFragmentIntoVirtualMarket = (
  virtualMarket: VirtualMarketFragment,
): TransformedFragment<VirtualMarket> => {
  const {
    __typename,
    urn,
    marketId,
    marketType,
    name,
    hasEachWay,
    eachWayPlaces,
    eachWayFraction,
    sport,
    event,
    runners,
    status,
  } = virtualMarket;

  return {
    data: {
      typename: __typename,
      marketId,
      urn,
      marketType,
      name,
      hasEachWay: !!hasEachWay,
      eachWayPlaces: eachWayPlaces ?? undefined,
      eachWayFraction: eachWayFraction ?? undefined,
      runners: runners.map(({ runnerURN }) => runnerURN),
      sport: sport.urn,
      event: event.urn,
      status: marketStatusToSportsbookMarketStatusMap[status] || SportsbookMarketStatusValues.OPEN,
    },
  };
};

export default normalizeVirtualMarketFragmentIntoVirtualMarket;
