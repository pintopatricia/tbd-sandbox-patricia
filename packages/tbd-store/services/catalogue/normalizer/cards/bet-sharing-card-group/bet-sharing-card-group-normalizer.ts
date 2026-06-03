import { BetSharingCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { BetSharingCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import normalizeSportsbookBetFragmentIntoSportsbookBet from "../../entities/sportsbook-bet/sportsbook-bet-normalizer";

const normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup = ({
  __typename,
  urn,
  bet,
  full,
}: BetSharingCardGroupFragment): TransformedFragment<BetSharingCardGroup> => ({
  data: {
    typename: __typename,
    urn,
    bet: normalizeSportsbookBetFragmentIntoSportsbookBet(bet).data,
    items: full.edges.reduce((acc: PartialItem[], item, index) => {
      if (item && full.edges[index] !== null && "urn" in item.node) {
        // eslint-disable-next-line no-underscore-dangle
        return [...acc, { typename: item.node.__typename, urn: item.node.urn }];
      }
      return acc;
    }, []),
  },
});

export default normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup;
