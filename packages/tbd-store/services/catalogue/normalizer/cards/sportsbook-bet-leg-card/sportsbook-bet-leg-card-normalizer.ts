import { BetLegCard } from "../../../../../state/layout/cards/Card.types";
import { SportsbookBetLegCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportsbookBetLegCardFragmentIntoSportsbookBetLegCard = ({
  urn,
  betUrn,
  leg,
  __typename,
}: SportsbookBetLegCardFragment): TransformedFragment<BetLegCard> => ({
  data: {
    urn,
    betURN: betUrn,
    typename: __typename,
    legURN: leg.urn,
  },
});

export default normalizeSportsbookBetLegCardFragmentIntoSportsbookBetLegCard;
