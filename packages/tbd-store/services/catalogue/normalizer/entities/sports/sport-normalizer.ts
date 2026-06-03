import { Sport } from "../../../../../state/entities";
import { SportFragment, SportWithShortNameFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportFragmentIntoSport = (
  sport: SportFragment | SportWithShortNameFragment,
): TransformedFragment<Sport> => {
  const { urn, name, sportId, __typename } = sport;

  const shortName = "shortName" in sport && sport.shortName ? sport.shortName : undefined;

  return {
    data: {
      typename: __typename,
      urn,
      name,
      shortName,
      sportId,
    },
  };
};

export default normalizeSportFragmentIntoSport;
