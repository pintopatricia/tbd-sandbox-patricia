import { RaceResultsCard } from "../../../../../state/layout/cards/Card.types";
import { RaceResultsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRaceResultsCardFragmentIntoRaceResultsCard = (
  raceResultsCard: RaceResultsCardFragment,
): TransformedFragment<RaceResultsCard> => {
  const { urn, race, __typename } = raceResultsCard;

  return {
    data: {
      typename: __typename,
      urn,
      race: race.urn,
    },
  };
};

export default normalizeRaceResultsCardFragmentIntoRaceResultsCard;
