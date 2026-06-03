// TODO: to add typename after engine is implemented
// type CardGroupCardWithTypename = CardGroupCard & { typename: "CardGroupCard" };

import { ViewZoneFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ViewZone } from "../../../../../state/layout/cards/ViewZone.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeViewZoneFragmentIntoViewZone = (viewZone: ViewZoneFragment): TransformedFragment<ViewZone> => {
  const { urn, title, viewZoneItems, __typename } = viewZone;

  return {
    data: {
      urn,
      typename: __typename,
      title,
      items: viewZoneItems.edges.reduce((acc: PartialItem[], item) => {
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

export default normalizeViewZoneFragmentIntoViewZone;
