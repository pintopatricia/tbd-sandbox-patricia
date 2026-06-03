import { VirtualEvent } from "../../../../../state/entities";
import { VirtualEventFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeVirtualEventFragmentIntoVirtualEvent = (
  virtualEvent: VirtualEventFragment,
): TransformedFragment<VirtualEvent> => {
  const { distance, duration, eventId, name, openDate, urn, venue, sport, __typename } = virtualEvent;

  return {
    data: {
      typename: __typename,
      eventId,
      name,
      openDate,
      sport: sport.urn,
      urn,
      venue,
      duration,
      distance,
      isExpired: new Date(openDate).getTime() - Date.now() < 0,
    },
  };
};

export default normalizeVirtualEventFragmentIntoVirtualEvent;
