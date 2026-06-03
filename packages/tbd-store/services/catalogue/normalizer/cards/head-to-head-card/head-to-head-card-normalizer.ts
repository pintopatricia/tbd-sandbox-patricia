/* eslint-disable no-underscore-dangle */
import { HeadToHeadCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { HeadToHeadCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

export const shouldRenderHeadToHeadCard = (headToHeadCard: HeadToHeadCardFragment): boolean =>
  !!headToHeadCard.footballFixture?.head2head?.home?.length &&
  !!headToHeadCard.footballFixture?.head2head?.away?.length;

const normalizeHeadToHeadCardFragmentIntoHeadToHeadCard = (
  card: HeadToHeadCardFragment,
): TransformedFragment<HeadToHeadCard> => ({
  data: {
    urn: card.urn,
    typename: card.__typename,
    fixture: card.footballFixture.urn,
  },
});

export default normalizeHeadToHeadCardFragmentIntoHeadToHeadCard;
