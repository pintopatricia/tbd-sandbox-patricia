/* eslint-disable no-underscore-dangle */
import { MatchStatsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MatchStatsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMatchStatsCardFragmentIntoMatchStatsCard = (
  card: MatchStatsCardFragment,
): TransformedFragment<MatchStatsCard> => ({
  data: {
    urn: card.urn,
    typename: card.__typename,
    fixture: card.footballFixture.urn,
  },
});

export default normalizeMatchStatsCardFragmentIntoMatchStatsCard;
