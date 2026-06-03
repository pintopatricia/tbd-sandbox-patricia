import {
  CompetitionViewLinkCardFragment,
  CompetitionViewLinkCardBasicFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { CompetitionViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCompetitionViewLinkCardFragmentIntoCompetitionViewLinkCard = (
  competitionViewLinkCard: CompetitionViewLinkCardFragment | CompetitionViewLinkCardBasicFragment,
): TransformedFragment<CompetitionViewLinkCard> => {
  const { urn, competition, viewLink, __typename } = competitionViewLinkCard;

  return {
    data: {
      urn,
      typename: __typename,
      competition: competition.urn,
      viewLink,
    },
  };
};

export default normalizeCompetitionViewLinkCardFragmentIntoCompetitionViewLinkCard;
