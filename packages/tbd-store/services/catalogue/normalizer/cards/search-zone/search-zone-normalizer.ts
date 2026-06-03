// TODO: to add typename after engine is implemented
// type CardGroupCardWithTypename = CardGroupCard & { typename: "CardGroupCard" };

import { SearchZoneFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SearchZone } from "../../../../../state/layout/cards/SearchZone.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSearchZoneFragmentIntoSearchZone = (searchZone: SearchZoneFragment): TransformedFragment<SearchZone> => {
  const { urn, searchZoneItems, __typename } = searchZone;

  return {
    data: {
      urn,
      typename: __typename,
      items: searchZoneItems.edges.reduce((acc: PartialItem[], item) => {
        if (item && item.node && "urn" in item.node) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeSearchZoneFragmentIntoSearchZone;
