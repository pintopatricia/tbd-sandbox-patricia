import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { SportsbookBetLegCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { SportsbookBetLegCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportsbookBetLegCardGroupFragmentIntoSportsbookBetLegCardGroup = (
  betCardGroup: SportsbookBetLegCardGroupFragment,
): TransformedFragment<SportsbookBetLegCardGroup> => {
  const { urn, full, __typename } = betCardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      items: full.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
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

export default normalizeSportsbookBetLegCardGroupFragmentIntoSportsbookBetLegCardGroup;
