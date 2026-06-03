/* eslint-disable no-underscore-dangle */
import { FixtureCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { FixtureCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeFixtureCardFragmentIntoFixtureCard = (card: FixtureCardFragment): TransformedFragment<FixtureCard> => ({
  data: {
    urn: card.urn,
    fixture: "urn" in card.fixture ? card.fixture.urn : "",
    typename: card.__typename,
    eventViewLink: card.fixtureEventViewLink,
    sportevent: card.sportevent.urn,
    availableToSubscribe: card.availableToSubscribe,
    red7Scoreboard: card.red7Scoreboard,
  },
});

export default normalizeFixtureCardFragmentIntoFixtureCard;
