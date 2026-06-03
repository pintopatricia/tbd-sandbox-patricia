import { TimeFormBroadCastsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { TimeFormBroadCastsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";

const normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard = (
  timeFormBroadCastsCard: TimeFormBroadCastsCardFragment,
): TransformedFragment<TimeFormBroadCastsCard> => {
  const { urn, selectedRace, raceBroadCasts, __typename, availableToSubscribe, raceToSubscribe } =
    timeFormBroadCastsCard;

  return {
    data: {
      typename: __typename,
      // Current FE limitation - clear the card if none of the attributes is defined
      urn: !selectedRace && !raceBroadCasts && !availableToSubscribe ? "" : urn,
      broadcasts: raceBroadCasts ?? undefined,
      race: selectedRace?.urn ?? undefined,
      availableToSubscribe,
      raceToSubscribe: raceToSubscribe ?? undefined,
    },
  };
};

export default normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard;
