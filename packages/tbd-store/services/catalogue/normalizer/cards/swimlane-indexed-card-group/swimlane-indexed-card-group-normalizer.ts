// TODO: to add typename after engine is implemented
// type CardGroupCardWithTypename = CardGroupCard & { typename: "CardGroupCard" };

import { SwimlaneIndexedCardGroup, DisplayMode } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/Layout.types";
import { SwimlaneIndexedCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { getCardIcon } from "../../../gql-entities-mapper";

// TODO: This should be infered by display mode available on BFF
const DISPLAY_MODES: Record<string, DisplayMode> = {
  EventMarketCard: "SNAP",
  MarketCard: "SNAP",
  RaceMarketCard: "SNAP",
  PromotionCard: "SNAP",
  MatchStatsCard: "SNAP",
  TeamLineupCard: "SNAP",
  MatchTimelineCard: "SNAP",
  HeadToHeadCard: "SNAP",
  TeamFormCard: "SNAP",
  BetOpportunityPromoCard: "SNAP",
  EditorialPromoCard: "SNAP",
  SelectionPromoCard: "SNAP",
  LoyaltyPromoCard: "SNAP",
};

const normalizeCardGroupFragmentIntoCardGroup = (
  cardGroup: SwimlaneIndexedCardGroupFragment,
): TransformedFragment<SwimlaneIndexedCardGroup> => {
  const { urn, cardGroupTitle: title, displayName, hint, swimlaneItems, viewAll, __typename, icon } = cardGroup;

  function getValidNode(edge: any): edge is { node: { __typename: string } } {
    return edge && "__typename" in edge.node;
  }

  const validNode = swimlaneItems.edges.find(getValidNode);
  // eslint-disable-next-line no-underscore-dangle
  const cardType = (validNode && validNode.node.__typename) || "";
  const displayMode = DISPLAY_MODES[cardType] || "SCROLLABLE";

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      displayMode,
      displayName: displayName ?? undefined,
      icon: icon ?? undefined,
      viewAll: viewAll?.label
        ? {
            label: viewAll.label,
            icon: viewAll.icon ? getCardIcon(viewAll.icon) : undefined,
            viewLink: viewAll.viewLink,
          }
        : undefined,
      hint: hint ?? undefined,
      items: swimlaneItems.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && swimlaneItems.edges[index] !== null && "urn" in item.node) {
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

export default normalizeCardGroupFragmentIntoCardGroup;
