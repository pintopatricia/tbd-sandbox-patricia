// TODO: to add typename after engine is implemented
// type CardGroupCardWithTypename = CardGroupCard & { typename: "CardGroupCard" };

import { ByTimeRangeMeetingCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/Layout.types";
import { ByTimeRangeMeetingCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup = (
  cardGroup: ByTimeRangeMeetingCardGroupFragment,
): TransformedFragment<ByTimeRangeMeetingCardGroup> => {
  const { urn, cardGroupTitle: title, displayName, meetingItems, __typename, icon } = cardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      displayName: displayName ?? undefined,
      icon: icon ?? undefined,
      items: meetingItems.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && meetingItems.edges[index] !== null && "urn" in item.node) {
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

export default normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup;
