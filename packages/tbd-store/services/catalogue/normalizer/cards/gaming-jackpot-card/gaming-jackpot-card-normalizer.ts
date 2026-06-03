import { GamingJackpotCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GamingJackpotCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeGamingJackpotCardFragmentIntoGamingJackpotCard = (
  gamingJackpotCard: GamingJackpotCardFragment,
): TransformedFragment<GamingJackpotCard> => {
  const { urn, logo, name, jackpots, __typename } = gamingJackpotCard;

  return {
    data: {
      urn,
      typename: __typename,
      name,
      logo,
      jackpots: jackpots.map((jackpot) => jackpot.urn),
    },
  };
};

export default normalizeGamingJackpotCardFragmentIntoGamingJackpotCard;
