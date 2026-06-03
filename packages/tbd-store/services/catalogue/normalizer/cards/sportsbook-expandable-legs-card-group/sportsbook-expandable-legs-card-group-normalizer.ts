import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { SportsbookExpandableLegCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { SportsbookExpandableLegCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

/**
 * TODO This will be refactored after the release of My Bets SBK, because BetInfoCard should be inside the items list
 * and not on a different property. This was not done on this phase to avoid a BFF breaking change, but will be done
 * as soon as possible. This change will occur on BFF schema and resolver, and on GraphQL query and on this normalizer
 */

const normalizeSportsbookExpandableLegCardGroupFragmentIntoSportsbookExpandableLegCardGroup = (
  sportsbookExpandableLegCardGroup: SportsbookExpandableLegCardGroupFragment,
): TransformedFragment<SportsbookExpandableLegCardGroup> => {
  const { urn, full, __typename, isBetPanelOpen } = sportsbookExpandableLegCardGroup;

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
      isBetPanelOpen,
    },
  };
};

export default normalizeSportsbookExpandableLegCardGroupFragmentIntoSportsbookExpandableLegCardGroup;
