/* eslint-disable no-underscore-dangle */

import { VirtualCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PartialItem } from "../../../../../state/layout/Layout.types";
import { VirtualCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeVirtualCardGroupFragmentIntoVirtualCardGroup = (
  virtualCardGroup: VirtualCardGroupFragment,
): TransformedFragment<VirtualCardGroup> => {
  const { urn, items, __typename } = virtualCardGroup;

  return {
    data: {
      urn,
      typename: __typename,
      items: items.edges.reduce((acc: PartialItem[], item) => {
        if (item && "urn" in item.node) {
          return [
            ...acc,
            {
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

export default normalizeVirtualCardGroupFragmentIntoVirtualCardGroup;
