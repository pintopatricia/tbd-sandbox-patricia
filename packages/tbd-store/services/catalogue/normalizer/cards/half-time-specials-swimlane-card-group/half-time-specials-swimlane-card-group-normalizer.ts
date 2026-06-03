import { HalfTimeSpecialsSwimlaneCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/Layout.types";
import { HalfTimeSpecialsSwimlaneCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCardGroupFragmentIntoCardGroup = (
  halfTimeSpecialsSwimlaneCardGroup: HalfTimeSpecialsSwimlaneCardGroupFragment,
): TransformedFragment<HalfTimeSpecialsSwimlaneCardGroup> => {
  const {
    urn,
    halfTimeSpecialsCardGroupTitle: title,
    cardGroupSubtitle: subtitle,
    displayName,
    halfTimeSpecialsPartials: partials,
    halfTimeSpecialsFull: full,
    isIconSupportingTitle,
    isDecorated,
    __typename,
  } = halfTimeSpecialsSwimlaneCardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      subtitle: subtitle ?? undefined,
      displayMode: "SCROLLABLE",
      displayName: displayName ?? undefined,

      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
          acc.push({
            // eslint-disable-next-line no-underscore-dangle
            typename: item.node.__typename,
            urn: item.node.urn,
          });
        }
        return acc;
      }, []),
      isDecorated,
      isIconSupportingTitle,
    },
  };
};

export default normalizeCardGroupFragmentIntoCardGroup;
