import { RecentFormCard } from "../../../../../state/layout/cards/Card.types";
import { TeamFormCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeTeamFormCardFragmentIntoTeamFormCard = (
  fragment: TeamFormCardFragment,
): TransformedFragment<RecentFormCard> => {
  const { urn, __typename, footballFixture } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      fixture: footballFixture.urn,
    },
  };
};

export default normalizeTeamFormCardFragmentIntoTeamFormCard;
