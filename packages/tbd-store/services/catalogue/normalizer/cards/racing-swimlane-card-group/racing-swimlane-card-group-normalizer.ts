/* eslint-disable no-underscore-dangle */
import type { RacingSwimlaneCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import type { PartialItem } from "../../../../../state/layout/Layout.types";
import type { RacingSwimlaneCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import type { TransformedFragment } from "../../Normalizer.types";
import { getCardIcon } from "../../../gql-entities-mapper";

const normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup = (
  swimlaneCardGroup: RacingSwimlaneCardGroupFragment,
): TransformedFragment<RacingSwimlaneCardGroup> => {
  const {
    urn,
    racingSwimlaneCardGroupTitle: title,
    displayName,
    partialItems,
    fullItems,
    viewAll,
    __typename,
  } = swimlaneCardGroup;

  const isExpectedPartialItem = (item: any): item is PartialItem =>
    item && "urn" in item && "__typename" in item && item.__typename === "RaceMarketCard";

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      displayName: displayName ?? undefined,
      viewAll: viewAll?.label
        ? {
            label: viewAll.label,
            icon: viewAll.icon ? getCardIcon(viewAll.icon) : undefined,
            viewLink: viewAll.viewLink,
          }
        : undefined,
      items: partialItems.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && fullItems.edges[index] !== null && isExpectedPartialItem(item.node)) {
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

export default normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup;
