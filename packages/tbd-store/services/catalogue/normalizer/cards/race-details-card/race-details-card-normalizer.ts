import { RaceDetailsCard } from "../../../../../state/layout/cards/Card.types";
import { RaceDetailsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRaceDetailsCardFragmentIntoRaceDetailsCard = (
  raceDetailsCard: RaceDetailsCardFragment,
): TransformedFragment<RaceDetailsCard> => {
  const { urn, race, numberOfRunners, raceClass, showMeetingInfo, raceViewLink, __typename, availableToSubscribe } =
    raceDetailsCard;

  return {
    data: {
      typename: __typename,
      urn,
      race: race.urn,
      numberOfRunners,
      raceClass,
      showMeetingInfo,
      raceViewLink,
      availableToSubscribe,
    },
  };
};

export default normalizeRaceDetailsCardFragmentIntoRaceDetailsCard;
