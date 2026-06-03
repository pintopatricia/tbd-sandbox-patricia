import { GameInfoCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GameInfoCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeGameInfoCardFragmentIntoGameInfoCard = (
  gameInfoCard: GameInfoCardFragment,
): TransformedFragment<GameInfoCard> => {
  const { urn, game, __typename } = gameInfoCard;

  return {
    data: {
      urn,
      typename: __typename,
      game: game.urn,
    },
  };
};

export default normalizeGameInfoCardFragmentIntoGameInfoCard;
