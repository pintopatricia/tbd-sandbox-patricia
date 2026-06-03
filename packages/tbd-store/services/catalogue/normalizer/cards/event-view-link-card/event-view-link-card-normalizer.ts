/* eslint-disable no-underscore-dangle */

import {
  EventViewLinkCardFragment,
  EventViewLinkCardWithoutFixtureFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { EventViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeEventViewLinkCardFragmentIntoEventViewLinkCard = (
  fragment: EventViewLinkCardFragment | EventViewLinkCardWithoutFixtureFragment,
): TransformedFragment<EventViewLinkCard> => {
  const { urn, __typename, sportevent, viewLink } = fragment;

  const data = {
    urn,
    typename: __typename,
    sportevent: sportevent.urn,
    viewLink,
  };

  if ("eventViewLinkFixture" in fragment && fragment.eventViewLinkFixture) {
    const fixture = fragment.eventViewLinkFixture;

    return {
      data: {
        ...data,
        fixture: (fixture && "urn" in fixture && fixture.urn) || undefined,
      },
    };
  }

  return {
    data,
  };
};

export default normalizeEventViewLinkCardFragmentIntoEventViewLinkCard;
