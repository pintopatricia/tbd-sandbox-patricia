import { GameWithReleaseDate, GamingLinkCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { getCardIcon } from "../../../gql-entities-mapper";
import { GamingLinkCard } from "../../../../../state/layout/cards/Card.types";

const normalizeGamingLinkCardFragmentIntoGamingLinkCard = (
  gamingLinkCard: GamingLinkCardFragment,
): TransformedFragment<GamingLinkCard> => {
  const { urn, link, __typename, games } = gamingLinkCard;

  return {
    data: {
      urn,
      typename: __typename,
      games: games.filter((game): game is GameWithReleaseDate => game !== null),
      link: {
        label: link.label,
        icon: link.icon ? getCardIcon(link.icon) : undefined,
        viewLink: link.viewLink,
      },
    },
  };
};

export default normalizeGamingLinkCardFragmentIntoGamingLinkCard;
