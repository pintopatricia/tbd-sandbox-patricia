/* eslint-disable no-underscore-dangle */

import { GenericViewLinkCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GenericViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragment from "../display-name/display-name-normalizer";

const normalizeGenericViewLinkCardFragmentIntoGenericViewLinkCard = (
  genericViewLinkCard: GenericViewLinkCardFragment,
): TransformedFragment<GenericViewLinkCard> => {
  const { urn, genericViewLinkTitle, viewLink, __typename, badge, sportIcon } = genericViewLinkCard;

  return {
    data: {
      typename: __typename,
      urn,
      title: normalizeDisplayNameFragment(genericViewLinkTitle),
      viewLink,
      badge,
      sportId: sportIcon?.sport?.sportId,
    },
  };
};

export default normalizeGenericViewLinkCardFragmentIntoGenericViewLinkCard;
