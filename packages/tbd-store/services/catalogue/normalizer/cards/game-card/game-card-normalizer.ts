import { GameCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GameCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeGameCardFragmentIntoGameCard = (gameCard: GameCardFragment): TransformedFragment<GameCard> => {
  const { urn, game, __typename } = gameCard;

  return {
    data: {
      urn,
      typename: __typename,
      game: game.urn,
    },
  };
};

export default normalizeGameCardFragmentIntoGameCard;
