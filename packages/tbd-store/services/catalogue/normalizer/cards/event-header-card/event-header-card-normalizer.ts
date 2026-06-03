/* eslint-disable no-underscore-dangle */
import { EventHeaderCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { EventHeaderCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeEventHeaderCardFragmentIntoEventHeaderCard = (
  card: EventHeaderCardFragment,
): TransformedFragment<EventHeaderCard> => ({
  data: {
    urn: card.urn,
    typename: card.__typename,
    title: card.title,
    subtitle: card.subtitle || undefined,
    tertiaryTitle: card.tertiaryTitle || undefined,
    sportId: card.sportId || undefined,
    date: card.date || undefined,
  },
});

export default normalizeEventHeaderCardFragmentIntoEventHeaderCard;
