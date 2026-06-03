/* eslint-disable no-underscore-dangle */
import { MatchTimelineCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MatchTimelineCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMatchTimelineCardFragmentIntoMatchTimelineCard = (
  card: MatchTimelineCardFragment,
): TransformedFragment<MatchTimelineCard> => ({
  data: {
    urn: card.urn,
    typename: card.__typename,
    fixture: card.footballFixture.urn,
  },
});

export default normalizeMatchTimelineCardFragmentIntoMatchTimelineCard;
